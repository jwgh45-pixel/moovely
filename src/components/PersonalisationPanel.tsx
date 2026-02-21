"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sliders,
  PoundSterling,
  BedDouble,
  Baby,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
} from "lucide-react";
import { BedSize, PersonalisationOptions } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

interface PersonalisationPanelProps {
  options: PersonalisationOptions;
  onChange: (options: PersonalisationOptions) => void;
  fromMedianSalary: number;
  toMedianSalary: number;
}

export default function PersonalisationPanel({
  options,
  onChange,
  fromMedianSalary,
  toMedianSalary,
}: PersonalisationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [salaryInput, setSalaryInput] = useState(
    options.customSalary?.toString() ?? ""
  );
  const [showFloatingPill, setShowFloatingPill] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const isPersonalised = options.customSalary !== undefined;

  // Pulse animation on first load (only once)
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Show floating pill when panel is scrolled out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingPill(!entry.isIntersecting && !isExpanded);
      },
      { threshold: 0 }
    );

    if (panelRef.current) {
      observer.observe(panelRef.current);
    }

    return () => observer.disconnect();
  }, [isExpanded]);

  const handleSalaryChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    setSalaryInput(cleaned);

    if (cleaned === "") {
      onChange({ ...options, customSalary: undefined });
    } else {
      const num = parseInt(cleaned, 10);
      if (num > 0 && num < 1_000_000) {
        onChange({ ...options, customSalary: num });
      }
    }
  };

  const handleBedSize = (bedSize: BedSize) => {
    onChange({ ...options, bedSize });
  };

  const handleChildcare = (include: boolean) => {
    onChange({ ...options, includeChildcare: include });
  };

  const handleClearSalary = () => {
    setSalaryInput("");
    onChange({ ...options, customSalary: undefined });
  };

  const scrollToPanel = () => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setIsExpanded(true), 400);
  };

  const bedSizes: { value: BedSize; label: string; icon: string }[] = [
    { value: "one", label: "1 bed", icon: "🛏" },
    { value: "two", label: "2 bed", icon: "🛏🛏" },
    { value: "three", label: "3 bed", icon: "🛏🛏🛏" },
  ];

  return (
    <>
      <div className="mb-8" ref={panelRef}>
        {/* Collapsed teaser */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className={`w-full bg-gradient-to-r from-brand-50 to-lime/5 rounded-2xl border-2 p-4 flex items-center justify-between hover:border-brand transition-all group ${
              !hasAnimated && !isPersonalised
                ? "animate-border-pulse border-brand/30"
                : "border-brand-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                <Sliders className="w-5 h-5 text-brand" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-ink text-sm">
                  {isPersonalised
                    ? `Personalised to your ${formatCurrency(options.customSalary!)} salary`
                    : "Make this about YOU"}
                </p>
                <p className="text-xs text-ink-muted">
                  {isPersonalised
                    ? "Tap to adjust your settings"
                    : "Tap to personalise - enter your salary and see YOUR real numbers"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-brand">
              {!isPersonalised && (
                <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
              )}
              <ChevronDown className="w-5 h-5" />
            </div>
          </button>
        )}

        {/* Expanded panel */}
        {isExpanded && (
          <div className="bg-surface rounded-2xl border-2 border-brand/20 p-6 shadow-lg shadow-brand/5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand" />
                <h3 className="font-bold text-ink">
                  Personalise Your Comparison
                </h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 hover:bg-brand-50 rounded-lg transition-colors"
              >
                <ChevronUp className="w-5 h-5 text-ink-muted" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Salary input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                  <PoundSterling className="w-4 h-4 text-brand" />
                  Your annual salary
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted font-medium">
                    £
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={salaryInput ? Number(salaryInput).toLocaleString("en-GB") : ""}
                    onChange={(e) =>
                      handleSalaryChange(e.target.value.replace(/,/g, ""))
                    }
                    placeholder={`Area medians: ${formatCurrency(fromMedianSalary)} / ${formatCurrency(toMedianSalary)}`}
                    className="w-full pl-8 pr-10 py-3 rounded-xl border-2 border-brand/20 focus:border-brand bg-brand-50/50 search-input text-ink placeholder:text-ink-muted/40 text-lg font-semibold transition-all"
                  />
                  {salaryInput && (
                    <button
                      onClick={handleClearSalary}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-brand-100 rounded-full"
                    >
                      <X className="w-4 h-4 text-ink-muted" />
                    </button>
                  )}
                </div>
                {isPersonalised && (
                  <p className="text-xs text-brand mt-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    All numbers below are calculated using YOUR salary
                  </p>
                )}
                {!isPersonalised && (
                  <p className="text-xs text-ink-muted mt-1.5">
                    Leave blank to use area median salaries
                  </p>
                )}
              </div>

              {/* Bed size */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                  <BedDouble className="w-4 h-4 text-brand" />
                  How many bedrooms?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {bedSizes.map((bed) => (
                    <button
                      key={bed.value}
                      onClick={() => handleBedSize(bed.value)}
                      className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                        options.bedSize === bed.value
                          ? "bg-brand text-white shadow-md shadow-brand/25"
                          : "bg-brand-50 text-ink hover:bg-brand-100"
                      }`}
                    >
                      {bed.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Childcare toggle */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                  <Baby className="w-4 h-4 text-brand" />
                  Include childcare costs?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleChildcare(false)}
                    className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                      !options.includeChildcare
                        ? "bg-brand text-white shadow-md shadow-brand/25"
                        : "bg-brand-50 text-ink hover:bg-brand-100"
                    }`}
                  >
                    No kids (yet)
                  </button>
                  <button
                    onClick={() => handleChildcare(true)}
                    className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                      options.includeChildcare
                        ? "bg-brand text-white shadow-md shadow-brand/25"
                        : "bg-brand-50 text-ink hover:bg-brand-100"
                    }`}
                  >
                    Yes, include nursery
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating "Personalise" pill - appears when panel is scrolled out of view */}
      {showFloatingPill && (
        <button
          onClick={scrollToPanel}
          className="fixed bottom-20 left-4 z-40 flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-full shadow-lg shadow-brand/25 text-sm font-medium hover:bg-brand-dark transition-all animate-fade-in-up"
        >
          <Sliders className="w-4 h-4" />
          Personalise
        </button>
      )}
    </>
  );
}
