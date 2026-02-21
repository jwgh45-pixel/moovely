import { Location, TaxBreakdown, ComparisonResult, Verdict } from "./types";

// 2025/26 UK Tax Bands (England, Wales, NI)
const PERSONAL_ALLOWANCE = 12_570;
const BASIC_RATE_LIMIT = 50_270;
const HIGHER_RATE_LIMIT = 125_140;
const BASIC_RATE = 0.20;
const HIGHER_RATE = 0.40;
const ADDITIONAL_RATE = 0.45;

// Scotland has different income tax bands (2025/26)
const SCOTTISH_STARTER_LIMIT = 14_876;
const SCOTTISH_BASIC_LIMIT = 26_561;
const SCOTTISH_INTERMEDIATE_LIMIT = 43_662;
const SCOTTISH_HIGHER_LIMIT = 75_000;
const SCOTTISH_ADVANCED_LIMIT = 125_140;
const SCOTTISH_STARTER_RATE = 0.19;
const SCOTTISH_BASIC_RATE = 0.20;
const SCOTTISH_INTERMEDIATE_RATE = 0.21;
const SCOTTISH_HIGHER_RATE = 0.42;
const SCOTTISH_ADVANCED_RATE = 0.45;
const SCOTTISH_TOP_RATE = 0.48;

// National Insurance 2025/26
const NI_PRIMARY_THRESHOLD = 12_570;
const NI_UPPER_EARNINGS_LIMIT = 50_270;
const NI_MAIN_RATE = 0.08;
const NI_HIGHER_RATE_NI = 0.02;

export function calculateTax(
  grossSalary: number,
  country: string
): TaxBreakdown {
  let incomeTax = 0;

  // Personal allowance tapers above £100k
  let personalAllowance = PERSONAL_ALLOWANCE;
  if (grossSalary > 100_000) {
    personalAllowance = Math.max(
      0,
      PERSONAL_ALLOWANCE - (grossSalary - 100_000) / 2
    );
  }

  const taxableIncome = Math.max(0, grossSalary - personalAllowance);

  if (country === "Scotland") {
    // Scottish tax bands
    incomeTax = calculateScottishTax(taxableIncome);
  } else {
    // rUK tax bands
    if (taxableIncome <= BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE) {
      incomeTax = taxableIncome * BASIC_RATE;
    } else if (taxableIncome <= HIGHER_RATE_LIMIT - personalAllowance) {
      incomeTax =
        (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE) * BASIC_RATE +
        (taxableIncome - (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE)) * HIGHER_RATE;
    } else {
      incomeTax =
        (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE) * BASIC_RATE +
        (HIGHER_RATE_LIMIT - personalAllowance - (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE)) * HIGHER_RATE +
        (taxableIncome - (HIGHER_RATE_LIMIT - personalAllowance)) * ADDITIONAL_RATE;
    }
  }

  // National Insurance (same across UK)
  let nationalInsurance = 0;
  if (grossSalary > NI_PRIMARY_THRESHOLD) {
    if (grossSalary <= NI_UPPER_EARNINGS_LIMIT) {
      nationalInsurance = (grossSalary - NI_PRIMARY_THRESHOLD) * NI_MAIN_RATE;
    } else {
      nationalInsurance =
        (NI_UPPER_EARNINGS_LIMIT - NI_PRIMARY_THRESHOLD) * NI_MAIN_RATE +
        (grossSalary - NI_UPPER_EARNINGS_LIMIT) * NI_HIGHER_RATE_NI;
    }
  }

  const takeHome = grossSalary - incomeTax - nationalInsurance;

  return {
    gross: grossSalary,
    incomeTax: Math.round(incomeTax),
    nationalInsurance: Math.round(nationalInsurance),
    takeHome: Math.round(takeHome),
    monthlyTakeHome: Math.round(takeHome / 12),
  };
}

