import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db";
import { User } from "@/shared/types";

export async function GET(req: NextRequest, context: { params: Promise<{ username: string }> }) {
  const { username } = await context.params;
  const users = readJSON<User[]>("users.json");
  const user = users.find((u) => u.username === username);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { password: _pw, ...safe } = user;
  return NextResponse.json(safe);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ username: string }> }) {
  const { username } = await context.params;
  const body = await req.json();
  const users = readJSON<User[]>("users.json");
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  users[idx] = { ...users[idx], ...body };
  writeJSON("users.json", users);
  const { password: _pw, ...safe } = users[idx];
  return NextResponse.json(safe);
}
