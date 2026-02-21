"use client";

import { useState, useMemo } from "react";
import { ComparisonResult, SpendingBreakdown, PersonalisationOptions } from "@/lib/types";
import { formatCurrency, calculateRequiredSalary } from "@/lib/calculations";
import AffordabilityGauge from "./AffordabilityGauge";
import MoveSummaryCard from "./MoveSummaryCard";
import MetricCard from "./MetricCard";
import BrandMark from "./BrandMark";
import ShareButton from "./ShareButton";
import {
  Banknote,
  Home,
  Train,
  ShoppingCart,
  Zap,
  Baby,
  Beer,
  Building2,
  PiggyBank,
  Receipt,
  Calendar,
  Sparkles,
  ChevronUp,
  List,
  ExternalLink,
  Target,
  TrendingUp,
  Share2,
} from "lucide-react";
import AffiliateCard from "./AffiliateCard";
import type { AffiliateType } from "./AffiliateCard";
import EmailCapture from "./EmailCapture";
import LifestyleTabs from "./LifestyleTabs";

interface ComparisonResultsProps {
  result: ComparisonResult;
  options: PersonalisationOptions;
}

const BED_LABELS = { one: "1-bed", two: "2-bed", three: "3-bed" };

const JUMP_SECTIONS = [
  { id: "section-summary", label: "Summary" },
  { id: "section-costs", label: "Costs" },
  { id: "section-buying", label: "Buying" },
  { id: "section-lifestyle", label: "Lifestyle" },
];

const AFFILIATE_CONFIGS: { type: AffiliateType; icon: string; label: string }[] = [
  { type: "mortgage", icon: "🏡", label: "Mortgages" },
  { type: "removals", icon: "📦", label: "Removals" },
  { type: "broadband", icon: "📡", label: "Broadband" },
  { type: "energy", icon: "⚡", label: "Energy" },
];

// Spending bar colours
const SPEND_COLOURS = [
  { key: "rent", label: "Rent", color: "bg-rose-400" },
  { key: "councilTax", label: "Council Tax", color: "bg-amber-400" },
  { key: "commute", label: "Commute", color: "bg-sky-400" },
  { key: "groceries", label: "Groceries", color: "bg-orange-400" },
  { key: "energy", label: "Energy", color: "bg-purple-400" },
  { key: "childcare", label: "Childcare", color: "bg-pink-400" },
  { key: "lifestyle", label: "Lifestyle", color: "bg-indigo-400" },
  { key: "disposable", label: "Disposable", color: "bg-better" },
] as const;