function calculateScottishTax(taxableIncome: number): number {
  const bands = [
    { limit: SCOTTISH_STARTER_LIMIT - PERSONAL_ALLOWANCE, rate: SCOTTISH_STARTER_RATE },
    { limit: SCOTTISH_BASIC_LIMIT - PERSONAL_ALLOWANCE, rate: SCOTTISH_BASIC_RATE },
    { limit: SCOTTISH_INTERMEDIATE_LIMIT - PERSONAL_ALLOWANCE, rate: SCOTTISH_INTERMEDIATE_RATE },
    { limit: SCOTTISH_HIGHER_LIMIT - PERSONAL_ALLOWANCE, rate: SCOTTISH_HIGHER_RATE },
    { limit: SCOTTISH_ADVANCED_LIMIT - PERSONAL_ALLOWANCE, rate: SCOTTISH_ADVANCED_RATE },
    { limit: Infinity, rate: SCOTTISH_TOP_RATE },
  ];

  let tax = 0;
  let remaining = taxableIncome;

  let prevLimit = 0;
  for (const band of bands) {
    const bandWidth = band.limit - prevLimit;
    if (remaining <= 0) break;
    const taxableInBand = Math.min(remaining, bandWidth);
    tax += taxableInBand * band.rate;
    remaining -= taxableInBand;
    prevLimit = band.limit;
  }

  return tax;
}

export function compareLocations(
  from: Location,
  to: Location
): ComparisonResult {
  const taxFrom = calculateTax(from.medianSalary, from.country);
  const taxTo = calculateTax(to.medianSalary, to.country);

  const salaryDiff = to.medianSalary - from.medianSalary;
  const takeHomeDiff = taxTo.takeHome - taxFrom.takeHome;

  // Annual costs comparison (positive = saving money in target)
  const rentDiff = (from.rentTwoBed - to.rentTwoBed) * 12;
  const councilTaxDiff = from.councilTaxBandD - to.councilTaxBandD;
  const commuteDiff = (from.commuteMonthly - to.commuteMonthly) * 12;
  const childcareDiff = (from.childcareMonthly - to.childcareMonthly) * 12;
  const groceryDiff = (from.groceryBasketWeekly - to.groceryBasketWeekly) * 52;
  const energyDiff = (from.energyMonthly - to.energyMonthly) * 12;

  // Lifestyle costs (pint + cinema + gym monthly estimate)
  const lifestyleFrom =
    from.pintOfBeer * 8 + from.cinemaTicket * 2 + from.gymMembership;
  const lifestyleTo =
    to.pintOfBeer * 8 + to.cinemaTicket * 2 + to.gymMembership;
  const lifestyleDiff = (lifestyleFrom - lifestyleTo) * 12;

  // Total annual difference (positive = better off moving)
  const totalAnnualDiff =
    takeHomeDiff +
    rentDiff +
    councilTaxDiff +
    commuteDiff +
    groceryDiff +
    energyDiff +
    lifestyleDiff;

  // Monthly disposable (take-home minus essentials)
  const monthlyEssentialsFrom =
    from.rentTwoBed +
    from.councilTaxBandD / 12 +
    from.commuteMonthly +
    from.groceryBasketWeekly * 4.33 +
    from.energyMonthly +
    from.broadbandMonthly;

  const monthlyEssentialsTo =
    to.rentTwoBed +
    to.councilTaxBandD / 12 +
    to.commuteMonthly +
    to.groceryBasketWeekly * 4.33 +
    to.energyMonthly +
    to.broadbandMonthly;

  const monthlyDisposableFrom = taxFrom.monthlyTakeHome - monthlyEssentialsFrom;
  const monthlyDisposableTo = taxTo.monthlyTakeHome - monthlyEssentialsTo;

  // Verdict
  let verdict: Verdict;
  if (totalAnnualDiff > 500) {
    verdict = "greener";
  } else if (totalAnnualDiff < -500) {
    verdict = "not-greener";
  } else {
    verdict = "about-the-same";
  }

  return {
    from,
    to,
    salaryDiff,
    takeHomeDiff,
    rentDiff,
    councilTaxDiff,
    commuteDiff,
    childcareDiff,
    groceryDiff,
    energyDiff,
    lifestyleDiff,
    totalAnnualDiff: Math.round(totalAnnualDiff),
    monthlyDisposableFrom: Math.round(monthlyDisposableFrom),
    monthlyDisposableTo: Math.round(monthlyDisposableTo),
    verdict,
  };
}

export function formatCurrency(amount: number, showSign = false): string {
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(abs);

  if (showSign && amount !== 0) {
    return amount > 0 ? `+${formatted}` : `-${formatted}`;
  }
  return amount < 0 ? `-${formatted}` : formatted;
}

export function formatCurrencyShort(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) {
    return `£${(amount / 1_000_000).toFixed(1)}m`;
  }
  if (abs >= 1_000) {
    return `£${(amount / 1_000).toFixed(0)}k`;
  }
  return `£${amount}`;
}
