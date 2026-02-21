"use client";

import { Verdict } from "@/lib/types";

interface BrandMarkProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  verdict?: Verdict;
  className?: string;
  mono?: boolean; // white version for dark backgrounds
}

/**
 * The Moovely mark: a geometric M with subtle horn-tip points.
 * When verdict is "greener", a tiny sunglasses icon appears.
 * Clean, scalable, ownable.
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

  const fill = mono ? "#ffffff" : "#0d6e3f";
  const accentFill = mono ? "#a3e635" : "#84cc16";

  return (
    <div className={`${sizes[size]} relative ${className}`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background circle */}
        <circle cx="24" cy="24" r="24" fill={fill} />

        {/* M letterform with horn-tip points */}
        <path
          d="M 12 36 L 12 18 L 11 12 L 17 20 L 24 14 L 31 20 L 37 12 L 36 18 L 36 36"
          stroke={mono ? "#04291a" : "#ffffff"}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Greener accent - lime dot */}
        {verdict === "greener" && (
          <circle cx="40" cy="8" r="5" fill={accentFill} />
        )}
      </svg>

      {/* Sunglasses emoji for greener verdict - small, confident, not on a cow */}
      {verdict === "greener" && (
        <span className="absolute -top-1 -right-1 text-xs">😎</span>
      )}
    </div>
  );
}
