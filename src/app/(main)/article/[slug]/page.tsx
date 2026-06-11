"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Sparkles, ChevronLeft, ArrowLeft } from "lucide-react";
import { Article, AuthUser } from "@/shared/types";
import { useAuth } from "@/features/auth/hooks/useAuth";

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

export default function ArticlePage({ params }: { params: any }) {
  const resolvedParams = (params && typeof params.then === "function") ? React.use(params) : params;
  const slug = resolvedParams.slug;
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [author, setAuthor] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [clapping, setClapping] = useState(false);

  useEffect(() => {
    fetch(`/api/articles/${slug}`)
      .then((r) => r.json())
      .then(async (a: Article) => {
        setArticle(a);
        const u = await fetch(`/api/users/${a.authorUsername}`).then((r) => r.json());
        setAuthor(u);
        setLoading(false);
      });
  }, [slug]);

  const handleClap = async () => {
    if (!user || !article) return;
    setClapping(true);
    const res = await fetch(`/api/articles/${article.id}/clap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    const updated = await res.json();
    setArticle(updated);
    setClapping(false);
  };

  const handleBookmark = async () => {
    if (!user || !article) return;
    const res = await fetch(`/api/users/${user.username}/bookmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId: article.id }),
    });
    const data = await res.json();
    updateUser({ ...user, bookmarks: data.bookmarks });
  };

  const handleFollow = async () => {
    if (!user || !author) return;
    const res = await fetch(`/api/users/${author.username}/follow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    const data = await res.json();
    setAuthor(data.user);
    updateUser({
      ...user,
      following: data.following
        ? [...user.following, author.id]
        : user.following.filter((id) => id !== author.id),
    });
  };

  const handleDelete = async () => {
    if (!article || !confirm("Delete this article?")) return;
    await fetch(`/api/articles/${article.id}`, { method: "DELETE" });
    router.push("/");
  };

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>;
  if (!article) return <div className="max-w-2xl mx-auto px-4 py-20 text-center">Article not found.</div>;

  const isOwner = user?.id === article.authorId;
  const hasClapped = user ? article.claps.includes(user.id) : false;
  const isBookmarked = user?.bookmarks.includes(article.id) ?? false;
  const isFollowing = user && author ? user.following.includes(author.id) : false;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-4">
        <Link href={"/"} className="flex items-center gap-2 text-base text-gray-500 hover:text-black">
          <ArrowLeft className="h-7 w-7" />
          Back
        </Link>
      </div>
      {article.coverImage && (
        <img src={article.coverImage} alt={article.title} className="w-full h-64 object-cover rounded-lg mb-8" />
      )}

      {article.tags.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {article.tags.map((t) => (
            <Link key={t} href={`/?tag=${t}`} className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200">{t}</Link>
          ))}
        </div>
      )}

      <h1 className="text-4xl font-bold mb-3 font-serif leading-tight">{article.title}</h1>
      {article.subtitle && <p className="text-xl text-gray-500 mb-6">{article.subtitle}</p>}

      {/* Author row */}
      <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
        <Link href={`/u/${article.authorUsername}`}>
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${article.authorUsername}`} alt={article.authorUsername} className="w-12 h-12 rounded-full bg-gray-200" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link href={`/u/${article.authorUsername}`} className="font-medium hover:underline">{article.authorUsername}</Link>
            {user && !isOwner && (
              <button onClick={handleFollow} className={`text-sm px-3 py-0.5 rounded-full border ${isFollowing ? "border-gray-300 text-gray-600" : "border-green-600 text-green-600 hover:bg-green-50"}`}>
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {article.readingTime} min read · {formatRelativeTime(new Date(article.createdAt))}
          </p>
        </div>
        <div className="flex gap-2">
          {user && (
            <button onClick={handleBookmark} className={`p-2 rounded-full hover:bg-gray-100 ${isBookmarked ? "text-black" : "text-gray-400"}`} title="Bookmark">
              <Star className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          )}
          {isOwner && (
            <>
              <Link href={`/write/${article.id}`} className="text-sm flex items-center text-gray-500 hover:text-black px-3 py-1 border rounded-full">Edit</Link>
              <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-700 px-3 py-1 border border-red-200 rounded-full">Delete</button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="prose max-w-none mb-12" dangerouslySetInnerHTML={{ __html: article.content }} />

      {/* Clap */}
      <div className="flex items-center gap-4 py-6 border-t border-gray-200">
        <button onClick={handleClap} disabled={!user || clapping}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${hasClapped ? "bg-black text-white border-black" : "border-gray-300 hover:border-black"}`}>
          <Sparkles className="h-5 w-5" />
          <span className={`text-sm font-medium ${hasClapped ? "text-white" : "text-black"}`}>{article.claps.length}</span>
        </button>
        {!user && <p className="text-sm text-gray-500">Sign in to clap</p>}
      </div>
    </div>
  );
}
