import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db";
import { User } from "@/shared/types";

export async function POST(req: NextRequest, context: { params: Promise<{ username: string }> }) {
  const { username } = await context.params;
  const { userId } = await req.json();
  const users = readJSON<User[]>("users.json");

  const targetIdx = users.findIndex((u) => u.username === username);
  const actorIdx = users.findIndex((u) => u.id === userId);
  if (targetIdx === -1 || actorIdx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const targetId = users[targetIdx].id;
  const isFollowing = users[actorIdx].following.includes(targetId);

  if (isFollowing) {
    users[actorIdx].following = users[actorIdx].following.filter((id) => id !== targetId);
    users[targetIdx].followers = users[targetIdx].followers.filter((id) => id !== userId);
  } else {
    users[actorIdx].following.push(targetId);
    users[targetIdx].followers.push(userId);
  }

  writeJSON("users.json", users);
  const { password: _pw, ...safe } = users[targetIdx];
  return NextResponse.json({ user: safe, following: !isFollowing });
}
