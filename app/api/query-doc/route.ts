import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { query, docId, userId } = await req.json();

    // 1. Create query embedding
    const embedModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const queryEmbed = await embedModel.embedContent({
      content: { parts: [{ text: query }], role: "user" },
    });

    const queryVector = queryEmbed.embedding.values;

    // 2. Vector similarity search
    const { data: matches, error } = await supabase.rpc("match_chunks", {
      query_embedding: queryVector,
      match_count: 5,
      doc_id: docId,
    });

    if (error) throw error;

    // 3. Build context
    const context = matches.map((m: any) => m.content).join("\n\n");

    // 4. Call LLM
    const chatModel = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    You are a helpful assistant. Use the following context to answer the question.
    If you cannot answer from the context, say "I don’t know based on the document."
    
    Context:
    ${context}
    
    Question:
    ${query}
    `;

    const result = await chatModel.generateContent(prompt);
    const answer = result.response.text();

    // 5. Save to conversations table
    await supabase.from("conversations").insert({
      user_id: userId,
      doc_id: docId,
      question: query,
      answer,
      sources: matches.map((m: any) => m.id),
    });

    return NextResponse.json({ answer, sources: matches });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
