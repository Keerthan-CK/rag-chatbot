"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";


export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) console.error("Login Error:", error.message);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <form onSubmit={handleLogin} className="p-6 rounded-xl bg-zinc-900">
        <input
          type="text"
          placeholder="Enter thine email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 rounded bg-zinc-800 text-white w-64"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 rounded bg-purple-700 hover:bg-purple-600"
        >
          {" "}
          Send Link
        </button>
      </form>
    </div>
  );
}
