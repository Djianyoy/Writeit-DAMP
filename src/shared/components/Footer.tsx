import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-serif text-[var(--text)]">WriteIt</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">Home</Link>
            <Link href="/write" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">Write</Link>
            <Link href="/bookmarks" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">Reading List</Link>
            <Link href="/settings" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">Settings</Link>
          </nav>

          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} WriteIt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
