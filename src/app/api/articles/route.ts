import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db";
import { Article } from "@/shared/types";
import { estimateReadingTime, generateSlug } from "@/features/articles/utils/articleUtils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  const username = searchParams.get("username");
  const status = searchParams.get("status") || "published";

  let articles = readJSON<Article[]>("articles.json");

  // Filter by status (published/draft)
  if (status) {
    articles = articles.filter((a) => a.status === status);
  }

  // Filter by tag if provided
  if (tag) {
    articles = articles.filter((a) => a.tags.includes(tag));
  }

  // Filter by username if provided
  if (username) {
    articles = articles.filter((a) => a.authorUsername === username);
  }

  // Sort by createdAt descending (newest first)
  articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, subtitle, content, coverImage, tags, status, authorId, authorUsername } = body;

    if (!title || !content || !authorId || !authorUsername) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const articles = readJSON<Article[]>("articles.json");
    const id = `article-${Date.now()}`;
    const slug = `${generateSlug(title)}-${id.split("-").pop()}`;

    const newArticle: Article = {
      id,
      slug,
      title,
      subtitle: subtitle || "",
      content,
      coverImage: coverImage || "",
      authorId,
      authorUsername,
      tags: tags || [],
      claps: [],
      status: status || "published",
      readingTime: estimateReadingTime(content),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    articles.push(newArticle);
    writeJSON("articles.json", articles);

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
