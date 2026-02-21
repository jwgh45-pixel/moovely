"use client";

import { ComparisonResult } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";
import BrandMark from "./BrandMark";

interface MoveSummaryCardProps {
  result: ComparisonResult;
}

interface CostDelta {
  label: string;
  annualDiff: number;
}

function getTopChanges(result: ComparisonResult): {
  wins: CostDelta[];
  losses: CostDelta[];
} {
  const items: CostDelta[] = [
    { label: "Rent", annualDiff: result.rentDiff },
    { label: "Council Tax", annualDiff: result.councilTaxDiff },
    { label: "Commute", annualDiff: result.commuteDiff },
    { label: "Groceries", annualDiff: result.groceryDiff },
    { label: "Energy", annualDiff: result.energyDiff },
    { label: "Lifestyle", annualDiff: result.lifestyleDiff },
  ];

  if (result.includesChildcare) {
    items.push({ label: "Childcare", annualDiff: result.childcareDiff });
  }

  if (result.takeHomeDiff !== 0) {
    items.push({ label: "Take-home pay", annualDiff: result.takeHomeDiff });
  }

  const wins = items
    .filter((i) => i.annualDiff > 50)
    .sort((a, b) => b.annualDiff - a.annualDiff)
    .slice(0, 3);

  const losses = items
    .filter((i) => i.annualDiff < -50)
    .sort((a, b) => a.annualDiff - b.annualDiff)
    .slice(0, 3);

  return { wins, losses };
}

export default function MoveSummaryCard({ result }: MoveSummaryCardProps) {
  const { from, to, verdict, totalAnnualDiff, isPersonalised } = result;
  const { wins, losses } = getTopChanges(result);

  const verdictText =
    verdict === "greener"
      ? `${formatCurrency(Math.abs(totalAnnualDiff))}/yr better off`
      : verdict === "not-greener"
      ? `${formatCurrency(Math.abs(totalAnnualDiff))}/yr worse off`
      : "About the same";

  const verdictColor =
    verdict === "greener"
      ? "text-better"
      : verdict === "not-greener"
      ? "text-worse"
      : "text-ink-muted";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 via-surface to-lime/5 p-6 md:p-8">
      {/* Watermark */}
      <div className="absolute top-4 right-4 opacity-10">
        <BrandMark size="xl" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <BrandMark size="sm" verdict={verdict} />
        <div>
          <p className="text-xs text-ink-muted uppercase tracking-wider font-medium">
            Your Move Summary
          </p>
          {isPersonalised && (
            <p className="text-[10px] text-brand">
              Personalised to {formatCurrency(result.salaryFrom)} salary
            </p>
          )}
        </div>
      </div>

      {/* Locations */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-lg font-bold text-ink">{from.name}</span>
        <span className="text-ink-faint">&rarr;</span>
        <span className="text-lg font-bold text-ink">{to.name}</span>
      </div>

      {/* Verdict */}
      <p className={`text-2xl font-bold ${verdictColor} mb-5`}>
        {verdictText}
      </p>

      {/* Wins and losses */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {wins.length > 0 && (
          <div>
            <p className="text-xs font-medium text-better mb-2">
              Where you save
            </p>
            <ul className="space-y-1">
              {wins.map((w) => (
                <li
                  key={w.label}
                  className="text-sm text-ink flex justify-between"
                >
                  <span>{w.label}</span>
                  <span className="font-medium text-better">
                    +{formatCurrency(w.annualDiff)}/yr
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {losses.length > 0 && (
          <div>
            <p className="text-xs font-medium text-worse mb-2">
              Where you pay more
            </p>
            <ul className="space-y-1">
              {losses.map((l) => (
                <li
                  key={l.label}
                  className="text-sm text-ink flex justify-between"
                >
                  <span>{l.label}</span>
                  <span className="font-medium text-worse">
                    {formatCurrency(l.annualDiff, true)}/yr
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Branding footer */}
      <div className="flex items-center justify-between pt-4 border-t border-brand-200">
        <div className="flex items-center gap-2">
          <BrandMark size="xs" />
          <span className="text-xs font-semibold text-brand">moovely.co</span>
        </div>
        <span className="text-[10px] text-ink-faint">
          Government data, not guesswork
        </span>
      </div>
    </div>
  );
}
