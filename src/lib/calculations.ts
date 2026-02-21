import {
  Location,
  TaxBreakdown,
  ComparisonResult,
  Verdict,
  PersonalisationOptions,
  BedSize,
  DEFAULT_OPTIONS,
} from "./types";

// 2025/26 UK Tax Bands (England, Wales, NI)
const PERSONAL_ALLOWANCE = 12_570;
const BASIC_RATE_LIMIT = 50_270;
const HIGHER_RATE_LIMIT = 125_140;
const BASIC_RATE = 0.2;
const HIGHER_RATE = 0.4;
const ADDITIONAL_RATE = 0.45;

// Scotland has different income tax bands (2025/26)
const SCOTTISH_STARTER_LIMIT = 14_876;
const SCOTTISH_BASIC_LIMIT = 26_561;
const SCOTTISH_INTERMEDIATE_LIMIT = 43_662;
const SCOTTISH_HIGHER_LIMIT = 75_000;
const SCOTTISH_ADVANCED_LIMIT = 125_140;
const SCOTTISH_STARTER_RATE = 0.19;
const SCOTTISH_BASIC_RATE = 0.2;
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
    incomeTax = calculateScottishTax(taxableIncome);
  } else {
    if (taxableIncome <= BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE) {
      incomeTax = taxableIncome * BASIC_RATE;
    } else if (taxableIncome <= HIGHER_RATE_LIMIT - personalAllowance) {
      incomeTax =
        (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE) * BASIC_RATE +
        (taxableIncome - (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE)) *
          HIGHER_RATE;
    } else {
      incomeTax =
        (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE) * BASIC_RATE +
        (HIGHER_RATE_LIMIT -
          personalAllowance -
          (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE)) *
          HIGHER_RATE +
        (taxableIncome - (HIGHER_RATE_LIMIT - personalAllowance)) *
          ADDITIONAL_RATE;
    }
  }

  // National Insurance (same across UK)
  let nationalInsurance = 0;
  if (grossSalary > NI_PRIMARY_THRESHOLD) {
    if (grossSalary <= NI_UPPER_EARNINGS_LIMIT) {
      nationalInsurance =
        (grossSalary - NI_PRIMARY_THRESHOLD) * NI_MAIN_RATE;
    } else {
      nationalInsurance =
        (NI_UPPER_EARNINGS_LIMIT - NI_PRIMARY_THRESHOLD) * NI_MAIN_RATE +
        (grossSalary - NI_UPPER_EARNINGS_LIMIT) * NI_HIGHER_RATE_NI;
    }
  }

  const takeHome = grossSalary - incomeTax - nationalInsurance;
  const effectiveRate =
    grossSalary > 0
      ? ((incomeTax + nationalInsurance) / grossSalary) * 100
      : 0;

  return {
    gross: grossSalary,
    incomeTax: Math.round(incomeTax),
    nationalInsurance: Math.round(nationalInsurance),
    studentLoan: 0,
    takeHome: Math.round(takeHome),
    monthlyTakeHome: Math.round(takeHome / 12),
    effectiveRate: Math.round(effectiveRate * 10) / 10,
  };
}

