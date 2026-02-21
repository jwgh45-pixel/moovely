"use client";

import { Verdict } from "@/lib/types";

interface BrandMarkProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  verdict?: Verdict;
  className?: string;
  mono?: boolean; // white version for dark backgrounds
}

/**
 * The Moovely mark: a Holstein cow face on a green circle.
 * Inspired by classic dairy cow illustration. Clean, scalable, ownable.
 * Verdict states change the expression.
 */
export default function BrandMark({
  size = "md",
  verdict,
  className = "",
  mono = false,
}: BrandMarkProps) {
  const sizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const bgFill = mono ? "#ffffff" : "#0d6e3f";

  return (
    <div className={`${sizes[size]} relative ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background circle */}
        <circle cx="32" cy="32" r="32" fill={bgFill} />

        {/* Ears */}
        <ellipse cx="14" cy="20" rx="7" ry="5" transform="rotate(-25 14 20)" fill={mono ? "#ddd" : "#1a1a1a"} />
        <ellipse cx="14" cy="20" rx="4.5" ry="3" transform="rotate(-25 14 20)" fill={mono ? "#bbb" : "#8B6F47"} />
        <ellipse cx="50" cy="20" rx="7" ry="5" transform="rotate(25 50 20)" fill={mono ? "#ddd" : "#1a1a1a"} />
        <ellipse cx="50" cy="20" rx="4.5" ry="3" transform="rotate(25 50 20)" fill={mono ? "#bbb" : "#8B6F47"} />

        {/* Head shape - white base */}
        <ellipse cx="32" cy="36" rx="18" ry="20" fill={mono ? "#e8e8e8" : "#F5F0E8"} />

        {/* Black patches - Holstein markings */}
        <path d="M 14 28 Q 18 18 26 22 Q 22 32 16 34 Z" fill={mono ? "#999" : "#1a1a1a"} />
        <path d="M 50 28 Q 46 18 38 22 Q 42 32 48 34 Z" fill={mono ? "#999" : "#1a1a1a"} />
        {/* Top of head patch */}
        <path d="M 24 18 Q 28 14 32 16 Q 36 14 40 18 Q 36 22 32 20 Q 28 22 24 18 Z" fill={mono ? "#999" : "#1a1a1a"} />

        {/* Eyes */}
        <ellipse cx="25" cy="32" rx="3" ry="3.5" fill="white" />
        <ellipse cx="39" cy="32" rx="3" ry="3.5" fill="white" />
        {verdict === "greener" ? (
          <>
            {/* Happy eyes - curved arcs */}
            <path d="M 23 31.5 Q 25 29 27 31.5" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 37 31.5 Q 39 29 41 31.5" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        ) : verdict === "not-greener" ? (
          <>
            {/* Slightly concerned eyes */}
            <circle cx="25" cy="32.5" r="2" fill="#2B4570" />
            <circle cx="39" cy="32.5" r="2" fill="#2B4570" />
            <circle cx="25.7" cy="31.8" r="0.7" fill="white" />
            <circle cx="39.7" cy="31.8" r="0.7" fill="white" />
          </>
        ) : (
          <>
            {/* Default neutral eyes */}
            <circle cx="25" cy="32" r="2" fill="#2B4570" />
            <circle cx="39" cy="32" r="2" fill="#2B4570" />
            <circle cx="25.8" cy="31.3" r="0.8" fill="white" />
            <circle cx="39.8" cy="31.3" r="0.8" fill="white" />
          </>
        )}

        {/* Muzzle / nose area */}
        <ellipse cx="32" cy="44" rx="8" ry="6" fill={mono ? "#ccc" : "#E8C4B0"} />

        {/* Nostrils */}
        <ellipse cx="29" cy="44" rx="2" ry="1.5" fill={mono ? "#999" : "#9B7B6B"} />
        <ellipse cx="35" cy="44" rx="2" ry="1.5" fill={mono ? "#999" : "#9B7B6B"} />

        {/* Greener verdict - lime sparkle */}
        {verdict === "greener" && (
          <circle cx="54" cy="10" r="5" fill="#84cc16" />
        )}
      </svg>
    </div>
  );
}
