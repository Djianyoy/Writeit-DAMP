"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/features/articles/components/RichTextEditor"), { ssr: false });

export default function WritePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", subtitle: "", content: "", coverImage: "", tags: "", status: "published" });
  const [saving, setSaving] = useState(false);

  if (!user) {
    router.push("/login");
    return null;
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (status: "published" | "draft") => {
    setSaving(true);
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags, status, authorId: user.id, authorUsername: user.username }),
    });
    const article = await res.json();
    router.push(`/article/${article.slug}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">New story</h1>
        <div className="flex gap-2">
          <button onClick={() => handleSubmit("draft")} disabled={saving}
            className="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50">
            Save draft
          </button>
          <button onClick={() => handleSubmit("published")} disabled={saving}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50">
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <input value={form.coverImage} onChange={set("coverImage")} placeholder="Cover image URL (optional)"
          className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-400" />
        <input value={form.title} onChange={set("title")} placeholder="Title" required
          className="w-full text-3xl font-bold border-b border-gray-200 py-2 focus:outline-none focus:border-gray-400 font-serif" />
        <input value={form.subtitle} onChange={set("subtitle")} placeholder="Subtitle (optional)"
          className="w-full text-xl text-gray-500 border-b border-gray-200 py-2 focus:outline-none focus:border-gray-400" />
        <RichTextEditor value={form.content} onChange={(v) => setForm((f) => ({ ...f, content: v }))} />
        <input value={form.tags} onChange={set("tags")} placeholder="Tags (comma-separated: react, webdev, ...)"
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>
    </div>
  );
}
