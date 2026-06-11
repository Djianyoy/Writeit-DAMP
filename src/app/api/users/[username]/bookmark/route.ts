import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db";
import { User } from "@/shared/types";

export async function POST(req: NextRequest, context: { params: Promise<{ username: string }> }) {
  const { username } = await context.params;
  const { articleId } = await req.json();
  const users = readJSON<User[]>("users.json");
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const bookmarks = users[idx].bookmarks;
  users[idx].bookmarks = bookmarks.includes(articleId)
    ? bookmarks.filter((id) => id !== articleId)
    : [...bookmarks, articleId];

  writeJSON("users.json", users);
  return NextResponse.json({ bookmarks: users[idx].bookmarks });
}
