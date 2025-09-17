"use client";

import { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  SendHorizonal,
  User,
  Bot,
  FileText,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "bot" | "system";
  text: string;
  isTyping?: boolean;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "system",
      text: "👋 Welcome to R.A.G Bot! Upload a document or start chatting!",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: input,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // add typing indicator
    const typingMsg: Message = {
      id: Date.now() + 1,
      sender: "bot",
      text: "",
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMsg]);

    // mock streaming bot reply
    const reply = `You said: ${newMsg.text}`;
    let current = "";
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => !m.isTyping));
      const botMsg: Message = {
        id: Date.now() + 2,
        sender: "bot",
        text: "",
      };
      setMessages((prev) => [...prev, botMsg]);

      [...reply].forEach((ch, i) => {
        setTimeout(() => {
          current += ch;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsg.id ? { ...m, text: current } : m
            )
          );
        }, i * 25);
      });
    }, 600);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(console.error);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Avatar */}
            {msg.sender !== "system" && (
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                    : "bg-gradient-to-br from-purple-500 to-pink-500"
                }`}
              >
                {msg.sender === "user" ? (
                  <User size={16} />
                ) : (
                  <Bot size={16} />
                )}
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-[75%] ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm shadow-md ${
                  msg.sender === "system"
                    ? "bg-gray-800/60 text-gray-300 border border-dashed border-gray-600 text-center italic"
                    : msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white/10 text-gray-100 rounded-bl-none backdrop-blur border border-white/10"
                }`}
              >
                {msg.isTyping ? (
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                  </span>
                ) : (
                  msg.text
                )}
              </div>

              {/* Quick actions for bot */}
              {msg.sender === "bot" && !msg.isTyping && (
                <div className="flex gap-2 mt-2">
                  <button className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-md">
                    Summarize
                  </button>
                  <button className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-md">
                    Explain
                  </button>
                </div>
              )}

              {/* Copy + Feedback */}
              {msg.sender === "bot" && !msg.isTyping && (
                <div className="flex gap-1 mt-1 opacity-70 hover:opacity-100 transition">
                  <button
                    onClick={() => copyToClipboard(msg.text)}
                    className="p-1 hover:bg-white/10 rounded-md"
                    title="Copy"
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    className="p-1 hover:bg-white/10 rounded-md"
                    title="Good"
                  >
                    <ThumbsUp size={12} />
                  </button>
                  <button
                    className="p-1 hover:bg-white/10 rounded-md"
                    title="Bad"
                  >
                    <ThumbsDown size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-white/10 p-3 flex items-center gap-2 bg-black/60">
        {/* Upload */}
        <button
          type="button"
          className="p-2 rounded-xl hover:bg-white/10 transition"
          onClick={() => document.getElementById("doc-upload")?.click()}
        >
          <Paperclip size={20} />
        </button>
        <input
          type="file"
          id="doc-upload"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              const fileName = e.target.files[0].name;
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  sender: "user",
                  text: `📄 Uploaded: ${fileName}`,
                },
              ]);
            }
          }}
        />

        {/* Text input */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-transparent border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Send */}
        <button
          onClick={handleSend}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white"
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
}
