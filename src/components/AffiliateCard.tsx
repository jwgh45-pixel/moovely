"use client";

import { ArrowRight, ExternalLink } from "lucide-react";

export type AffiliateType =
  | "mortgage"
  | "removals"
  | "broadband"
  | "energy"
  | "insurance";

interface AffiliateConfig {
  title: string;
  description: string;
  cta: string;
  gradient: string;
  borderColor: string;
  iconBg: string;
  icon: string;
  utm: string;
}

const AFFILIATE_CONFIG: Record<AffiliateType, AffiliateConfig> = {
  mortgage: {
    title: "Ready to buy?",
    description:
      "Compare mortgage rates from 90+ lenders. Free, no-obligation quotes in minutes.",
    cta: "Compare Mortgages",
    gradient: "from-brand-50 to-brand-100/50",
    borderColor: "border-brand-200",
    iconBg: "bg-brand/10",
    icon: "🏡",
    utm: "mortgage_compare",
  },
  removals: {
    title: "Get removal quotes",
    description:
      "Compare prices from rated removal companies. Save up to 70% on your move.",
    cta: "Get Free Quotes",
    gradient: "from-lime/5 to-lime/10",
    borderColor: "border-lime/20",
    iconBg: "bg-lime/10",
    icon: "📦",
    utm: "removals_compare",
  },
  broadband: {
    title: "Sort your broadband",
    description:
      "Compare broadband deals at your new address. Switch in minutes.",
    cta: "Check Deals",
    gradient: "from-blue-50 to-blue-100/50",
    borderColor: "border-blue-200",
    iconBg: "bg-blue-500/10",
    icon: "📡",
    utm: "broadband_compare",
  },
  energy: {
    title: "Cut your energy bills",
    description:
      "Compare energy tariffs for your new home. Could save you hundreds.",
    cta: "Compare Tariffs",
    gradient: "from-amber-50 to-amber-100/50",
    borderColor: "border-amber-200",
    iconBg: "bg-amber-500/10",
    icon: "⚡",
    utm: "energy_compare",
  },
  insurance: {
    title: "Home insurance sorted",
    description:
      "Compare home insurance quotes for your new area. Takes 2 minutes.",
    cta: "Get Quotes",
    gradient: "from-purple-50 to-purple-100/50",
    borderColor: "border-purple-200",
    iconBg: "bg-purple-500/10",
    icon: "🛡️",
    utm: "insurance_compare",
  },
};

interface AffiliateCardProps {
  type: AffiliateType;
  toName: string;
  className?: string;
}

export default function AffiliateCard({
  type,
  toName,
  className = "",
}: AffiliateCardProps) {
  const config = AFFILIATE_CONFIG[type];

  // Placeholder affiliate URLs - replace with real partner links
  const affiliateUrl = `#affiliate-${config.utm}`;

  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`group block rounded-2xl border ${config.borderColor} bg-gradient-to-br ${config.gradient} p-5 hover:shadow-md transition-all ${className}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center text-xl shrink-0`}
        >
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink text-sm">{config.title}</p>
          <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-ink-muted">
          Moving to {toName}?
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand group-hover:gap-2.5 transition-all">
          {config.cta}
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </a>
  );
}

interface AffiliateBannerProps {
  toName: string;
}

export function AffiliateBanner({ toName }: AffiliateBannerProps) {
  return (
    <div className="rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 via-surface to-lime/5 p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs text-ink-faint uppercase tracking-wider mb-1">
            Making the move?
          </p>
          <h3 className="text-lg font-bold text-ink mb-1">
            We can help with the boring bits too
          </h3>
          <p className="text-sm text-ink-muted">
            Mortgages, removals, broadband, energy - compare the best deals for{" "}
            {toName}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {(["mortgage", "removals", "broadband"] as AffiliateType[]).map(
            (type) => {
              const config = AFFILIATE_CONFIG[type];
              return (
                <a
                  key={type}
                  href={`#affiliate-${config.utm}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface rounded-xl border border-brand-100 text-sm font-medium text-ink hover:border-brand-200 hover:shadow-sm transition-all"
                >
                  <span>{config.icon}</span>
                  {config.cta}
                  <ExternalLink className="w-3 h-3 text-ink-muted" />
                </a>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
