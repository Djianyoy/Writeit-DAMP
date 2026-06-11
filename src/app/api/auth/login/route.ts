import { NextRequest, NextResponse } from "next/server";
import { readJSON } from "@/lib/db";
import { User } from "@/shared/types";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const users = readJSON<User[]>("users.json");
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const { password: _, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}
