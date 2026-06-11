"use client";
import Link from "next/link";
import { Article } from "@/shared/types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Sparkles, Pencil, Trash2 } from "lucide-react";

const formatRelativeTime = (date: Date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];
  const interval = intervals.find((item) => seconds >= item.seconds) ?? intervals[intervals.length - 1];
  const value = Math.floor(seconds / interval.seconds);
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-value, interval.unit as Intl.RelativeTimeFormatUnit);
};

interface Props {
  article: Article;
  onDelete?: (id: string) => void;
}

export default function ArticleCard({ article, onDelete }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const isOwner = user?.id === article.authorId;

  const handleDelete = async () => {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/articles/${article.id}`, { method: "DELETE" });
    onDelete?.(article.id);
  };

  return (
    <article className="py-8 border-b border-[var(--border)]">
      <div className="flex items-center gap-2 mb-3">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${article.authorUsername}`}
          alt={article.authorUsername}
          className="w-6 h-6 rounded-full bg-[var(--surface-strong)]"
        />
        <Link href={`/u/${article.authorUsername}`} className="text-sm font-medium hover:underline text-[var(--accent)]">
          {article.authorUsername}
        </Link>
        <span className="text-[var(--muted)] text-sm">·</span>
        <span className="text-[var(--muted)] text-sm">
          {formatRelativeTime(new Date(article.createdAt))}
        </span>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1">
          <Link href={`/article/${article.slug}`}>
            <h2 className="text-xl font-bold mb-1 hover:underline line-clamp-2">{article.title}</h2>
            <p className="text-[var(--muted)] text-sm line-clamp-2 mb-3">{article.subtitle}</p>
          </Link>

          <div className="flex items-center gap-3 flex-wrap mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <Link key={tag} href={`/?tag=${tag}`} className="text-xs px-3 py-1 rounded-full warm-pill hover:bg-[#ffe4cd]">
                {tag}
              </Link>
            ))}
            {article.status === "draft" && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Draft</span>
            )}
          </div>
          <div className="flex items-center gap-3 px-2">
            <span className="text-[var(--muted)] text-xs">{article.readingTime} min read</span>
            <span className="flex items-center gap-1 text-[var(--muted)] text-xs">
              <Sparkles className="w-3 h-3" />
              {article.claps.length}
            </span>
            {isOwner && (
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => router.push(`/write/${article.id}`)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-black"
                  title="Edit"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {article.coverImage && (
          <img src={article.coverImage} alt={article.title} className="w-28 h-20 object-cover rounded flex-shrink-0" />
        )}
      </div>
    </article>
  );
}
