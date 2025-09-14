import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const docId = searchParams.get("docId");
  const userId = searchParams.get("userId");

  const { data, error } = await supabase
    .from("conversations")
    .select("id, question, answer, sources, created_at")
    .eq("user_id", userId)
    .eq("doc_id", docId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ conversations: data });
}
