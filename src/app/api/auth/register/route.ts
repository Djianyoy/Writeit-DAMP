import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db";
import { User } from "@/shared/types";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const { name, username, email, password } = await req.json();
  const users = readJSON<User[]>("users.json");

  if (users.find((u) => u.email === email)) return NextResponse.json({ error: "Email taken" }, { status: 400 });
  if (users.find((u) => u.username === username)) return NextResponse.json({ error: "Username taken" }, { status: 400 });

  const user: User = {
    id: `user-${uuidv4()}`,
    username, email, password, name,
    bio: "",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    followers: [],
    following: [],
    bookmarks: [],
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeJSON("users.json", users);
  const { password: _, ...safeUser } = user;
  return NextResponse.json({ user: safeUser }, { status: 201 });
}
