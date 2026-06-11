import { NextRequest, NextResponse } from "next/server";
import { readJSON } from "@/lib/db";
import { Article } from "@/shared/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  if (!q) return NextResponse.json([]);

  const articles = readJSON<Article[]>("articles.json");
  const results = articles.filter(
    (a) =>
      a.status === "published" &&
      (a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.authorUsername.toLowerCase().includes(q))
  );
  return NextResponse.json(results);
}
