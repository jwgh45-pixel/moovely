"use client";

import { ComparisonResult } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";
import MetricCard from "./MetricCard";
import CowMascot from "./CowMascot";
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
} from "lucide-react";

interface ComparisonResultsProps {
  result: ComparisonResult;
}

export default function ComparisonResults({ result }: ComparisonResultsProps) {
  const { from, to, verdict, totalAnnualDiff } = result;

  const headline = (() => {
    const amount = formatCurrency(Math.abs(totalAnnualDiff));
    if (verdict === "greener") {
      return {
        text: `You'd be ${amount}/year better off in ${to.name}`,
        subtext: "The grass IS greener. Time to start packing? 🐄",
        color: "text-better",
        bg: "bg-better/5 border-better/20",
      };
    }
    if (verdict === "not-greener") {
      return {
        text: `You'd be ${amount}/year worse off in ${to.name}`,
        subtext: `Honestly? ${from.name} is treating you pretty well.`,
        color: "text-worse",
        bg: "bg-worse/5 border-worse/20",
      };
    }
    return {
      text: `It's basically a wash between ${from.name} and ${to.name}`,
      subtext:
        "The money's about the same - so this one's about lifestyle, not pounds.",
      color: "text-charcoal",
      bg: "bg-grass-50 border-grass/20",
    };
  })();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Headline card */}
      <div
        className={`rounded-3xl border-2 ${headline.bg} p-8 mb-8 text-center`}
      >
        <CowMascot
          verdict={verdict}
          size="lg"
          className="mx-auto mb-4 cow-bounce"
        />
        <h2
          className={`text-2xl md:text-3xl font-bold ${headline.color} headline-number mb-2`}
        >
          {headline.text}
        </h2>
        <p className="text-charcoal-muted">{headline.subtext}</p>

        <div className="flex items-center justify-center gap-4 mt-6">
          <ShareButton from={from} to={to} totalAnnualDiff={totalAnnualDiff} verdict={verdict} />
        </div>
      </div>

      {/* Real wages breakdown */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-charcoal mb-1 flex items-center gap-2">
          <PiggyBank className="w-5 h-5 text-grass" />
          The Real Wages Breakdown
        </h3>
        <p className="text-sm text-charcoal-muted mb-4">
          This is what actually matters - not just costs, but what you have left
          after everything.
        </p>
      </div>

      {/* Disposable income comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-grass-100">
          <p className="text-sm text-charcoal-muted mb-1">{from.name}</p>
          <p className="text-xs text-charcoal-muted mb-3">
            Monthly after essentials
          </p>
          <p className="text-3xl font-bold text-charcoal">
            {formatCurrency(result.monthlyDisposableFrom)}
            <span className="text-base font-normal text-charcoal-muted">
              /mo
            </span>
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-grass-100">
          <p className="text-sm text-charcoal-muted mb-1">{to.name}</p>
          <p className="text-xs text-charcoal-muted mb-3">
            Monthly after essentials
          </p>
          <p className="text-3xl font-bold text-charcoal">
            {formatCurrency(result.monthlyDisposableTo)}
            <span className="text-base font-normal text-charcoal-muted">
              /mo
            </span>
          </p>
        </div>
      </div>

      {/* Metric breakdown cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="Salary (Median)"
          fromValue={from.medianSalary}
          toValue={to.medianSalary}
          annualDiff={result.salaryDiff}
          format="currency"
          icon={<Banknote className="w-5 h-5" />}
          delay={0}
          fromName={from.name}
          toName={to.name}
        />
        <MetricCard
          label="Rent (2-bed)"
          fromValue={from.rentTwoBed}
          toValue={to.rentTwoBed}
          annualDiff={result.rentDiff}
          format="currency-monthly"
          icon={<Home className="w-5 h-5" />}
          delay={50}
          fromName={from.name}
          toName={to.name}
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
        />
        <MetricCard
          label="Commute"
          fromValue={from.commuteMonthly}
          toValue={to.commuteMonthly}
          annualDiff={result.commuteDiff}
          format="currency-monthly"
          icon={<Train className="w-5 h-5" />}
          delay={150}
          fromName={from.name}
          toName={to.name}
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
        />
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
        />
        <MetricCard
          label="Lifestyle (Pints, Cinema, Gym)"
          fromValue={
            from.pintOfBeer * 8 + from.cinemaTicket * 2 + from.gymMembership
          }
          toValue={
            to.pintOfBeer * 8 + to.cinemaTicket * 2 + to.gymMembership
          }
          annualDiff={result.lifestyleDiff}
          format="currency-monthly"
          icon={<Beer className="w-5 h-5" />}
          delay={350}
          fromName={from.name}
          toName={to.name}
        />
      </div>

      {/* House prices (not in the annual calc but important context) */}
      <div className="mt-8 bg-white rounded-2xl p-6 border border-grass-100">
        <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Home className="w-5 h-5 text-grass" />
          If You&apos;re Buying
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-charcoal-muted mb-1">{from.name}</p>
            <p className="text-2xl font-bold text-charcoal">
              {formatCurrency(from.avgHousePrice)}
            </p>
            <p className="text-xs text-charcoal-muted">Average house price</p>
          </div>
          <div>
            <p className="text-sm text-charcoal-muted mb-1">{to.name}</p>
            <p className="text-2xl font-bold text-charcoal">
              {formatCurrency(to.avgHousePrice)}
            </p>
            <p className="text-xs text-charcoal-muted">Average house price</p>
          </div>
        </div>
        {to.avgHousePrice < from.avgHousePrice && (
          <p className="mt-4 text-sm text-better bg-better/5 px-4 py-2 rounded-xl">
            You could save{" "}
            {formatCurrency(from.avgHousePrice - to.avgHousePrice)} on a home
            in {to.name}. That&apos;s real money.
          </p>
        )}
        {to.avgHousePrice > from.avgHousePrice && (
          <p className="mt-4 text-sm text-worse bg-worse/5 px-4 py-2 rounded-xl">
            Housing is{" "}
            {formatCurrency(to.avgHousePrice - from.avgHousePrice)} more
            expensive in {to.name}. Factor that in.
          </p>
        )}
      </div>

      {/* Pint index - fun shareable stat */}
      <div className="mt-6 bg-gradient-to-r from-sunset/5 to-grass-50 rounded-2xl p-6 border border-sunset/10">
        <h3 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
          <Beer className="w-5 h-5 text-sunset" />
          The Pint Index
        </h3>
        <p className="text-sm text-charcoal-muted mb-3">
          Because sometimes this is the only metric that really matters.
        </p>
        <div className="flex items-center gap-8">
          <div>
            <p className="text-xs text-charcoal-muted">{from.name}</p>
            <p className="text-xl font-bold text-charcoal">
              {formatCurrency(from.pintOfBeer)}
            </p>
          </div>
          <div className="text-2xl">→</div>
          <div>
            <p className="text-xs text-charcoal-muted">{to.name}</p>
            <p className="text-xl font-bold text-charcoal">
              {formatCurrency(to.pintOfBeer)}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-charcoal-muted">
              Annual savings (2 pints/week)
            </p>
            <p
              className={`text-lg font-bold ${
                from.pintOfBeer > to.pintOfBeer ? "text-better" : "text-worse"
              }`}
            >
              {formatCurrency(
                Math.round((from.pintOfBeer - to.pintOfBeer) * 2 * 52),
                true
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Data disclaimer */}
      <p className="text-xs text-charcoal-muted text-center mt-8">
        Data sourced from ONS, HMRC, and local authorities. Salaries are area
        medians - yours may differ. Comparison based on 2-bed rental, Band D
        council tax, and typical usage. Always do your own sums before making
        big decisions.{" "}
        <span className="text-grass">
          But at least now you know where to start.
        </span>
      </p>
    </div>
  );
}
