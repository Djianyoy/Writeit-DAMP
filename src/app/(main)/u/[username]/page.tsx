"use client";
import React from "react";
import { useEffect, useState } from "react";
import { AuthUser, Article } from "@/shared/types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import ArticleCard from "@/shared/components/ArticleCard";

export default function ProfilePage({ params }: { params: any }) {
  const resolvedParams = (params && typeof params.then === "function") ? React.use(params) : params;
  const { username } = resolvedParams;
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [drafts, setDrafts] = useState<Article[]>([]);
  const [tab, setTab] = useState<"published" | "drafts">("published");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${username}`).then((r) => r.json()),
      fetch(`/api/articles?username=${username}`).then((r) => r.json()),
      fetch(`/api/articles?username=${username}&status=draft`).then((r) => r.json()),
    ]).then(([u, pub, drft]) => {
      setProfile(u);
      setArticles(pub);
      setDrafts(drft);
      setLoading(false);
    });
  }, [username]);

  const handleFollow = async () => {
    if (!user || !profile) return;
    const res = await fetch(`/api/users/${profile.username}/follow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    const data = await res.json();
    setProfile(data.user);
    updateUser({
      ...user,
      following: data.following
        ? [...user.following, profile.id]
        : user.following.filter((id) => id !== profile.id),
    });
  };

  const isOwner = user?.username === username;
  const isFollowing = user && profile ? user.following.includes(profile.id) : false;

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>;
  if (!profile) return <div className="max-w-4xl mx-auto px-4 py-20 text-center">User not found.</div>;

  const listed = tab === "published" ? articles : drafts;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-start gap-8 mb-10 pb-10 border-b border-gray-200">
        <img
          src={profile.avatar || "/default-avatar.png"}
          onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
          alt={profile.name}
          className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
          {profile.bio && <p className="text-gray-600 mb-4">{profile.bio}</p>}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>{profile.followers.length} followers</span>
            <span>{profile.following.length} following</span>
          </div>
          {user && !isOwner && (
            <button onClick={handleFollow}
              className={`px-5 py-2 rounded-full text-sm font-medium ${isFollowing ? "border border-gray-300 text-gray-600 hover:bg-gray-50" : "bg-green-600 text-white hover:bg-green-700"}`}>
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {isOwner && (
        <div className="flex gap-6 mb-8 border-b border-gray-200">
          {(["published", "drafts"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-3 text-sm capitalize border-b-2 ${tab === t ? "border-black font-medium" : "border-transparent text-gray-500 hover:text-black"}`}>
              {t} ({t === "published" ? articles.length : drafts.length})
            </button>
          ))}
        </div>
      )}

      {listed.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No {tab} articles yet.</p>
      ) : (
        listed.map((a) => (
          <ArticleCard key={a.id} article={a} onDelete={(id) => {
            setArticles((p) => p.filter((x) => x.id !== id));
            setDrafts((p) => p.filter((x) => x.id !== id));
          }} />
        ))
      )}
    </div>
  );
}
