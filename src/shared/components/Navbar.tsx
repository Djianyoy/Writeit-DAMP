"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit3 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)] shadow-sm backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" onClick={() => setMenuOpen(false)} className="text-2xl font-bold tracking-tight text-[var(--text)] font-serif">
          WriteIt
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-2 text-sm bg-white/90 rounded-full outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </form>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/write" className="hidden md:flex bg-[var(--accent)] text-white px-4 py-2 rounded-full items-center gap-2 text-sm hover:bg-white hover:text-[var(--accent)] transition-colors cursor-pointer">
                <Edit3 className="h-4 w-4" />
                Write
              </Link>
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 cursor-pointer">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                    alt={user.name}
                    className="w-8 h-8 rounded-full bg-gray-200"
                  />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <Link href={`/u/${user.username}`} className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Profile</Link>
                    <Link href="/write" className="block md:hidden px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                      Write
                    </Link>
                    <Link href="/bookmarks" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Reading List</Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Settings</Link>
                    <hr className="my-1" />
                    <button onClick={() => { logout(); setMenuOpen(false); router.push("/"); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">Sign in</Link>
              <Link href="/register" className="text-sm bg-white font-bold px-4 py-2 rounded-full hover:bg-[var(--accent-strong)]">Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
