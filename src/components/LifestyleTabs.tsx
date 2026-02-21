"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Shield, Beer } from "lucide-react";
import { Location } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";
import SchoolsComparison from "./SchoolsComparison";
import CrimeComparison from "./CrimeComparison";

interface LifestyleTabsProps {
  from: Location;
  to: Location;
}

const TABS = [
  { id: "schools", label: "Schools", icon: GraduationCap },
  { id: "safety", label: "Safety", icon: Shield },
  { id: "pub", label: "Pub Test", icon: Beer },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function LifestyleTabs({ from, to }: LifestyleTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("schools");

  return (
    <div className="bg-surface rounded-2xl border border-brand-100 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-brand-100 relative">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-medium transition-colors relative z-10 ${
                isActive
                  ? "text-brand"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "schools" && (
            <SchoolsComparison from={from} to={to} bare />
          )}
          {activeTab === "safety" && (
            <CrimeComparison from={from} to={to} bare />
          )}
          {activeTab === "pub" && <PintIndex from={from} to={to} />}
        </motion.div>
      </div>
    </div>
  );
}

function PintIndex({ from, to }: { from: Location; to: Location }) {
  return (
    <div>
      <p className="text-xs text-ink-muted mb-4">
        Because sometimes this is the only metric that really matters.
      </p>
      <div className="flex flex-wrap items-center gap-8">
        <div>
          <p className="text-xs text-ink-muted">{from.name}</p>
          <p className="text-xl font-bold text-ink">
            £{from.pintOfBeer.toFixed(2)}
          </p>
        </div>
        <div className="text-2xl text-ink-muted">&rarr;</div>
        <div>
          <p className="text-xs text-ink-muted">{to.name}</p>
          <p className="text-xl font-bold text-ink">
            £{to.pintOfBeer.toFixed(2)}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-ink-muted">Annual savings (2 pints/week)</p>
          <p
            className={`text-lg font-bold ${
              from.pintOfBeer > to.pintOfBeer
                ? "text-better"
                : from.pintOfBeer < to.pintOfBeer
                ? "text-worse"
                : "text-ink-muted"
            }`}
          >
            {formatCurrency(
              Math.round((from.pintOfBeer - to.pintOfBeer) * 2 * 52),
              true
            )}
          </p>
        </div>
      </div>

      {/* Extra detail: full lifestyle cost comparison */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {[from, to].map((loc) => (
          <div key={loc.id} className="bg-brand-50/50 rounded-xl p-3">
            <p className="text-xs font-medium text-ink mb-2">{loc.name}</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-muted">Pint of beer</span>
                <span className="font-medium text-ink">
                  £{loc.pintOfBeer.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Cinema ticket</span>
                <span className="font-medium text-ink">
                  £{loc.cinemaTicket.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Gym membership</span>
                <span className="font-medium text-ink">
                  {formatCurrency(loc.gymMembership)}/mo
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
