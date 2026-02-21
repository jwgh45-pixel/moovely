"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeftRight, Sparkles } from "lucide-react";
import { Location } from "@/lib/types";
import LocationSearch from "./LocationSearch";
import BrandMark from "./BrandMark";

export default function HeroSection() {
  const [fromLocation, setFromLocation] = useState<Location | null>(null);
  const [toLocation, setToLocation] = useState<Location | null>(null);
  const router = useRouter();

  const handleCompare = () => {
    if (fromLocation && toLocation) {
      router.push(`/compare/${fromLocation.id}-vs-${toLocation.id}`);
    }
  };

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const canCompare =
    fromLocation && toLocation && fromLocation.id !== toLocation.id;

  return (
    <section className="relative overflow-hidden hero-bg">
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-24 text-center">
        {/* Mark */}
        <BrandMark size="lg" className="mx-auto mb-8" />

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 font-[family-name:var(--font-heading)]">
          Is the grass
          <br />
          <span className="gradient-text">actually greener?</span>
        </h1>

        <p className="text-lg text-ink-muted max-w-xl mx-auto leading-relaxed mb-10">
          Compare any two places in the UK. See your real disposable income
          after tax, rent, bills, and the stuff that matters. Government data,
          not guesswork.
        </p>

        {/* Search card */}
        <div className="bg-surface rounded-2xl shadow-xl shadow-brand/5 border border-border p-6 md:p-8 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <LocationSearch
              label="I currently live in"
              placeholder="Type a city or town..."
              value={fromLocation}
              onChange={setFromLocation}
              accentColor="green"
            />

            <button
              onClick={handleSwap}
              className="hidden md:flex w-10 h-10 shrink-0 items-center justify-center rounded-full border border-border hover:bg-surface-raised transition-colors mb-1"
              aria-label="Swap locations"
            >
              <ArrowLeftRight className="w-4 h-4 text-ink-muted" />
            </button>

            <LocationSearch
              label="I'm thinking about"
              placeholder="Where are you considering?"
              value={toLocation}
              onChange={setToLocation}
              accentColor="lime"
            />
          </div>

          <button
            onClick={handleCompare}
            disabled={!canCompare}
            className={`mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-lg transition-all font-[family-name:var(--font-heading)] ${
              canCompare
                ? "bg-brand text-white hover:bg-brand-dark shadow-lg shadow-brand/20 hover:shadow-brand/30"
                : "bg-surface-sunken text-ink-faint cursor-not-allowed"
            }`}
          >
            {canCompare ? (
              <>
                <Sparkles className="w-5 h-5" />
                Show Me the Real Numbers
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              "Pick two places to compare"
            )}
          </button>
        </div>

        {/* Trust row */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-ink-faint">
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-brand" />
            ONS &amp; HMRC data
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-brand" />
            150+ locations
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-brand" />
            Updated quarterly
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-brand" />
            Free forever
          </span>
        </div>
      </div>
    </section>
  );
}
