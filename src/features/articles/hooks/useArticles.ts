"use client";
import { useState, useEffect } from "react";
import { Article } from "@/shared/types";

export function useArticles(tag?: string) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = tag ? `/api/articles?tag=${tag}` : "/api/articles";
    fetch(url)
      .then((r) => r.json())
      .then((d) => { setArticles(d); setLoading(false); });
  }, [tag]);

  return { articles, loading };
}
