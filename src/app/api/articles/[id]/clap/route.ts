import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db";
import { Article } from "@/shared/types";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { userId } = await req.json();
  const articles = readJSON<Article[]>("articles.json");
  const idx = articles.findIndex((a) => a.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const claps = articles[idx].claps;
  articles[idx].claps = claps.includes(userId)
    ? claps.filter((uid) => uid !== userId)
    : [...claps, userId];
  writeJSON("articles.json", articles);
  return NextResponse.json(articles[idx]);
}
