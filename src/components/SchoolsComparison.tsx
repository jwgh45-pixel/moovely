"use client";

import { Location } from "@/lib/types";
import { GraduationCap, Star, CheckCircle, AlertCircle } from "lucide-react";

interface SchoolsComparisonProps {
  from: Location;
  to: Location;
}

const RATING_CONFIG = {
  excellent: {
    label: "Excellent",
    color: "text-better",
    bg: "bg-better/5",
    border: "border-better/20",
    description: "Outstanding school quality",
  },
  good: {
    label: "Good",
    color: "text-brand",
    bg: "bg-brand-50",
    border: "border-brand/20",
    description: "Above-average schools",
  },
  average: {
    label: "Average",
    color: "text-ink-muted",
    bg: "bg-surface-raised",
    border: "border-border",
    description: "Typical for the UK",
  },
  "below-average": {
    label: "Below Average",
    color: "text-worse",
    bg: "bg-worse/5",
    border: "border-worse/20",
    description: "Room for improvement",
  },
};

function RatingBadge({ rating }: { rating: Location["ofstedRating"] }) {
  const config = RATING_CONFIG[rating];
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${config.bg} ${config.color} border ${config.border}`}
    >
      {rating === "excellent" || rating === "good" ? (
        <CheckCircle className="w-3 h-3" />
      ) : (
        <AlertCircle className="w-3 h-3" />
      )}
      {config.label}
    </span>
  );
}

function ProgressBar({
  outstanding,
  good,
}: {
  outstanding: number;
  good: number;
}) {
  const combined = outstanding + good;
  return (
    <div className="w-full h-3 rounded-full bg-surface-sunken overflow-hidden flex">
      <div
        className="h-full bg-better rounded-l-full"
        style={{ width: `${outstanding}%` }}
        title={`Outstanding: ${outstanding}%`}
      />
      <div
        className="h-full bg-brand-light"
        style={{ width: `${good}%` }}
        title={`Good: ${good}%`}
      />
    </div>
  );
}

export default function SchoolsComparison({
  from,
  to,
}: SchoolsComparisonProps) {
  const fromCombined = from.schoolsOutstandingPct + from.schoolsGoodPct;
  const toCombined = to.schoolsOutstandingPct + to.schoolsGoodPct;
  const better =
    toCombined > fromCombined
      ? "to"
      : toCombined < fromCombined
      ? "from"
      : "same";

  return (
    <div className="bg-surface rounded-2xl p-6 border border-brand-100">
      <h3 className="font-semibold text-ink mb-1 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-brand" />
        School Quality
      </h3>
      <p className="text-xs text-ink-muted mb-5">
        Percentage of schools rated Outstanding or Good by Ofsted (England),
        Education Scotland, Estyn (Wales), or ETI (Northern Ireland).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { loc: from, label: "from" },
          { loc: to, label: "to" },
        ].map(({ loc }) => {
          const combined = loc.schoolsOutstandingPct + loc.schoolsGoodPct;
          return (
            <div key={loc.id}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-ink text-sm">{loc.name}</p>
                <RatingBadge rating={loc.ofstedRating} />
              </div>
              <ProgressBar
                outstanding={loc.schoolsOutstandingPct}
                good={loc.schoolsGoodPct}
              />
              <div className="flex justify-between mt-2 text-xs text-ink-muted">
                <span>
                  <span className="inline-block w-2 h-2 rounded-full bg-better mr-1" />
                  Outstanding: {loc.schoolsOutstandingPct}%
                </span>
                <span>
                  <span className="inline-block w-2 h-2 rounded-full bg-brand-light mr-1" />
                  Good: {loc.schoolsGoodPct}%
                </span>
                <span>{combined}% good+</span>
              </div>
              <p className="text-xs text-ink-muted mt-1">
                {loc.schoolsTotal} schools in area
              </p>
            </div>
          );
        })}
      </div>

      {better !== "same" && (
        <p
          className={`mt-4 text-sm px-4 py-2 rounded-xl ${
            better === "to"
              ? "text-better bg-better/5"
              : "text-worse bg-worse/5"
          }`}
        >
          {better === "to"
            ? `${to.name} has better-rated schools overall (${toCombined}% good or outstanding vs ${fromCombined}% in ${from.name}).`
            : `${from.name} has better-rated schools overall (${fromCombined}% good or outstanding vs ${toCombined}% in ${to.name}).`}
          {" "}
          Always check individual schools for your specific area.
        </p>
      )}
    </div>
  );
}
