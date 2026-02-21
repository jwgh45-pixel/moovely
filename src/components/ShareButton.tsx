"use client";

import { useState } from "react";
import { Share2, Check, Twitter, Link2 } from "lucide-react";
import { Location, Verdict } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

interface ShareButtonProps {
  from: Location;
  to: Location;
  totalAnnualDiff: number;
  verdict: Verdict;
}

export default function ShareButton({
  from,
  to,
  totalAnnualDiff,
  verdict,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://moovely.co/compare/${from.id}-vs-${to.id}`;

  const shareText = (() => {
    const amount = formatCurrency(Math.abs(totalAnnualDiff));
    if (verdict === "greener") {
      return `I'd be ${amount}/year better off if I moved from ${from.name} to ${to.name}! Check your own comparison on Moovely 🐄`;
    }
    if (verdict === "not-greener") {
      return `Turns out I'd be ${amount}/year worse off in ${to.name} vs ${from.name}. The grass isn't always greener! 🐄`;
    }
    return `${from.name} vs ${to.name} - it's basically a wash! Find out where YOUR grass is greener 🐄`;
  })();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = `${shareText}\n${shareUrl}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareX = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl hover:bg-brand-dark transition-colors text-sm font-medium"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" />
            Copy Link
          </>
        )}
      </button>
      <button
        onClick={handleShareX}
        className="flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-xl hover:bg-ink-light transition-colors text-sm font-medium"
      >
        <Twitter className="w-4 h-4" />
        Share on X
      </button>
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({ title: "Moovely Comparison", text: shareText, url: shareUrl });
          }
        }}
        className="flex items-center gap-2 px-4 py-2 border border-brand-200 text-brand-dark rounded-xl hover:bg-brand-50 transition-colors text-sm font-medium"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
    </div>
  );
}
