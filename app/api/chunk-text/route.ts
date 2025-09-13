import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function POST(req: Request) {
  try {
    const { text, docId } = await req.json();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.splitText(text);

    const { error } = await supabase.from("chunks").insert(
      chunks.map((chunk: string, idx: number) => ({
        doc_id: docId,
        content: chunk,
        order: idx,
      }))
    );

    if (error) throw error;

    return NextResponse.json({ chunks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
