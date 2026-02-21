export interface Location {
  id: string;
  name: string;
  county?: string;
  region: Region;
  country: Country;
  lat: number;
  lng: number;
  population: number;
  medianSalary: number;
  rentOneBed: number;
  rentTwoBed: number;
  rentThreeBed: number;
  avgHousePrice: number;
  councilTaxBandD: number;
  commuteMonthly: number; // average monthly commute cost
  pintOfBeer: number;
  cinemaTicket: number;
  gymMembership: number;
  childcareMonthly: number; // full-time nursery per month
  groceryBasketWeekly: number; // typical weekly shop
  broadbandMonthly: number;
  energyMonthly: number; // average gas + electric

  // School quality (Ofsted / Education Scotland / Estyn / ETI)
  schoolsOutstandingPct: number; // % of schools rated Outstanding (or equivalent)
  schoolsGoodPct: number; // % of schools rated Good (or equivalent)
  schoolsTotal: number; // total number of schools in area
  ofstedRating: "excellent" | "good" | "average" | "below-average"; // overall area summary

  // Crime (Police.uk / PSNI / Police Scotland)
  crimeRatePer1000: number; // total crimes per 1,000 residents per year
  violentCrimePer1000: number; // violent/sexual offences per 1,000
  burglaryPer1000: number; // burglary per 1,000
  crimeLevel: "very-low" | "low" | "average" | "high" | "very-high"; // area summary
}

export type Region =
  | "London"
  | "South East"
  | "South West"
  | "East of England"
  | "East Midlands"
  | "West Midlands"
  | "North West"
  | "North East"
  | "Yorkshire and the Humber"
  | "Scotland"
  | "Wales"
  | "Northern Ireland";

export type Country = "England" | "Scotland" | "Wales" | "Northern Ireland";

export type BedSize = "one" | "two" | "three";

export type CommuteType = "drive" | "public-transport" | "wfh";

export type LifestyleIntensity = "homebody" | "average" | "social-butterfly";

export interface PersonalisationOptions {
  customSalary?: number; // if set, overrides median for both locations
  bedSize: BedSize;
  includeChildcare: boolean;
  commuteType: CommuteType;
  lifestyleMultiplier: number; // 0.5 = homebody, 1 = average, 1.5 = social butterfly
}

export const DEFAULT_OPTIONS: PersonalisationOptions = {
  bedSize: "two",
  includeChildcare: false,
  commuteType: "public-transport",
  lifestyleMultiplier: 1,
};

export interface ComparisonResult {
  from: Location;
  to: Location;
  salaryFrom: number; // actual salary used (custom or median)
  salaryTo: number;
  takeHomeFrom: TaxBreakdown;
  takeHomeTo: TaxBreakdown;
  salaryDiff: number;
  takeHomeDiff: number;
  rentDiff: number;
  councilTaxDiff: number;
  commuteDiff: number;
  childcareDiff: number;
  groceryDiff: number;
  energyDiff: number;
  lifestyleDiff: number; // pint + cinema + gym combined monthly
  totalAnnualDiff: number; // the headline number
  monthlyDisposableFrom: number;
  monthlyDisposableTo: number;
  verdict: Verdict;
  isPersonalised: boolean;
  bedSize: BedSize;
  includesChildcare: boolean;
  fiveYearDiff: number; // compounding difference over 5 years
  commuteType: CommuteType;
  lifestyleMultiplier: number;
  // Monthly spending breakdown for stacked bars
  spendingFrom: SpendingBreakdown;
  spendingTo: SpendingBreakdown;
}

export interface SpendingBreakdown {
  rent: number;
  councilTax: number;
  commute: number;
  groceries: number;
  energy: number;
  childcare: number;
  lifestyle: number;
  disposable: number;
}

export type Verdict = "greener" | "not-greener" | "about-the-same";

export interface TaxBreakdown {
  gross: number;
  incomeTax: number;
  nationalInsurance: number;
  studentLoan: number;
  takeHome: number;
  monthlyTakeHome: number;
  effectiveRate: number; // percentage of gross taken in tax+NI
}
