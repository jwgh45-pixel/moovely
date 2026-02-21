"use client";

import { Verdict } from "@/lib/types";

interface CowMascotProps {
  verdict?: Verdict;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CowMascot({
  verdict,
  size = "md",
  className = "",
}: CowMascotProps) {
  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-36 h-36",
  };

  // Different expressions based on verdict
  const getMouth = () => {
    switch (verdict) {
      case "greener":
        return (
          <path
            d="M 35 52 Q 42 60 50 52"
            stroke="#1a2e1a"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        );
      case "not-greener":
        return (
          <path
            d="M 35 56 Q 42 50 50 56"
            stroke="#1a2e1a"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        );
      default:
        return (
          <line
            x1="36"
            y1="54"
            x2="49"
            y2="54"
            stroke="#1a2e1a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
    }
  };

  const getAccessory = () => {
    if (verdict === "greener") {
      // Sunglasses
      return (
        <g>
          <rect x="26" y="34" width="12" height="8" rx="2" fill="#1a2e1a" />
          <rect x="46" y="34" width="12" height="8" rx="2" fill="#1a2e1a" />
          <line
            x1="38"
            y1="37"
            x2="46"
            y2="37"
            stroke="#1a2e1a"
            strokeWidth="2"
          />
          <line
            x1="26"
            y1="37"
            x2="20"
            y2="35"
            stroke="#1a2e1a"
            strokeWidth="2"
          />
          <line
            x1="58"
            y1="37"
            x2="64"
            y2="35"
            stroke="#1a2e1a"
            strokeWidth="2"
          />
        </g>
      );
    }
    return null;
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ears */}
        <ellipse cx="16" cy="28" rx="10" ry="7" fill="#f5f0d0" stroke="#1a2e1a" strokeWidth="2" />
        <ellipse cx="16" cy="28" rx="6" ry="4" fill="#fca5a5" />
        <ellipse cx="68" cy="28" rx="10" ry="7" fill="#f5f0d0" stroke="#1a2e1a" strokeWidth="2" />
        <ellipse cx="68" cy="28" rx="6" ry="4" fill="#fca5a5" />

        {/* Horns */}
        <path d="M 24 18 Q 20 6 14 4" stroke="#d97706" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 60 18 Q 64 6 70 4" stroke="#d97706" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Head */}
        <ellipse cx="42" cy="40" rx="26" ry="24" fill="#f5f0d0" stroke="#1a2e1a" strokeWidth="2" />

        {/* Spots */}
        <ellipse cx="30" cy="28" rx="8" ry="6" fill="#1a2e1a" opacity="0.15" />
        <ellipse cx="56" cy="32" rx="6" ry="5" fill="#1a2e1a" opacity="0.15" />

        {/* Eyes */}
        {verdict !== "greener" && (
          <>
            <circle cx="32" cy="36" r="4" fill="#1a2e1a" />
            <circle cx="33" cy="35" r="1.5" fill="white" />
            <circle cx="52" cy="36" r="4" fill="#1a2e1a" />
            <circle cx="53" cy="35" r="1.5" fill="white" />
          </>
        )}

        {/* Sunglasses or eyes */}
        {getAccessory()}

        {/* Nose/snout */}
        <ellipse cx="42" cy="48" rx="12" ry="8" fill="#fca5a5" stroke="#1a2e1a" strokeWidth="1.5" />
        <circle cx="38" cy="47" r="2" fill="#1a2e1a" opacity="0.4" />
        <circle cx="46" cy="47" r="2" fill="#1a2e1a" opacity="0.4" />

        {/* Mouth */}
        {getMouth()}

        {/* Bell */}
        <circle cx="42" cy="64" r="4" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        <line x1="42" y1="60" x2="42" y2="64" stroke="#d97706" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
