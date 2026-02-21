"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/calculations";
import { TrendingUp, TrendingDown, Minus, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  detail?: React.ReactNode;
  accentColor?: string;
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
  detail,
  accentColor,
}: MetricCardProps) {
  const [expanded, setExpanded] = useState(false);
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

  const hasDetail = !!detail;

  return (
    <div
      className={`metric-card bg-surface rounded-2xl border border-brand-100 animate-fade-in-up ${
        hasDetail ? "cursor-pointer" : ""
      } ${accentColor ? `border-l-4 ${accentColor}` : ""}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={hasDetail ? () => setExpanded(!expanded) : undefined}
    >
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand">
            {icon}
          </div>
          <h3 className="font-semibold text-ink text-sm flex-1">{label}</h3>
          {hasDetail && (
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-ink-muted" />
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-ink-muted mb-1 truncate">{fromName}</p>
            <p className="font-semibold text-ink">{formatValue(fromValue)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-muted mb-1 truncate">{toName}</p>
            <p className="font-semibold text-ink">{formatValue(toValue)}</p>
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

      {/* Expandable detail */}
      <AnimatePresence>
        {expanded && detail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 border-t border-brand-100">
              <div className="pt-4">{detail}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
