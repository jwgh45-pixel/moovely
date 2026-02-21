"use client";

import { formatCurrency } from "@/lib/calculations";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  fromValue: number;
  toValue: number;
  annualDiff: number;
  format?: "currency" | "currency-monthly" | "currency-weekly";
  icon: React.ReactNode;
  delay?: number;
  fromName: string;
  toName: string;
}

export default function MetricCard({
  label,
  fromValue,
  toValue,
  annualDiff,
  format = "currency-monthly",
  icon,
  delay = 0,
  fromName,
  toName,
}: MetricCardProps) {
  const isPositive = annualDiff > 0;
  const isNeutral = Math.abs(annualDiff) < 50;

  const formatValue = (v: number) => {
    switch (format) {
      case "currency":
        return formatCurrency(v);
      case "currency-monthly":
        return `${formatCurrency(v)}/mo`;
      case "currency-weekly":
        return `${formatCurrency(v)}/wk`;
    }
  };

  return (
    <div
      className="metric-card bg-white rounded-2xl p-5 border border-grass-100 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-grass-50 flex items-center justify-center text-grass">
          {icon}
        </div>
        <h3 className="font-semibold text-charcoal text-sm">{label}</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-charcoal-muted mb-1 truncate">{fromName}</p>
          <p className="font-semibold text-charcoal">{formatValue(fromValue)}</p>
        </div>
        <div>
          <p className="text-xs text-charcoal-muted mb-1 truncate">{toName}</p>
          <p className="font-semibold text-charcoal">{formatValue(toValue)}</p>
        </div>
      </div>

      <div
        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg ${
          isNeutral
            ? "bg-neutral/10 text-neutral"
            : isPositive
            ? "bg-better/10 text-better"
            : "bg-worse/10 text-worse"
        }`}
      >
        {isNeutral ? (
          <Minus className="w-4 h-4" />
        ) : isPositive ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        <span>
          {isNeutral
            ? "About the same"
            : `${formatCurrency(Math.abs(annualDiff))}/yr ${
                isPositive ? "better off" : "worse off"
              }`}
        </span>
      </div>
    </div>
  );
}
