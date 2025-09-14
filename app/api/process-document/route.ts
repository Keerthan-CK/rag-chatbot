import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse"; // needs install
import * as fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { docId } = await req.json();

    // Fetch document info
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", docId)
      .single();

    if (docError || !doc) throw docError;

    // Download file from Supabase Storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from("documents")
      .download(doc.file_path);

    if (fileError || !fileData) throw fileError;

    const buffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    let text = "";
    if (doc.file_path.endsWith(".pdf")) {
      const pdf = await pdfParse(Buffer.from(uint8Array));
      text = pdf.text;
    } else {
      text = Buffer.from(uint8Array).toString("utf-8");
    }

    // Split into chunks
    const chunkSize = 500; // characters
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    // Insert chunks
    const { data: chunkRows, error: chunkError } = await supabase
      .from("chunks")
      .insert(
        chunks.map((c, i) => ({
          doc_id: docId,
          content: c,
          chunk_order: i,
        }))
      )
      .select();

    if (chunkError) throw chunkError;

    // Generate embeddings
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    for (const chunk of chunkRows) {
      const embeddingRes = await model.embedContent({
        content: { parts: [{ text: chunk.content }], role: "user" },
      });

      const embedding = embeddingRes.embedding.values;

      const { error: embedError } = await supabase.from("embeddings").insert({
        chunk_id: chunk.id,
        embedding,
      });

      if (embedError) throw embedError;
    }


    await supabase
      .from("documents")
      .update({ status: "ready" })
      .eq("id", docId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);


    const { docId } = await req.json().catch(() => ({}));
    if (docId) {
      await supabase.from("documents").update({ status: "error" }).eq("id", docId);
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
