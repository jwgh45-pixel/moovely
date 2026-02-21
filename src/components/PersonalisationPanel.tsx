"use client";

import { useState } from "react";
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

  const isPersonalised = options.customSalary !== undefined;

  const handleSalaryChange = (value: string) => {
    // Strip non-numeric characters except for empty string
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

  const bedSizes: { value: BedSize; label: string; icon: string }[] = [
    { value: "one", label: "1 bed", icon: "🛏" },
    { value: "two", label: "2 bed", icon: "🛏🛏" },
    { value: "three", label: "3 bed", icon: "🛏🛏🛏" },
  ];

  return (
    <div className="mb-8">
      {/* Collapsed teaser */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full bg-gradient-to-r from-grass-50 to-sunset/5 rounded-2xl border border-grass-200 p-4 flex items-center justify-between hover:border-grass transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-grass/10 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-grass" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-charcoal text-sm">
                {isPersonalised
                  ? `Personalised to your ${formatCurrency(options.customSalary!)} salary`
                  : "Make this about YOU"}
              </p>
              <p className="text-xs text-charcoal-muted">
                {isPersonalised
                  ? "Click to adjust your settings"
                  : "Enter your salary and see YOUR real numbers - not area medians"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-grass">
            {!isPersonalised && (
              <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
            )}
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>
      )}

      {/* Expanded panel */}
      {isExpanded && (
        <div className="bg-white rounded-2xl border-2 border-grass/20 p-6 shadow-lg shadow-grass/5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-grass" />
              <h3 className="font-bold text-charcoal">
                Personalise Your Comparison
              </h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1.5 hover:bg-grass-50 rounded-lg transition-colors"
            >
              <ChevronUp className="w-5 h-5 text-charcoal-muted" />
            </button>
          </div>

          <div className="space-y-5">
            {/* Salary input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                <PoundSterling className="w-4 h-4 text-grass" />
                Your annual salary
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted font-medium">
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
                  className="w-full pl-8 pr-10 py-3 rounded-xl border-2 border-grass/20 focus:border-grass bg-grass-50/50 search-input text-charcoal placeholder:text-charcoal-muted/40 text-lg font-semibold transition-all"
                />
                {salaryInput && (
                  <button
                    onClick={handleClearSalary}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-grass-100 rounded-full"
                  >
                    <X className="w-4 h-4 text-charcoal-muted" />
                  </button>
                )}
              </div>
              {isPersonalised && (
                <p className="text-xs text-grass mt-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  All numbers below are calculated using YOUR salary
                </p>
              )}
              {!isPersonalised && (
                <p className="text-xs text-charcoal-muted mt-1.5">
                  Leave blank to use area median salaries
                </p>
              )}
            </div>

            {/* Bed size */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                <BedDouble className="w-4 h-4 text-grass" />
                How many bedrooms?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {bedSizes.map((bed) => (
                  <button
                    key={bed.value}
                    onClick={() => handleBedSize(bed.value)}
                    className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                      options.bedSize === bed.value
                        ? "bg-grass text-white shadow-md shadow-grass/25"
                        : "bg-grass-50 text-charcoal hover:bg-grass-100"
                    }`}
                  >
                    {bed.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Childcare toggle */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                <Baby className="w-4 h-4 text-grass" />
                Include childcare costs?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleChildcare(false)}
                  className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                    !options.includeChildcare
                      ? "bg-grass text-white shadow-md shadow-grass/25"
                      : "bg-grass-50 text-charcoal hover:bg-grass-100"
                  }`}
                >
                  No kids (yet)
                </button>
                <button
                  onClick={() => handleChildcare(true)}
                  className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                    options.includeChildcare
                      ? "bg-grass text-white shadow-md shadow-grass/25"
                      : "bg-grass-50 text-charcoal hover:bg-grass-100"
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
  );
}
