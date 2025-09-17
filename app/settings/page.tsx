"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [apiKey, setApiKey] = useState("");

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-2xl shadow-lg p-8 space-y-8">
        {/* Page header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-400 text-sm">
            Manage your chatbot preferences and account configuration.
          </p>
        </div>

        <div className="border-t border-zinc-700 pt-6 space-y-6">
          {/* Notifications toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Enable Notifications</h2>
              <p className="text-gray-400 text-sm">
                Get notified when your bot finishes processing documents.
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-14 h-8 rounded-full p-1 transition ${
                notifications ? "bg-purple-500" : "bg-zinc-700"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${
                  notifications ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* API Key input */}
          <div className="space-y-2">
            <label className="block font-semibold">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => alert("API Key saved!")}
              className="mt-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-sm font-medium"
            >
              Save API Key
            </button>
          </div>

          {/* Account actions */}
          <div className="space-y-3 border-t border-zinc-700 pt-6">
            <h2 className="font-semibold">Account</h2>
            <button className="w-full px-4 py-2 rounded-lg bg-green-400 hover:bg-green-500 transition font-medium">
              Log Out
            </button>
            <button className="w-full px-4 py-2 rounded-lg bg-red-900 hover:bg-red-800 transition text-sm text-white">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
