"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import BrandMark from "./BrandMark";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Compare" },
    { href: "/explore", label: "Explore" },
    { href: "/blog", label: "Blog" },
    { href: "#how-it-works", label: "How It Works" },
  ];

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

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink-muted hover:text-brand transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-surface-raised transition-colors"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <X className="w-5 h-5 text-ink" />
          ) : (
            <Menu className="w-5 h-5 text-ink" />
          )}
        </button>
      </div>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border-light bg-surface/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-ink-muted hover:text-brand hover:bg-brand-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
