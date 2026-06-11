"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Article } from "@/shared/types";
import ArticleCard from "@/shared/components/ArticleCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => { setArticles(d); setLoading(false); });
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <form onSubmit={handleSearch} className="mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles, tags, authors..."
          className="w-full border border-gray-300 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </form>

      {q && <h2 className="text-lg font-medium mb-6">Results for "{q}"</h2>}
      {loading && <div className="text-center text-gray-400 py-10">Searching...</div>}
      {!loading && q && articles.length === 0 && (
        <p className="text-gray-400 text-center py-10">No results found for "{q}"</p>
      )}
      {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
    </div>
  );
}
