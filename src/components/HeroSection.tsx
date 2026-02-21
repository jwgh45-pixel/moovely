"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeftRight, Sparkles } from "lucide-react";
import { Location } from "@/lib/types";
import LocationSearch from "./LocationSearch";
import CowMascot from "./CowMascot";

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

  const canCompare = fromLocation && toLocation && fromLocation.id !== toLocation.id;

  return (
    <section className="relative overflow-hidden grass-pattern">
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-20 text-center">
        {/* Cow and headline */}
        <div className="mb-8">
          <CowMascot size="lg" className="mx-auto mb-6 cow-bounce" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="gradient-text">Is the grass</span>
            <br />
            <span className="text-charcoal">actually greener?</span>
          </h1>
          <p className="text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto leading-relaxed">
            Compare any two places in the UK and find out what your money is{" "}
            <span className="font-semibold text-grass-dark">really</span> worth.
            Not just costs - your actual{" "}
            <span className="font-semibold text-grass-dark">
              disposable income
            </span>{" "}
            after tax, rent, bills, and the important stuff (like pints).
          </p>
        </div>

        {/* Search inputs */}
        <div className="bg-white rounded-3xl shadow-xl shadow-grass/10 border border-grass-100 p-6 md:p-8 max-w-3xl mx-auto">
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
              className="hidden md:flex w-10 h-10 shrink-0 items-center justify-center rounded-full border border-grass-200 hover:bg-grass-50 transition-colors mb-1"
              aria-label="Swap locations"
            >
              <ArrowLeftRight className="w-4 h-4 text-grass" />
            </button>

            <LocationSearch
              label="I'm thinking about"
              placeholder="Where are you considering?"
              value={toLocation}
              onChange={setToLocation}
              accentColor="amber"
            />
          </div>

          <button
            onClick={handleCompare}
            disabled={!canCompare}
            className={`mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-lg transition-all ${
              canCompare
                ? "bg-grass text-white hover:bg-grass-dark shadow-lg shadow-grass/25 hover:shadow-grass/40"
                : "bg-grass-100 text-charcoal-muted cursor-not-allowed"
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

        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-charcoal-muted">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-grass" />
            Government data (ONS, HMRC)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-grass" />
            150+ UK locations
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-grass" />
            Updated quarterly
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-grass" />
            Free forever
          </span>
        </div>
      </div>
    </section>
  );
}
