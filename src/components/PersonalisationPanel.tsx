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
  Car,
  TrainFront,
  House,
  PartyPopper,
  Sofa,
  RotateCcw,
} from "lucide-react";
import {
  BedSize,
  CommuteType,
  PersonalisationOptions,
  DEFAULT_OPTIONS,
} from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

interface PersonalisationPanelProps {
  options: PersonalisationOptions;
  onChange: (options: PersonalisationOptions) => void;
  fromMedianSalary: number;
  toMedianSalary: number;
}

// Rough UK salary percentile brackets
function getSalaryContext(salary: number): string | null {
  if (salary < 15000) return "That's below the national minimum - double-check?";
  if (salary < 22000) return "That's in the bottom 25% of UK earners";
  if (salary < 30000) return "That's around the UK median salary";
  if (salary < 40000) return "That's above average for the UK";
  if (salary < 55000) return "That puts you in the top 25% of UK earners";
  if (salary < 80000) return "That's in the top 10% of UK earners";
  if (salary < 150000) return "That's in the top 5% - nice";
  return "That's in the top 1% of UK earners";
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

  const isDefault =
    !options.customSalary &&
    options.bedSize === "two" &&
    !options.includeChildcare &&
    options.commuteType === "public-transport" &&
    options.lifestyleMultiplier === 1;

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

  const handleCommuteType = (commuteType: CommuteType) => {
    onChange({ ...options, commuteType });
  };

  const handleLifestyle = (multiplier: number) => {
    onChange({ ...options, lifestyleMultiplier: multiplier });
  };

  const handleClearSalary = () => {
    setSalaryInput("");
    onChange({ ...options, customSalary: undefined });
  };

  const handleReset = () => {
    setSalaryInput("");
    onChange(DEFAULT_OPTIONS);
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

  const commuteOptions: {
    value: CommuteType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { value: "drive", label: "I drive", icon: <Car className="w-4 h-4" /> },
    {
      value: "public-transport",
      label: "Public transport",
      icon: <TrainFront className="w-4 h-4" />,
    },
    {
      value: "wfh",
      label: "Work from home",
      icon: <House className="w-4 h-4" />,
    },
  ];

  const lifestyleOptions: {
    value: number;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: 0.5,
      label: "Homebody",
      icon: <Sofa className="w-4 h-4" />,
    },
    {
      value: 1,
      label: "Average",
      icon: <Sliders className="w-4 h-4" />,
    },
    {
      value: 1.5,
      label: "Social butterfly",
      icon: <PartyPopper className="w-4 h-4" />,
    },
  ];

  const salaryContext =
    isPersonalised && options.customSalary
      ? getSalaryContext(options.customSalary)
      : null;

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

            <div className="space-y-6">
              {/* Step 1: Salary */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                  <span className="w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
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
                    value={
                      salaryInput
                        ? Number(salaryInput).toLocaleString("en-GB")
                        : ""
                    }
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
                {salaryContext && (
                  <p className="text-xs text-brand mt-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {salaryContext}
                  </p>
                )}
                {!isPersonalised && (
                  <p className="text-xs text-ink-muted mt-1.5">
                    Leave blank to use area median salaries
                  </p>
                )}
              </div>

              {/* Step 2: Housing */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                  <span className="w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
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

              {/* Step 3: Commute */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                  <span className="w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  <TrainFront className="w-4 h-4 text-brand" />
                  How do you commute?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {commuteOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleCommuteType(opt.value)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        options.commuteType === opt.value
                          ? "bg-brand text-white shadow-md shadow-brand/25"
                          : "bg-brand-50 text-ink hover:bg-brand-100"
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
                {options.commuteType === "wfh" && (
                  <p className="text-xs text-brand mt-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Commute costs zeroed out for both locations
                  </p>
                )}
              </div>

              {/* Step 4: Lifestyle */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                  <span className="w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">
                    4
                  </span>
                  <PartyPopper className="w-4 h-4 text-brand" />
                  Lifestyle intensity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {lifestyleOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleLifestyle(opt.value)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        options.lifestyleMultiplier === opt.value
                          ? "bg-brand text-white shadow-md shadow-brand/25"
                          : "bg-brand-50 text-ink hover:bg-brand-100"
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 5: Family */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                  <span className="w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">
                    5
                  </span>
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

              {/* Reset link */}
              {!isDefault && (
                <div className="pt-1 text-center">
                  <button
                    onClick={handleReset}
                    className="text-xs text-ink-muted hover:text-brand transition-colors inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset to defaults
                  </button>
                </div>
              )}
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
