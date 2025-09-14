"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Document = {
  id: string;
  title: string | null;
  file_path: string | null;
  status: string | null;
  created_at: string;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchDocuments() {
    setLoading(true);
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setDocuments(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchDocuments();

    // Live updates (optional, using Supabase Realtime)
    const channel = supabase
      .channel("documents-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents" },
        () => fetchDocuments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const filePath = `docs/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("documents").insert({
      title: file.name,
      file_path: filePath,
      user_id: user?.id,
      status: "processing",
    });

    if (insertError) console.error(insertError);

    fetchDocuments();
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Documents</h2>

      {/* File Uploader */}
      <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center">
        <p className="mb-2 text-gray-400">Upload a PDF or TXT file</p>
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleUpload}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Choose File
        </label>
      </div>

      {/* Document List */}
      {loading && <p className="text-gray-400">Loading...</p>}

      {!loading && documents.length === 0 && (
        <p className="text-gray-500">No documents uploaded yet.</p>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="border border-gray-800 rounded-lg p-4 bg-gray-900 flex flex-col"
          >
            <h3 className="font-medium text-white truncate">{doc.title}</h3>
            <p className="text-xs text-gray-400">
              {new Date(doc.created_at).toLocaleDateString()}
            </p>

            {/* Status badge */}
            <span
              className={`mt-2 inline-block w-fit rounded-full px-2 py-1 text-xs font-medium ${
                doc.status === "ready"
                  ? "bg-green-600/20 text-green-400"
                  : doc.status === "processing"
                  ? "bg-yellow-600/20 text-yellow-400 animate-pulse"
                  : "bg-red-600/20 text-red-400"
              }`}
            >
              {doc.status}
            </span>

            <p className="text-xs text-gray-500 mt-2 truncate">{doc.file_path}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
