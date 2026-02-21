"use client";

import { formatCurrency } from "@/lib/calculations";

interface AffordabilityGaugeProps {
  disposable: number;
  locationName: string;
}

type Band = "comfortable" | "manageable" | "tight";

function getBand(disposable: number): Band {
  if (disposable >= 800) return "comfortable";
  if (disposable >= 300) return "manageable";
  return "tight";
}

const BAND_CONFIG: Record<
  Band,
  { label: string; color: string; dotColor: string; bg: string }
> = {
  comfortable: {
    label: "Comfortable",
    color: "text-better",
    dotColor: "bg-better",
    bg: "bg-better/10",
  },
  manageable: {
    label: "Manageable",
    color: "text-amber-600",
    dotColor: "bg-amber-500",
    bg: "bg-amber-50",
  },
  tight: {
    label: "Tight",
    color: "text-worse",
    dotColor: "bg-worse",
    bg: "bg-worse/10",
  },
};

export default function AffordabilityGauge({
  disposable,
  locationName,
}: AffordabilityGaugeProps) {
  const band = getBand(disposable);
  const config = BAND_CONFIG[band];

  // Position the dot on a 0-1200 scale (clamped)
  const clamped = Math.max(0, Math.min(disposable, 1200));
  const pct = (clamped / 1200) * 100;

  return (
    <div className={`rounded-xl p-4 ${config.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-ink">{locationName}</p>
        <span className={`text-sm font-bold ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Gauge bar */}
      <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-worse/30 via-amber-400/30 to-better/30">
        {/* Dot indicator */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${config.dotColor} border-2 border-white shadow-md transition-all duration-500`}
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between mt-1.5 text-[10px] text-ink-faint">
        <span>Tight</span>
        <span>Manageable</span>
        <span>Comfortable</span>
      </div>

      <p className="text-xs text-ink-muted mt-2">
        {formatCurrency(Math.round(disposable))}/mo disposable
      </p>
    </div>
  );
}
