"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ArticleCard from "@/shared/components/ArticleCard";
import { Article } from "@/shared/types";

const POPULAR_TAGS = ["nextjs", "react", "typescript", "design", "ux", "programming", "webdev", "javascript"];

export default function HomePage() {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag") || "";
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = tag ? `/api/articles?tag=${tag}` : "/api/articles";
    fetch(url)
      .then((r) => r.json())
      .then((d) => { setArticles(d); setLoading(false); });
  }, [tag]);

  const handleDelete = (id: string) => setArticles((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-12">
        {/* Feed */}
        <div className="flex-1 min-w-0">
          {/* Tag filter */}
          <div className="flex gap-2 overflow-x-auto pb-4 border-b border-[var(--border)] mb-2">
            <Link href="/" className={`text-sm px-1 py-2 whitespace-nowrap border-b-2 ${!tag ? "border-[var(--accent)] font-medium" : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"}`}>
              For you
            </Link>
            {POPULAR_TAGS.map((t) => (
              <Link key={t} href={`/?tag=${t}`} className={`text-sm px-1 py-2 whitespace-nowrap border-b-2 ${tag === t ? "border-[var(--accent)] font-medium" : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"}`}>
                {t}
              </Link>
            ))}
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400">Loading...</div>
          ) : articles.length === 0 ? (
            <div className="py-20 text-center text-gray-400">No articles found.</div>
          ) : (
            articles.map((a) => <ArticleCard key={a.id} article={a} onDelete={handleDelete} />)
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-20">
            <h3 className="text-sm font-medium mb-4">Recommended topics</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {POPULAR_TAGS.map((t) => (
                <Link key={t} href={`/?tag=${t}`} className="text-sm warm-pill hover:bg-[#ffe4cd] px-4 py-2 rounded-full">
                  {t}
                </Link>
              ))}
            </div>
            <div className="border-t pt-6">
              <p className="text-xs text-[var(--muted)]">
                Writing on WriteIt · New writer FAQ · Help · About
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
