"use client";

import Link from "next/link";
import CowMascot from "./CowMascot";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-grass-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <CowMascot size="sm" className="group-hover:cow-bounce" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-grass-800 tracking-tight leading-tight">
              moovely
            </span>
            <span className="text-[10px] text-charcoal-muted tracking-widest uppercase leading-tight">
              the grass is greener
            </span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-charcoal-muted hover:text-grass-dark transition-colors"
          >
            Compare
          </Link>
          <Link
            href="#how-it-works"
            className="text-charcoal-muted hover:text-grass-dark transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#about"
            className="text-charcoal-muted hover:text-grass-dark transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