function calculateScottishTax(taxableIncome: number): number {
  const bands = [
    {
      limit: SCOTTISH_STARTER_LIMIT - PERSONAL_ALLOWANCE,
      rate: SCOTTISH_STARTER_RATE,
    },
    {
      limit: SCOTTISH_BASIC_LIMIT - PERSONAL_ALLOWANCE,
      rate: SCOTTISH_BASIC_RATE,
    },
    {
      limit: SCOTTISH_INTERMEDIATE_LIMIT - PERSONAL_ALLOWANCE,
      rate: SCOTTISH_INTERMEDIATE_RATE,
    },
    {
      limit: SCOTTISH_HIGHER_LIMIT - PERSONAL_ALLOWANCE,
      rate: SCOTTISH_HIGHER_RATE,
    },
    {
      limit: SCOTTISH_ADVANCED_LIMIT - PERSONAL_ALLOWANCE,
      rate: SCOTTISH_ADVANCED_RATE,
    },
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

function getRentForBedSize(location: Location, bedSize: BedSize): number {
  switch (bedSize) {
    case "one":
      return location.rentOneBed;
    case "two":
      return location.rentTwoBed;
    case "three":
      return location.rentThreeBed;
  }
}

export function compareLocations(
  from: Location,
  to: Location,
  options: PersonalisationOptions = DEFAULT_OPTIONS
): ComparisonResult {
  const isPersonalised = options.customSalary !== undefined;

  // If personalised, use the same salary in both places (your salary follows you)
  // The key insight: your earning power is roughly constant, but costs change
  const salaryFrom = options.customSalary ?? from.medianSalary;
  const salaryTo = options.customSalary ?? to.medianSalary;

  const taxFrom = calculateTax(salaryFrom, from.country);
  const taxTo = calculateTax(salaryTo, to.country);

  const salaryDiff = salaryTo - salaryFrom;
  const takeHomeDiff = taxTo.takeHome - taxFrom.takeHome;

  // Rent based on selected bed size
  const rentFrom = getRentForBedSize(from, options.bedSize);
  const rentTo = getRentForBedSize(to, options.bedSize);
  const rentDiff = (rentFrom - rentTo) * 12;

  const councilTaxDiff = from.councilTaxBandD - to.councilTaxBandD;

  // WFH zeroes out commute costs for both locations
  const commuteFrom = options.commuteType === "wfh" ? 0 : from.commuteMonthly;
  const commuteTo = options.commuteType === "wfh" ? 0 : to.commuteMonthly;
  const commuteDiff = (commuteFrom - commuteTo) * 12;

  // Childcare only included if toggled on
  const childcareFrom = options.includeChildcare ? from.childcareMonthly : 0;
  const childcareTo = options.includeChildcare ? to.childcareMonthly : 0;
  const childcareDiff = (childcareFrom - childcareTo) * 12;

  const groceryDiff =
    (from.groceryBasketWeekly - to.groceryBasketWeekly) * 52;
  const energyDiff = (from.energyMonthly - to.energyMonthly) * 12;

  // Lifestyle costs (pint + cinema + gym monthly estimate), scaled by intensity
  const lm = options.lifestyleMultiplier;
  const lifestyleFrom =
    (from.pintOfBeer * 8 + from.cinemaTicket * 2 + from.gymMembership) * lm;
  const lifestyleTo =
    (to.pintOfBeer * 8 + to.cinemaTicket * 2 + to.gymMembership) * lm;
  const lifestyleDiff = (lifestyleFrom - lifestyleTo) * 12;

  // Total annual difference (positive = better off moving)
  const totalAnnualDiff =
    takeHomeDiff +
    rentDiff +
    councilTaxDiff +
    commuteDiff +
    childcareDiff +
    groceryDiff +
    energyDiff +
    lifestyleDiff;

  // Monthly disposable (take-home minus essentials)
  const monthlyEssentialsFrom =
    rentFrom +
    from.councilTaxBandD / 12 +
    commuteFrom +
    from.groceryBasketWeekly * 4.33 +
    from.energyMonthly +
    from.broadbandMonthly +
    childcareFrom;

  const monthlyEssentialsTo =
    rentTo +
    to.councilTaxBandD / 12 +
    commuteTo +
    to.groceryBasketWeekly * 4.33 +
    to.energyMonthly +
    to.broadbandMonthly +
    childcareTo;

  const monthlyDisposableFrom =
    taxFrom.monthlyTakeHome - monthlyEssentialsFrom;
  const monthlyDisposableTo = taxTo.monthlyTakeHome - monthlyEssentialsTo;

  // 5-year compounding: annual savings invested at modest growth
  const annualDiffAbs = Math.abs(totalAnnualDiff);
  const fiveYearDiff = Math.round(
    Array.from({ length: 5 }).reduce<number>(
      (acc) => (acc + annualDiffAbs) * 1.04,
      0
    )
  );

  let verdict: Verdict;
  if (totalAnnualDiff > 500) {
    verdict = "greener";
  } else if (totalAnnualDiff < -500) {
    verdict = "not-greener";
  } else {
    verdict = "about-the-same";
  }

  // Monthly spending breakdown for stacked bars
  const spendingFrom = {
    rent: rentFrom,
    councilTax: Math.round(from.councilTaxBandD / 12),
    commute: commuteFrom,
    groceries: Math.round(from.groceryBasketWeekly * 4.33),
    energy: from.energyMonthly,
    childcare: childcareFrom,
    lifestyle: Math.round(lifestyleFrom),
    disposable: Math.round(monthlyDisposableFrom),
  };

  const spendingTo = {
    rent: rentTo,
    councilTax: Math.round(to.councilTaxBandD / 12),
    commute: commuteTo,
    groceries: Math.round(to.groceryBasketWeekly * 4.33),
    energy: to.energyMonthly,
    childcare: childcareTo,
    lifestyle: Math.round(lifestyleTo),
    disposable: Math.round(monthlyDisposableTo),
  };

  return {
    from,
    to,
    salaryFrom,
    salaryTo,
    takeHomeFrom: taxFrom,
    takeHomeTo: taxTo,
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
    isPersonalised,
    bedSize: options.bedSize,
    includesChildcare: options.includeChildcare,
    fiveYearDiff: totalAnnualDiff > 0 ? fiveYearDiff : -fiveYearDiff,
    commuteType: options.commuteType,
    lifestyleMultiplier: options.lifestyleMultiplier,
    spendingFrom,
    spendingTo,
  };
}

// Quick comparison for ranking tables (explore page)
export function quickCompare(
  from: Location,
  to: Location,
  customSalary?: number
): { annualDiff: number; verdict: Verdict } {
  const result = compareLocations(from, to, {
    customSalary,
    bedSize: "two",
    includeChildcare: false,
    commuteType: "public-transport",
    lifestyleMultiplier: 1,
  });
  return { annualDiff: result.totalAnnualDiff, verdict: result.verdict };
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
