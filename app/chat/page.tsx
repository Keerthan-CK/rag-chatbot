"use client";
import { useState, useRef, useEffect } from "react";
import AppSidebar from "@/components/Sidebar";
import {
  Send,
  FileText,
  Bot,
  User,
  Sparkles,
  Clock,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import DocumentUpload from "@/components/DocumentUpload";

interface Message {
  id: string;
  role: "user" | "bot" | "system";
  content: string;
  sources?: string[];
  timestamp: Date;
  isTyping?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content:
        "Sup? Welcome to the R.A.G Bot! Upload a document to get started or ask away!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [contextDocs, setContextDocs] = useState<string[]>(["MyNotes.pdf"]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleSend = async () => {
  if (!input.trim() || isLoading) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    content: input,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsLoading(true);

  
  setMessages((prev) => [
    ...prev,
    { id: "typing", role: "bot", content: "⋯", timestamp: new Date(), isTyping: true },
  ]);

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        docId: "MyNotes.pdf",
        question: userMessage.content,
        userId: "123"
       }),
    });

    if (!response.ok) throw new Error("Failed to fetch");

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let currentText = "";

    
    setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));

    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "bot",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        currentText += chunk;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMessage.id ? { ...m, content: currentText } : m
          )
        );
      }
    }
  } catch (error) {
    console.error("Error sending message:", error);
    setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));
  } finally {
    setIsLoading(false);
    inputRef.current?.focus();
  }
};



  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-black pointer-events-none" />
      <div className="fixed inset-0 bg-grid-white/[0.02] pointer-events-none" />

     
      <AppSidebar />

  
      <div className="flex-1 flex flex-col relative z-10">
       
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                R.A.G Bot
              </h1>
              <p className="text-xs text-gray-400">
                Powered by AI • Always Learning
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="group px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105"
          >
            <FileText size={16} />
            Upload
          </button>
        </header>

        
        {contextDocs.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-black/40 text-xs text-gray-400">
            <span>📄 Context:</span>
            {contextDocs.map((doc, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-gray-300"
              >
                {doc}
              </span>
            ))}
            <button
              onClick={() => setContextDocs([])}
              className="ml-auto text-purple-400 hover:text-pink-400 transition"
            >
              Clear
            </button>
          </div>
        )}

        {/* Upload Area */}
        {showUpload && (
          <div className="absolute top-20 left-6 right-6 z-30 flex justify-center">
            <div className="w-full max-w-2xl bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-top-4 duration-300">
              <DocumentUpload />
              <button
                onClick={() => setShowUpload(false)}
                className="mt-4 w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Close Upload
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              {msg.role !== "system" && (
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                      : "bg-gradient-to-br from-purple-500 to-pink-500"
                  } shadow-lg`}
                >
                  {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
              )}

        
              <div
                className={`flex-1 max-w-[80%] md:max-w-[70%] ${
                  msg.role === "user" ? "text-right" : ""
                }`}
              >
                <div
                  className={`group relative px-4 py-3 rounded-2xl shadow-lg ${
                    msg.role === "system"
                      ? "bg-gray-800/60 text-gray-300 border border-dashed border-gray-600 text-center text-sm italic"
                      : msg.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-tr-sm"
                      : "bg-white/10 backdrop-blur border border-white/20 text-gray-100 rounded-tl-sm"
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-yellow-400" />
                        <span className="text-xs font-medium text-gray-300">
                          Sources
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-xs text-gray-300 border border-white/20"
                          >
                            <FileText size={12} />
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  {msg.role === "bot" && !msg.isTyping && (
                    <div className="flex gap-2 mt-3">
                      <button className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-md">
                        Summarize
                      </button>
                      <button className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-md">
                        Explain
                      </button>
                    </div>
                  )}

                  {/* Message Actions */}
                  {msg.role !== "system" && !msg.isTyping && (
                    <div
                      className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                        msg.role === "user" ? "left-2" : "right-2"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyToClipboard(msg.content)}
                          className="p-1 rounded-md hover:bg-white/20 transition-colors"
                          title="Copy message"
                        >
                          <Copy
                            size={12}
                            className="text-gray-400 hover:text-white"
                          />
                        </button>
                        {msg.role === "bot" && (
                          <>
                            <button
                              className="p-1 rounded-md hover:bg-white/20 transition-colors"
                              title="Good response"
                            >
                              <ThumbsUp
                                size={12}
                                className="text-gray-400 hover:text-green-400"
                              />
                            </button>
                            <button
                              className="p-1 rounded-md hover:bg-white/20 transition-colors"
                              title="Poor response"
                            >
                              <ThumbsDown
                                size={12}
                                className="text-gray-400 hover:text-red-400"
                              />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                {msg.role !== "system" && (
                  <div
                    className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <Clock size={10} />
                    {formatTime(msg.timestamp)}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 md:px-6 py-4 border-t border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
                placeholder="Ask me anything about your documents..."
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                {input.length}/1000
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="group px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2 transition-all duration-200 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <Send
                size={18}
                className={`transition-transform ${
                  isLoading ? "animate-pulse" : "group-hover:translate-x-0.5"
                }`}
              />
              <span className="font-medium">
                {isLoading ? "Sending..." : "Send"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
