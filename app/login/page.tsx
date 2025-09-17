"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email.");
    alert(`Magic link sent to ${email}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-400 text-sm">
            Enter your email to receive a magic login link.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-medium"
          >
            Send Magic Link
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-grow h-px bg-zinc-700"></div>
          <span className="text-gray-500 text-xs">OR</span>
          <div className="flex-grow h-px bg-zinc-700"></div>
        </div>

        {/* Extra Actions */}
        <div className="text-center space-y-2">
          <p className="text-gray-400 text-sm">No account yet?</p>
          <a
            href="/signup"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
