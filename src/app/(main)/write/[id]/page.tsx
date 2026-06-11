"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Article } from "@/shared/types";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/features/articles/components/RichTextEditor"), { ssr: false });

export default function EditArticlePage({ params }: { params: any }) {
  const resolvedParams = (params && typeof params.then === "function") ? React.use(params) : params;
  const { id } = resolvedParams;
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", subtitle: "", content: "", coverImage: "", tags: "" });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((r) => r.json())
      .then((a: Article) => {
        setForm({ title: a.title, subtitle: a.subtitle, content: a.content, coverImage: a.coverImage, tags: a.tags.join(", ") });
        setLoaded(true);
      });
  }, [id]);

  if (!user) { router.push("/login"); return null; }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (status: "published" | "draft") => {
    setSaving(true);
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const res = await fetch(`/api/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags, status }),
    });
    const article = await res.json();
    router.push(`/article/${article.slug}`);
  };

  if (!loaded) return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Edit story</h1>
        <div className="flex gap-2">
          <button onClick={() => handleSave("draft")} disabled={saving}
            className="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50">
            Save draft
          </button>
          <button onClick={() => handleSave("published")} disabled={saving}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50">
            {saving ? "Saving..." : "Update"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <input value={form.coverImage} onChange={set("coverImage")} placeholder="Cover image URL (optional)"
          className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-gray-400" />
        <input value={form.title} onChange={set("title")} placeholder="Title"
          className="w-full text-3xl font-bold border-b border-gray-200 py-2 focus:outline-none focus:border-gray-400 font-serif" />
        <input value={form.subtitle} onChange={set("subtitle")} placeholder="Subtitle"
          className="w-full text-xl text-gray-500 border-b border-gray-200 py-2 focus:outline-none focus:border-gray-400" />
        <RichTextEditor value={form.content} onChange={(v) => setForm((f) => ({ ...f, content: v }))} />
        <input value={form.tags} onChange={set("tags")} placeholder="Tags (comma-separated)"
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>
    </div>
  );
}
