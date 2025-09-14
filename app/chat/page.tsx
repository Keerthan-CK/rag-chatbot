"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

interface Message {
  id?: string;
  role: "user" | "bot";
  content: string;
  sources?: any[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: convs } = await supabase
        .from("conversations")
        .select("id, question, answer, sources")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (convs) {
        const formatted: Message[] = [];
        convs.forEach((c) => {
          formatted.push({ role: "user", content: c.question });
          formatted.push({
            role: "bot",
            content: c.answer,
            sources: c.sources,
          });
        });
        setMessages(formatted);
      }
    };

    load();
  }, []);


  const sendMessage = async () => {
    if (!input.trim() || !userId) return;

    const question = input.trim();

  
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docId: "your-doc-id-here", 
          question,
          userId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.answer, sources: data.sources },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "⚠️ Error: " + data.error },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="p-4 flex items-center border-b border-gray-800">
        <Image src="/logo.png" alt="RAG Chatbot" width={32} height={32} />
        <h1 className="ml-2 font-bold">RAG Chatbot</h1>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-md px-4 py-2 rounded-2xl ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
            >
              <p>{m.content}</p>
              {m.role === "bot" && m.sources && (
                <div className="mt-2 text-xs text-gray-400">
                  Sources: {m.sources.map((s: any) => s.id).join(", ")}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">Bot is thinking...</div>
        )}
      </main>

      {/* Input box */}
      <footer className="p-4 border-t border-gray-800 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 px-4 py-2 rounded-xl bg-gray-900 border border-gray-700 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="ml-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </footer>
    </div>
  );
}
