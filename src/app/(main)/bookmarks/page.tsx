"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Article } from "@/shared/types";
import ArticleCard from "@/shared/components/ArticleCard";

export default function BookmarksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (!user.bookmarks.length) { setLoading(false); return; }

    Promise.all(user.bookmarks.map((id) => fetch(`/api/articles/${id}`).then((r) => r.json())))
      .then((results) => { setArticles(results.filter((a) => !a.error)); setLoading(false); });
  }, [user]);

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Reading list</h1>
      {articles.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No bookmarks yet. Bookmark articles to read later.</p>
      ) : (
        articles.map((a) => <ArticleCard key={a.id} article={a} />)
      )}
    </div>
  );
}
