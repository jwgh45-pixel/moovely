"use client";

import { Location } from "@/lib/types";
import { Shield, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";

interface CrimeComparisonProps {
  from: Location;
  to: Location;
}

const CRIME_LEVEL_CONFIG = {
  "very-low": {
    label: "Very Low",
    color: "text-better",
    bg: "bg-better/5",
    border: "border-better/20",
    icon: CheckCircle,
  },
  low: {
    label: "Low",
    color: "text-brand",
    bg: "bg-brand-50",
    border: "border-brand/20",
    icon: CheckCircle,
  },
  average: {
    label: "Average",
    color: "text-ink-muted",
    bg: "bg-surface-raised",
    border: "border-border",
    icon: Shield,
  },
  high: {
    label: "High",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: AlertTriangle,
  },
  "very-high": {
    label: "Very High",
    color: "text-worse",
    bg: "bg-worse/5",
    border: "border-worse/20",
    icon: AlertTriangle,
  },
};

// UK national average is roughly 80-85 per 1,000
const UK_AVERAGE_CRIME = 82;

function CrimeBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 rounded-full bg-surface-sunken overflow-hidden">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function getCrimeBarColor(level: Location["crimeLevel"]) {
  switch (level) {
    case "very-low":
      return "bg-better";
    case "low":
      return "bg-brand-light";
    case "average":
      return "bg-ink-faint";
    case "high":
      return "bg-amber-400";
    case "very-high":
      return "bg-worse";
  }
}

export default function CrimeComparison({
  from,
  to,
}: CrimeComparisonProps) {
  const maxCrime = Math.max(from.crimeRatePer1000, to.crimeRatePer1000, UK_AVERAGE_CRIME) * 1.2;
  const safer =
    to.crimeRatePer1000 < from.crimeRatePer1000
      ? "to"
      : to.crimeRatePer1000 > from.crimeRatePer1000
      ? "from"
      : "same";

  return (
    <div className="bg-surface rounded-2xl p-6 border border-brand-100">
      <h3 className="font-semibold text-ink mb-1 flex items-center gap-2">
        <Shield className="w-5 h-5 text-brand" />
        Crime &amp; Safety
      </h3>
      <p className="text-xs text-ink-muted mb-5">
        Total recorded crimes per 1,000 residents per year. Data from Police.uk,
        Police Scotland, and PSNI.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[from, to].map((loc) => {
          const config = CRIME_LEVEL_CONFIG[loc.crimeLevel];
          const Icon = config.icon;
          return (
            <div key={loc.id}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-ink text-sm">{loc.name}</p>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${config.bg} ${config.color} border ${config.border}`}
                >
                  <Icon className="w-3 h-3" />
                  {config.label}
                </span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-muted">Total crime</span>
                    <span className="font-medium text-ink">
                      {loc.crimeRatePer1000.toFixed(1)} per 1,000
                    </span>
                  </div>
                  <CrimeBar
                    value={loc.crimeRatePer1000}
                    max={maxCrime}
                    color={getCrimeBarColor(loc.crimeLevel)}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-muted">Violent crime</span>
                    <span className="font-medium text-ink">
                      {loc.violentCrimePer1000.toFixed(1)} per 1,000
                    </span>
                  </div>
                  <CrimeBar
                    value={loc.violentCrimePer1000}
                    max={maxCrime * 0.4}
                    color={getCrimeBarColor(loc.crimeLevel)}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-muted">Burglary</span>
                    <span className="font-medium text-ink">
                      {loc.burglaryPer1000.toFixed(1)} per 1,000
                    </span>
                  </div>
                  <CrimeBar
                    value={loc.burglaryPer1000}
                    max={maxCrime * 0.15}
                    color={getCrimeBarColor(loc.crimeLevel)}
                  />
                </div>
              </div>

              <p className="text-xs text-ink-muted mt-2">
                UK average: ~{UK_AVERAGE_CRIME} per 1,000
                {loc.crimeRatePer1000 < UK_AVERAGE_CRIME
                  ? ` · ${Math.round(((UK_AVERAGE_CRIME - loc.crimeRatePer1000) / UK_AVERAGE_CRIME) * 100)}% below average`
                  : loc.crimeRatePer1000 > UK_AVERAGE_CRIME
                  ? ` · ${Math.round(((loc.crimeRatePer1000 - UK_AVERAGE_CRIME) / UK_AVERAGE_CRIME) * 100)}% above average`
                  : " · Right on average"}
              </p>
            </div>
          );
        })}
      </div>

      {safer !== "same" && (
        <p
          className={`mt-4 text-sm px-4 py-2 rounded-xl ${
            safer === "to" ? "text-better bg-better/5" : "text-worse bg-worse/5"
          }`}
        >
          {safer === "to" ? (
            <>
              <TrendingDown className="w-4 h-4 inline mr-1" />
              {to.name} has {Math.round(((from.crimeRatePer1000 - to.crimeRatePer1000) / from.crimeRatePer1000) * 100)}%
              lower crime than {from.name}. Fewer incidents across the board.
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {to.name} has {Math.round(((to.crimeRatePer1000 - from.crimeRatePer1000) / from.crimeRatePer1000) * 100)}%
              higher crime than {from.name}. Worth researching specific neighbourhoods.
            </>
          )}
        </p>
      )}
    </div>
  );
}
