"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await register(form.name, form.username, form.email, form.password);
    if (ok) router.push("/");
    else { setError("Email or username already taken"); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-8 font-serif">Join WriteIt.</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={form.name} onChange={set("name")} placeholder="Full name" required
            className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input value={form.username} onChange={set("username")} placeholder="Username" required
            className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input type="email" value={form.email} onChange={set("email")} placeholder="Email" required
            className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input type="password" value={form.password} onChange={set("password")} placeholder="Password" required
            className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-green-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
