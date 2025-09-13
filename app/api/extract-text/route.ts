// app/api/extract-text/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import pdf from "pdf-parse";
import mammoth from "mammoth";

export async function POST(req: Request) {
  try {
    const { filePath } = await req.json();

    const { data, error } = await supabase.storage
      .from("documents")
      .download(filePath);

    if (error || !data) {
      return NextResponse.json({ error: "File download failed" }, { status: 400 });
    }

    const buffer = Buffer.from(await data.arrayBuffer());
    let text = "";

    if (filePath.endsWith(".pdf")) {
      const pdfData = await pdf(buffer);
      text = pdfData.text;
    } else if (filePath.endsWith(".txt")) {
      text = buffer.toString("utf-8");
    } else if (filePath.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
