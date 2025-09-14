"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    setLoading(false);
    window.location.href = "/"; // redirect to homepage/login
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h2 className="text-xl font-semibold mb-6">Settings</h2>

      {/* Profile Section */}
      <div className="p-6 rounded-lg bg-gray-900 border border-gray-800">
        <h3 className="text-lg font-medium text-white mb-2">Profile</h3>
        <p className="text-sm text-gray-400">
          Manage your account details and preferences.
        </p>
        <button
          onClick={() => alert("Coming soon: profile editing!")}
          className="mt-4 px-4 py-2 text-sm rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors text-white"
        >
          Edit Profile
        </button>
      </div>

      {/* Preferences Section */}
      <div className="p-6 rounded-lg bg-gray-900 border border-gray-800">
        <h3 className="text-lg font-medium text-white mb-2">Preferences</h3>
        <p className="text-sm text-gray-400">
          Customize how the app behaves for you.
        </p>
        <button
          onClick={() => alert("Coming soon: preferences!")}
          className="mt-4 px-4 py-2 text-sm rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors text-white"
        >
          Update Preferences
        </button>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-lg bg-gray-900 border border-gray-800">
        <h3 className="text-lg font-medium text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-400">
          Logging out will end your current session.
        </p>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="mt-4 px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 transition-colors text-white disabled:opacity-50"
        >
          {loading ? "Logging out..." : "Log out"}
        </button>
      </div>
    </div>
  );
}
