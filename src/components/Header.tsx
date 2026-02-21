"use client";

import Link from "next/link";
import BrandMark from "./BrandMark";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-light">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <BrandMark size="sm" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-brand-900 tracking-tight leading-tight font-[family-name:var(--font-heading)]">
              moovely
            </span>
            <span className="text-[9px] text-ink-muted tracking-[0.2em] uppercase leading-tight">
              the grass is greener
            </span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-ink-muted hover:text-brand transition-colors"
          >
            Compare
          </Link>
          <Link
            href="/explore"
            className="text-ink-muted hover:text-brand transition-colors"
          >
            Explore
          </Link>
          <Link
            href="#how-it-works"
            className="text-ink-muted hover:text-brand transition-colors"
          >
            How It Works
          </Link>
        </nav>
      </div>
    </header>
  );
}
