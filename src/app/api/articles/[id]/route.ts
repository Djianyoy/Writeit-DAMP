import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db";
import { Article } from "@/shared/types";
import { estimateReadingTime, generateSlug } from "@/features/articles/utils/articleUtils";

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const articles = readJSON<Article[]>("articles.json");
  const article = articles.find((a) => a.id === id || a.slug === id);
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();
  const articles = readJSON<Article[]>("articles.json");
  const idx = articles.findIndex((a) => a.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = {
    ...articles[idx],
    ...body,
    slug: body.title ? generateSlug(body.title) + "-" + articles[idx].id.split("-").pop() : articles[idx].slug,
    readingTime: estimateReadingTime(body.content || articles[idx].content),
    updatedAt: new Date().toISOString(),
  };
  articles[idx] = updated;
  writeJSON("articles.json", articles);
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const articles = readJSON<Article[]>("articles.json");
  const filtered = articles.filter((a) => a.id !== id);
  writeJSON("articles.json", filtered);
  return NextResponse.json({ success: true });
}
