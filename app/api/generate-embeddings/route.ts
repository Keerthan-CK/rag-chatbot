import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { docId } = await req.json();

    // Get all text chunks for this doc
    const { data: chunks, error } = await supabase
      .from("chunks")
      .select("id, content")
      .eq("doc_id", docId);

    if (error || !chunks) throw error;

    // Load the embedding model
    const model = genAI.getGenerativeModel({ model: "embedding-001" });

    for (const chunk of chunks) {
      // Generate embedding
      const embeddingRes = await model.embedContent({
        content: {
          parts: [{ text: chunk.content }],
          role: "user",
        },
      });

      const embedding = embeddingRes.embedding.values; // Array of floats

      // Save embedding to Supabase
      const { error: insertError } = await supabase.from("embeddings").insert({
        chunk_id: chunk.id,
        embedding,
      });

      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
