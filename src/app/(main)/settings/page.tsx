"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", bio: "", avatar: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    setForm({ name: user.name, bio: user.bio, avatar: user.avatar });
  }, [user]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const res = await fetch(`/api/users/${user.username}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    updateUser(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input value={form.name} onChange={set("name")}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea value={form.bio} onChange={set("bio")} rows={4}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Avatar URL</label>
          <input value={form.avatar} onChange={set("avatar")}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <img
            src={form.avatar || "/default-avatar.png"}
            onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
            alt="preview"
            className="w-16 h-16 rounded-full mt-2 bg-gray-200"
          />
        </div>
        <button type="submit" disabled={saving}
          className="px-6 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 disabled:opacity-50">
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