function SpendingBar({
  spending,
  takeHome,
  locationName,
}: {
  spending: SpendingBreakdown;
  takeHome: number;
  locationName: string;
}) {
  const total = takeHome;
  if (total <= 0) return null;

  // Filter out zero categories
  const segments = SPEND_COLOURS.filter(
    (c) => spending[c.key as keyof SpendingBreakdown] > 0
  );

  return (
    <div>
      <p className="text-sm font-medium text-ink mb-2">{locationName}</p>
      <div className="w-full h-8 rounded-full overflow-hidden flex bg-surface-sunken">
        {segments.map((seg) => {
          const val = spending[seg.key as keyof SpendingBreakdown];
          const pct = Math.max((val / total) * 100, 0);
          if (pct < 1) return null;
          return (
            <div
              key={seg.key}
              className={`h-full ${seg.color} transition-all duration-500`}
              style={{ width: `${pct}%` }}
              title={`${seg.label}: ${formatCurrency(val)}/mo`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {segments.map((seg) => {
          const val = spending[seg.key as keyof SpendingBreakdown];
          if (val <= 0) return null;
          return (
            <span key={seg.key} className="flex items-center gap-1 text-xs text-ink-muted">
              <span className={`inline-block w-2 h-2 rounded-full ${seg.color}`} />
              {seg.label}: {formatCurrency(val)}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-8">
      <div className="flex-1 h-px bg-brand-100" />
      <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">
        {label}
      </span>
      <div className="flex-1 h-px bg-brand-100" />
    </div>
  );
}

export default function ComparisonResults({ result, options }: ComparisonResultsProps) {
  const { from, to, verdict, totalAnnualDiff, isPersonalised } = result;
  const [jumpMenuOpen, setJumpMenuOpen] = useState(false);

  // Reverse salary calculation
  const reverseSalary = useMemo(
    () => calculateRequiredSalary(from, to, options),
    [from, to, options]
  );

  const rentFrom =
    result.bedSize === "one"
      ? from.rentOneBed
      : result.bedSize === "three"
      ? from.rentThreeBed
      : from.rentTwoBed;
  const rentTo =
    result.bedSize === "one"
      ? to.rentOneBed
      : result.bedSize === "three"
      ? to.rentThreeBed
      : to.rentTwoBed;

  const headline = (() => {
    const amount = formatCurrency(Math.abs(totalAnnualDiff));
    const who = isPersonalised ? "You'd" : "You'd";
    if (verdict === "greener") {
      return {
        text: `${who} be ${amount}/year better off in ${to.name}`,
        subtext: isPersonalised
          ? "Based on YOUR salary. The grass IS greener for you."
          : "Based on area median salaries. Personalise it to see YOUR numbers.",
        color: "text-better",
        bg: "bg-better/5 border-better/20",
      };
    }
    if (verdict === "not-greener") {
      return {
        text: `${who} be ${amount}/year worse off in ${to.name}`,
        subtext: isPersonalised
          ? `Based on YOUR salary. ${from.name} is treating you well.`
          : `Based on area medians. Honestly? ${from.name} looks good.`,
        color: "text-worse",
        bg: "bg-worse/5 border-worse/20",
      };
    }
    return {
      text: `It's basically a wash between ${from.name} and ${to.name}`,
      subtext: isPersonalised
        ? "Based on YOUR salary. This one's about lifestyle, not pounds."
        : "The money's about the same - so this one's about lifestyle, not pounds.",
      color: "text-ink",
      bg: "bg-brand-50 border-brand/20",
    };
  })();

  // Accent colours for alternating metric card left borders
  const accentColors = [
    "border-l-brand",
    "border-l-lime",
    "border-l-sky-400",
    "border-l-amber-400",
    "border-l-rose-400",
    "border-l-purple-400",
    "border-l-indigo-400",
    "border-l-pink-400",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Personalised badge */}
      {isPersonalised && (
        <div className="flex items-center gap-2 mb-4 text-sm text-brand bg-brand-50 px-4 py-2 rounded-xl w-fit">
          <Sparkles className="w-4 h-4" />
          Personalised to your {formatCurrency(result.salaryFrom)} salary
        </div>
      )}

      {/* Headline card */}
      <div
        id="section-summary"
        className={`rounded-3xl border-2 ${headline.bg} p-8 mb-8 text-center`}
      >
        <BrandMark
          verdict={verdict}
          size="xl"
          className="mx-auto mb-4"
        />
        <h2
          className={`text-2xl md:text-3xl font-bold ${headline.color} mb-2`}
        >
          {headline.text}
        </h2>
        <p className="text-ink-muted text-sm">{headline.subtext}</p>

        {/* 5-year compounding callout */}
        {Math.abs(totalAnnualDiff) > 200 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl text-sm">
            <Calendar className="w-4 h-4 text-ink-muted" />
            <span className="text-ink-muted">
              Over 5 years, that&apos;s{" "}
              <span
                className={`font-bold ${
                  result.fiveYearDiff > 0 ? "text-better" : "text-worse"
                }`}
              >
                {formatCurrency(Math.abs(result.fiveYearDiff))}
              </span>{" "}
              {result.fiveYearDiff > 0 ? "in your pocket" : "out of pocket"}
            </span>
          </div>
        )}

        {/* Moving payback period - only when moving saves money */}
        {verdict === "greener" && totalAnnualDiff > 0 && (() => {
          const monthlySaving = totalAnnualDiff / 12;
          const lowCost = 3000;
          const highCost = 5000;
          const lowMonths = Math.ceil(lowCost / monthlySaving);
          const highMonths = Math.ceil(highCost / monthlySaving);
          if (highMonths <= 24) {
            return (
              <div className="mt-4 inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl text-sm">
                <TrendingUp className="w-4 h-4 text-better" />
                <span className="text-ink-muted">
                  Moving costs ({formatCurrency(lowCost)}-{formatCurrency(highCost)}) paid back in{" "}
                  <span className="font-bold text-better">
                    {lowMonths}-{highMonths} months
                  </span>
                </span>
              </div>
            );
          }
          return null;
        })()}

        <div className="flex items-center justify-center gap-4 mt-6">
          <ShareButton
            from={from}
            to={to}
            totalAnnualDiff={totalAnnualDiff}
            verdict={verdict}
          />
        </div>
      </div>

      {/* Reverse salary calculator */}
      {isPersonalised && (
        <div className="rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 to-surface p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-brand" />
            <h3 className="font-bold text-ink">
              What salary would you need in {to.name}?
            </h3>
          </div>
          <p className="text-3xl md:text-4xl font-bold text-ink mb-2">
            {formatCurrency(reverseSalary.requiredSalary)}
          </p>
          <p className="text-sm text-ink-muted mb-3">
            To keep your current lifestyle, you&apos;d need to earn this in {to.name}.
          </p>
          <p
            className={`text-sm font-medium ${
              reverseSalary.medianDiff > 0 ? "text-worse" : "text-better"
            }`}
          >
            That&apos;s {formatCurrency(Math.abs(reverseSalary.medianDiff))}{" "}
            {reverseSalary.medianDiff > 0 ? "above" : "below"} the {to.name} median
            ({formatCurrency(to.medianSalary)})
          </p>
        </div>
      )}

      {/* Tax breakdown - standalone panels with divider (no card wrapper) */}
      <div id="section-costs">
        <div className="mb-2">
          <h3 className="font-bold text-ink mb-1 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-brand" />
            Your Take-Home Pay
          </h3>
          <p className="text-xs text-ink-muted mb-4">
            {isPersonalised
              ? "Based on your salary - showing what you'd actually receive in each location."
              : "Based on area median salaries. Personalise above to see your own numbers."}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[
            { loc: from, tax: result.takeHomeFrom, salary: result.salaryFrom },
            { loc: to, tax: result.takeHomeTo, salary: result.salaryTo },
          ].map(({ loc, tax, salary }) => (
            <div key={loc.id} className="bg-brand-50/50 rounded-xl p-4">
              <p className="font-semibold text-ink text-sm mb-3">
                {loc.name}
                {loc.country === "Scotland" && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    Scottish tax rates
                  </span>
                )}
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Gross salary</span>
                  <span className="font-medium text-ink">
                    {formatCurrency(salary)}
                  </span>
                </div>
                <div className="flex justify-between text-worse/80">
                  <span>Income tax</span>
                  <span>-{formatCurrency(tax.incomeTax)}</span>
                </div>
                <div className="flex justify-between text-worse/80">
                  <span>National Insurance</span>
                  <span>-{formatCurrency(tax.nationalInsurance)}</span>
                </div>
                <div className="border-t border-brand-200 pt-1.5 flex justify-between">
                  <span className="font-semibold text-ink">Take-home</span>
                  <span className="font-bold text-ink">
                    {formatCurrency(tax.takeHome)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-ink-muted">
                  <span>
                    Effective tax rate: {tax.effectiveRate}%
                  </span>
                  <span>{formatCurrency(tax.monthlyTakeHome)}/mo</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {result.takeHomeDiff !== 0 && (
          <p
            className={`text-sm text-center mb-4 ${
              result.takeHomeDiff > 0 ? "text-better" : result.takeHomeDiff < 0 ? "text-worse" : "text-ink-muted"
            }`}
          >
            {result.takeHomeDiff > 0
              ? `You'd take home ${formatCurrency(result.takeHomeDiff)} more per year in ${to.name}`
              : result.takeHomeDiff < 0
              ? `You'd take home ${formatCurrency(Math.abs(result.takeHomeDiff))} less per year in ${to.name}`
              : "Same take-home pay in both locations"}
            {isPersonalised &&
              from.country !== to.country &&
              " (different tax rates apply)"}
          </p>
        )}
      </div>

      <SectionDivider label="Where Your Money Goes" />

      {/* Stacked spending bars - replaces old disposable income cards */}
      <div className="mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-ink mb-1 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-brand" />
            Where Your Money Goes
          </h3>
          <p className="text-sm text-ink-muted">
            How your monthly take-home splits between costs and what you keep.
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-6 border border-brand-100 space-y-6">
          <SpendingBar
            spending={result.spendingFrom}
            takeHome={result.takeHomeFrom.monthlyTakeHome}
            locationName={from.name}
          />
          <SpendingBar
            spending={result.spendingTo}
            takeHome={result.takeHomeTo.monthlyTakeHome}
            locationName={to.name}
          />

          {/* Summary comparison */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-brand-100">
            <div>
              <p className="text-xs text-ink-muted mb-1">{from.name} disposable</p>
              <p className="text-2xl font-bold text-ink">
                {formatCurrency(result.monthlyDisposableFrom)}
                <span className="text-sm font-normal text-ink-muted">/mo</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-muted mb-1">{to.name} disposable</p>
              <p className="text-2xl font-bold text-ink">
                {formatCurrency(result.monthlyDisposableTo)}
                <span className="text-sm font-normal text-ink-muted">/mo</span>
              </p>
            </div>
          </div>

          {/* Affordability gauges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-brand-100">
            <AffordabilityGauge
              disposable={result.monthlyDisposableFrom}
              locationName={from.name}
            />
            <AffordabilityGauge
              disposable={result.monthlyDisposableTo}
              locationName={to.name}
            />
          </div>
        </div>
      </div>

      <SectionDivider label="Living Costs" />

      {/* Metric breakdown cards with expandable detail and accent borders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!isPersonalised && (
          <MetricCard
            label="Salary (Area Median)"
            fromValue={from.medianSalary}
            toValue={to.medianSalary}
            annualDiff={result.salaryDiff}
            format="currency"
            icon={<Banknote className="w-5 h-5" />}
            delay={0}
            fromName={from.name}
            toName={to.name}
            accentColor={accentColors[0]}
            detail={
              <p className="text-xs text-ink-muted">
                Median salary reflects what a typical worker earns in each area.
                Enter your own salary above for a more accurate comparison.
              </p>
            }
          />
        )}
        <MetricCard
          label={`Rent (${BED_LABELS[result.bedSize]})`}
          fromValue={rentFrom}
          toValue={rentTo}
          annualDiff={result.rentDiff}
          format="currency-monthly"
          icon={<Home className="w-5 h-5" />}
          delay={50}
          fromName={from.name}
          toName={to.name}
          accentColor={accentColors[1]}
          detail={
            <div className="space-y-2">
              <p className="text-xs font-medium text-ink mb-2">All sizes:</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-ink-muted">1-bed</div>
                <div className="text-ink-muted">2-bed</div>
                <div className="text-ink-muted">3-bed</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="font-medium text-ink">{formatCurrency(from.rentOneBed)}</div>
                <div className="font-medium text-ink">{formatCurrency(from.rentTwoBed)}</div>
                <div className="font-medium text-ink">{formatCurrency(from.rentThreeBed)}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="font-medium text-ink">{formatCurrency(to.rentOneBed)}</div>
                <div className="font-medium text-ink">{formatCurrency(to.rentTwoBed)}</div>
                <div className="font-medium text-ink">{formatCurrency(to.rentThreeBed)}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-ink-muted">
                <div className="truncate">{from.name}</div>
                <div></div>
                <div className="truncate">{to.name}</div>
              </div>
            </div>
          }
        />
        <MetricCard
          label="Council Tax (Band D)"
          fromValue={from.councilTaxBandD}
          toValue={to.councilTaxBandD}
          annualDiff={result.councilTaxDiff}
          format="currency"
          icon={<Building2 className="w-5 h-5" />}
          delay={100}
          fromName={from.name}
          toName={to.name}
          accentColor={accentColors[2]}
          detail={
            <p className="text-xs text-ink-muted">
              Band D is the standard benchmark. Your actual band depends on
              your property value. Most homes fall between Band C and E.
            </p>
          }
        />
        <MetricCard
          label={`Commute${result.commuteType === "wfh" ? " (WFH)" : ""}`}
          fromValue={result.commuteType === "wfh" ? 0 : from.commuteMonthly}
          toValue={result.commuteType === "wfh" ? 0 : to.commuteMonthly}
          annualDiff={result.commuteDiff}
          format="currency-monthly"
          icon={<Train className="w-5 h-5" />}
          delay={150}
          fromName={from.name}
          toName={to.name}
          accentColor={accentColors[3]}
          detail={
            result.commuteType === "wfh" ? (
              <p className="text-xs text-ink-muted">
                You work from home, so commute costs are zeroed out. Change this in the
                personalisation panel above if your situation changes.
              </p>
            ) : (
              <p className="text-xs text-ink-muted">
                Based on average monthly public transport / driving costs for the area.
                Includes season tickets, fuel, and parking where relevant.
              </p>
            )
          }
        />
        <MetricCard
          label="Weekly Groceries"
          fromValue={from.groceryBasketWeekly}
          toValue={to.groceryBasketWeekly}
          annualDiff={result.groceryDiff}
          format="currency-weekly"
          icon={<ShoppingCart className="w-5 h-5" />}
          delay={200}
          fromName={from.name}
          toName={to.name}
          accentColor={accentColors[4]}
          detail={
            <p className="text-xs text-ink-muted">
              Based on a typical weekly shop for essentials. Prices vary by supermarket
              - this uses a weighted average across major chains.
            </p>
          }
        />
        <MetricCard
          label="Energy Bills"
          fromValue={from.energyMonthly}
          toValue={to.energyMonthly}
          annualDiff={result.energyDiff}
          format="currency-monthly"
          icon={<Zap className="w-5 h-5" />}
          delay={250}
          fromName={from.name}
          toName={to.name}
          accentColor={accentColors[5]}
          detail={
            <p className="text-xs text-ink-muted">
              Average gas and electricity combined. Actual costs depend on
              property size, insulation, and usage patterns.
            </p>
          }
        />
        {result.includesChildcare && (
          <MetricCard
            label="Childcare (Nursery)"
            fromValue={from.childcareMonthly}
            toValue={to.childcareMonthly}
            annualDiff={result.childcareDiff}
            format="currency-monthly"
            icon={<Baby className="w-5 h-5" />}
            delay={300}
            fromName={from.name}
            toName={to.name}
            accentColor={accentColors[6]}
            detail={
              <p className="text-xs text-ink-muted">
                Full-time nursery for one child. Part-time or childminder costs
                will be lower. Check gov.uk for funded hours you may be eligible for.
              </p>
            }
          />
        )}
        <MetricCard
          label="Lifestyle (Pints, Cinema, Gym)"
          fromValue={Math.round(
            (from.pintOfBeer * 8 + from.cinemaTicket * 2 + from.gymMembership) *
              result.lifestyleMultiplier
          )}
          toValue={Math.round(
            (to.pintOfBeer * 8 + to.cinemaTicket * 2 + to.gymMembership) *
              result.lifestyleMultiplier
          )}
          annualDiff={result.lifestyleDiff}
          format="currency-monthly"
          icon={<Beer className="w-5 h-5" />}
          delay={350}
          fromName={from.name}
          toName={to.name}
          accentColor={accentColors[7]}
          detail={
            <div className="space-y-2 text-xs">
              <p className="text-ink-muted mb-2">
                {result.lifestyleMultiplier === 0.5
                  ? "Scaled to homebody level (50%)"
                  : result.lifestyleMultiplier === 1.5
                  ? "Scaled to social butterfly level (150%)"
                  : "Based on average lifestyle spending"}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[from, to].map((loc) => (
                  <div key={loc.id}>
                    <p className="font-medium text-ink mb-1">{loc.name}</p>
                    <div className="space-y-0.5 text-ink-muted">
                      <div className="flex justify-between">
                        <span>8 pints</span>
                        <span>£{(loc.pintOfBeer * 8).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>2 cinema</span>
                        <span>£{(loc.cinemaTicket * 2).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gym</span>
                        <span>£{loc.gymMembership}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        />
      </div>

      <SectionDivider label="Property" />

      {/* House prices - gradient background */}
      <div
        id="section-buying"
        className="rounded-2xl p-6 border border-brand-100 bg-gradient-to-br from-brand-50 via-surface to-lime/5"
      >
        <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
          <Home className="w-5 h-5 text-brand" />
          If You&apos;re Buying
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-ink-muted mb-1">{from.name}</p>
            <p className="text-2xl font-bold text-ink">
              {formatCurrency(from.avgHousePrice)}
            </p>
            <p className="text-xs text-ink-muted">Average house price</p>
          </div>
          <div>
            <p className="text-sm text-ink-muted mb-1">{to.name}</p>
            <p className="text-2xl font-bold text-ink">
              {formatCurrency(to.avgHousePrice)}
            </p>
            <p className="text-xs text-ink-muted">Average house price</p>
          </div>
        </div>
        {to.avgHousePrice !== from.avgHousePrice && (
          <p
            className={`mt-4 text-sm px-4 py-2 rounded-xl ${
              to.avgHousePrice < from.avgHousePrice
                ? "text-better bg-better/5"
                : "text-worse bg-worse/5"
            }`}
          >
            {to.avgHousePrice < from.avgHousePrice
              ? `You could save ${formatCurrency(from.avgHousePrice - to.avgHousePrice)} on a home in ${to.name}. That's real money.`
              : `Housing is ${formatCurrency(to.avgHousePrice - from.avgHousePrice)} more expensive in ${to.name}. Factor that in.`}
          </p>
        )}

        {/* Affordability ratio */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-xl p-3">
            <p className="text-xs text-ink-muted mb-1">
              Price-to-income ratio
            </p>
            <p className="text-lg font-bold text-ink">
              {(from.avgHousePrice / result.salaryFrom).toFixed(1)}x
            </p>
            <p className="text-xs text-ink-muted">
              {from.name} ({isPersonalised ? "your salary" : "median"})
            </p>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <p className="text-xs text-ink-muted mb-1">
              Price-to-income ratio
            </p>
            <p className="text-lg font-bold text-ink">
              {(to.avgHousePrice / result.salaryTo).toFixed(1)}x
            </p>
            <p className="text-xs text-ink-muted">
              {to.name} ({isPersonalised ? "your salary" : "median"})
            </p>
          </div>
        </div>
      </div>

      {/* Contextual affiliate cards - mortgage + removals */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <AffiliateCard type="mortgage" toName={to.name} />
        <AffiliateCard type="removals" toName={to.name} />
      </div>

      <SectionDivider label="Lifestyle" />

      {/* Tabbed lifestyle section - Schools, Crime, Pint Index */}
      <div id="section-lifestyle" className="mt-2">
        <LifestyleTabs from={from} to={to} />
      </div>

      {/* Email capture */}
      <EmailCapture context={`${from.id}-vs-${to.id}`} />

      {/* Subtle affiliate links row */}
      <div className="mt-4 mb-4 rounded-xl border border-border-light bg-surface-raised/50 px-5 py-3">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="text-xs text-ink-faint">Moving? Compare deals:</span>
          {AFFILIATE_CONFIGS.map(({ type, icon, label }) => (
            <a
              key={type}
              href={`#affiliate-${type}_compare`}
              className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand transition-colors"
            >
              <span>{icon}</span>
              {label}
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          ))}
        </div>
      </div>

      {/* Shareable "Your Move" summary card */}
      <div className="mt-8 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-4 h-4 text-brand" />
          <p className="text-sm font-medium text-ink">
            Screenshot and share your results
          </p>
        </div>
        <MoveSummaryCard result={result} />
      </div>

      {/* Data disclaimer */}
      <p className="text-xs text-ink-muted text-center mt-4 max-w-2xl mx-auto">
        Data sourced from ONS, HMRC, and local authorities.{" "}
        {isPersonalised
          ? "Costs are location-specific; your salary is applied to both locations."
          : "Salaries are area medians - personalise above for your own numbers."}{" "}
        Comparison based on {BED_LABELS[result.bedSize]} rental, Band D council tax,
        and typical usage.{" "}
        {result.includesChildcare && "Includes full-time nursery costs. "}
        Always do your own sums before making big decisions.{" "}
        <span className="text-brand">
          But at least now you know where to start.
        </span>
      </p>

      {/* Floating "Jump to" navigation */}
      <div className="fixed bottom-6 right-6 z-40">
        {jumpMenuOpen && (
          <div className="mb-2 bg-surface rounded-xl border border-brand-100 shadow-xl shadow-brand/10 p-2 min-w-[140px] animate-fade-in-up">
            {JUMP_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setJumpMenuOpen(false)}
                className="block px-3 py-2 text-sm text-ink-muted hover:text-brand hover:bg-brand-50 rounded-lg transition-colors"
              >
                {section.label}
              </a>
            ))}
          </div>
        )}
        <button
          onClick={() => setJumpMenuOpen(!jumpMenuOpen)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-full shadow-lg shadow-brand/25 text-sm font-medium hover:bg-brand-dark transition-all"
          aria-label="Jump to section"
        >
          {jumpMenuOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <List className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Jump to</span>
        </button>
      </div>
    </div>
  );
}
