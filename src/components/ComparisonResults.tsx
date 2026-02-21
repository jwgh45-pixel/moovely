"use client";

import { ComparisonResult } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";
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
  TrendingUp,
  Calendar,
  Sparkles,
} from "lucide-react";

interface ComparisonResultsProps {
  result: ComparisonResult;
}

const BED_LABELS = { one: "1-bed", two: "2-bed", three: "3-bed" };

export default function ComparisonResults({ result }: ComparisonResultsProps) {
  const { from, to, verdict, totalAnnualDiff, isPersonalised } = result;

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

        <div className="flex items-center justify-center gap-4 mt-6">
          <ShareButton
            from={from}
            to={to}
            totalAnnualDiff={totalAnnualDiff}
            verdict={verdict}
          />
        </div>
      </div>

      {/* Tax breakdown - show people exactly where their money goes */}
      <div className="bg-surface rounded-2xl p-6 border border-brand-100 mb-8">
        <h3 className="font-bold text-ink mb-1 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-brand" />
          Your Take-Home Pay
        </h3>
        <p className="text-xs text-ink-muted mb-4">
          {isPersonalised
            ? "Based on your salary - showing what you'd actually receive in each location."
            : "Based on area median salaries. Personalise above to see your own numbers."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            className={`mt-3 text-sm text-center ${
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

      {/* Real wages breakdown */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-ink mb-1 flex items-center gap-2">
          <PiggyBank className="w-5 h-5 text-brand" />
          The Real Wages Breakdown
        </h3>
        <p className="text-sm text-ink-muted mb-4">
          What you have left after all the essentials. This is the number that
          matters.
        </p>
      </div>

      {/* Disposable income comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-surface rounded-2xl p-6 border border-brand-100">
          <p className="text-sm text-ink-muted mb-1">{from.name}</p>
          <p className="text-xs text-ink-muted mb-3">
            Monthly after essentials
          </p>
          <p className="text-3xl font-bold text-ink">
            {formatCurrency(result.monthlyDisposableFrom)}
            <span className="text-base font-normal text-ink-muted">
              /mo
            </span>
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-6 border border-brand-100">
          <p className="text-sm text-ink-muted mb-1">{to.name}</p>
          <p className="text-xs text-ink-muted mb-3">
            Monthly after essentials
          </p>
          <p className="text-3xl font-bold text-ink">
            {formatCurrency(result.monthlyDisposableTo)}
            <span className="text-base font-normal text-ink-muted">
              /mo
            </span>
          </p>
        </div>
      </div>

      {/* Metric breakdown cards */}
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
          />
        )}
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

      {/* House prices */}
      <div className="mt-8 bg-surface rounded-2xl p-6 border border-brand-100">
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

        {/* Affordability ratio - deeply useful context */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-brand-50/50 rounded-xl p-3">
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
          <div className="bg-brand-50/50 rounded-xl p-3">
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

      {/* Pint index */}
      <div className="mt-6 bg-gradient-to-r from-lime/5 to-brand-50 rounded-2xl p-6 border border-lime/10">
        <h3 className="font-semibold text-ink mb-2 flex items-center gap-2">
          <Beer className="w-5 h-5 text-lime" />
          The Pint Index
        </h3>
        <p className="text-sm text-ink-muted mb-3">
          Because sometimes this is the only metric that really matters.
        </p>
        <div className="flex flex-wrap items-center gap-8">
          <div>
            <p className="text-xs text-ink-muted">{from.name}</p>
            <p className="text-xl font-bold text-ink">
              £{from.pintOfBeer.toFixed(2)}
            </p>
          </div>
          <div className="text-2xl text-ink-muted">→</div>
          <div>
            <p className="text-xs text-ink-muted">{to.name}</p>
            <p className="text-xl font-bold text-ink">
              £{to.pintOfBeer.toFixed(2)}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-ink-muted">
              Annual savings (2 pints/week)
            </p>
            <p
              className={`text-lg font-bold ${
                from.pintOfBeer > to.pintOfBeer ? "text-better" : from.pintOfBeer < to.pintOfBeer ? "text-worse" : "text-ink-muted"
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
      <p className="text-xs text-ink-muted text-center mt-8 max-w-2xl mx-auto">
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
    </div>
  );
}
