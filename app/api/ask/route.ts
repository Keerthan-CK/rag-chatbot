import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Number of top chunks to retrieve
const TOP_K = 5;

export async function POST(req: Request) {
  try {
    const { docId, question, userId } = await req.json();

    if (!docId || !question || !userId) {
      return NextResponse.json(
        { error: "docId, question, and userId are required" },
        { status: 400 }
      );
    }


    const embedModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const qEmbeddingRes = await embedModel.embedContent({
      content: { parts: [{ text: question }], role: "user" },
    });
    const queryVector = qEmbeddingRes.embedding.values;

    
    const { data: chunks, error: searchError } = await supabase.rpc(
      "match_chunks",
      {
        query_embedding: queryVector,
        match_count: TOP_K,
        p_doc_id: docId,
      }
    );

    if (searchError) throw searchError;

    const context = chunks.map((c: any) => c.content).join("\n\n");

    
    const chatModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
You are a helpful assistant that answers questions based on user documents.

User Question:
${question}

Relevant Context:
${context}

Answer clearly and cite sources when relevant.
`;

    const result = await chatModel.generateContent(prompt);
    const answer = result.response.text();

 
    const { data: conv, error: convError } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        doc_id: docId,
        question,
        answer,
        sources: chunks.map((c: any) => c.id), 
      })
      .select()
      .single();

    if (convError) throw convError;

    return NextResponse.json({ answer, sources: chunks });
  } catch (err: any) {
    console.error("RAG error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
