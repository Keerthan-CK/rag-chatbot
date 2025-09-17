// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string; // pass from frontend

    if (!file) throw new Error("No file uploaded");

    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/${randomUUID()}.${fileExt}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Insert into documents table
    const { data: doc, error: insertError } = await supabase
      .from("documents")
      .insert({
        user_id: userId,
        title: file.name,
        file_path: filePath,
        status: "processing",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Kick off processing
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/process-documents`, {
      method: "POST",
      body: JSON.stringify({ docId: doc.id }),
      headers: { "Content-Type": "application/json" },
    });

    return NextResponse.json({ success: true, docId: doc.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
