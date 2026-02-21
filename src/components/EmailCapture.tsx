"use client";

import { useState } from "react";
import { Bell, Check, Loader2, ArrowRight } from "lucide-react";

interface EmailCaptureProps {
  context?: string; // e.g. "bristol" or "explore" - stored with the email
  variant?: "inline" | "banner";
}

export default function EmailCapture({
  context = "general",
  variant = "banner",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, context }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className={`rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center ${
          variant === "banner" ? "my-8" : ""
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-3">
          <Check className="w-5 h-5 text-brand" />
        </div>
        <p className="font-semibold text-ink">You&apos;re on the list</p>
        <p className="text-sm text-ink-muted mt-1">
          We&apos;ll ping you when we add new data, features, or locations.
          No spam, ever.
        </p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2.5 rounded-xl border border-brand-100 text-sm search-input bg-surface text-ink placeholder:text-ink-muted/40"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50 shrink-0"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Notify me"
          )}
        </button>
      </form>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/50 to-surface p-6 md:p-8 my-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
            <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-brand" />
            </div>
            <span className="text-xs font-medium text-brand uppercase tracking-wider">
              Stay in the loop
            </span>
          </div>
          <h3 className="text-lg font-bold text-ink mb-1">
            We&apos;re adding school ratings, crime data &amp; more
          </h3>
          <p className="text-sm text-ink-muted">
            Get notified when we launch new features. One email, no spam.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2 w-full md:w-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="px-4 py-3 rounded-xl border-2 border-brand/20 focus:border-brand text-sm search-input bg-surface text-ink placeholder:text-ink-muted/40 sm:w-64"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50 shrink-0"
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Notify Me
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
      {status === "error" && (
        <p className="text-xs text-worse text-center mt-3">
          Something went wrong. Try again?
        </p>
      )}
    </div>
  );
}
