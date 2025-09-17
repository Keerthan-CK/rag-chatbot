"use client";

import { useState } from "react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";

export default function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      
      const formData = new FormData();
      formData.append("file", file);

      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      alert("✅ File uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 border border-white/10 bg-black/40 rounded-2xl shadow-lg text-center">
      <div
        className="border-2 border-dashed border-white/20 rounded-xl p-8 cursor-pointer hover:bg-white/5 transition"
        onClick={() => document.getElementById("doc-input")?.click()}
      >
        <input
          type="file"
          id="doc-input"
          accept=".pdf,.txt"
          className="hidden"
          onChange={handleFileChange}
        />

        {!file ? (
          <div className="flex flex-col items-center space-y-2 text-gray-300">
            <UploadCloud size={40} />
            <p className="text-sm">Click or drag & drop your document here</p>
            <p className="text-xs text-gray-500">Supports PDF & TXT</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <FileText size={32} className="text-indigo-400" />
            <p className="text-sm font-medium">{file.name}</p>
          </div>
        )}
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
        >
          {uploading ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} />}
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      )}
    </div>
  );
}
