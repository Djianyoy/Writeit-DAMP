export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  bio: string;
  avatar: string;
  followers: string[];
  following: string[];
  bookmarks: string[];
  createdAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  coverImage: string;
  authorId: string;
  authorUsername: string;
  tags: string[];
  claps: string[];
  status: "published" | "draft";
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}

export type AuthUser = Omit<User, "password">;
