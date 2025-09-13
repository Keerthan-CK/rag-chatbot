"use client"

import { useState } from "react"
import { supabase } from  "@/lib/supabaseClient"

export default function uploadDoc() {
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if (!file) return;
        const { data, error } = await supabase.storage
        .from("documents")
        .upload(`docs/${file.name}`, file, { upsert: true });

        if (error) console.error("Upload failed:", error.message);
        else console.log("Uploaded!:", data);
    };

    return (
        <div className="p-6">
            <input type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}/>
            <button onClick={handleUpload}  className="ml-2 px-4 py-2 bg-green-400 hover:bg-green-500 rounded">
                Upload
            </button>
        </div>
    )
}