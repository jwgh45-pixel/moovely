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

export interface ComparisonResult {
  from: Location;
  to: Location;
  salaryDiff: number;
  takeHomeDiff: number;
  rentDiff: number; // using 2-bed as default
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
}

export type Verdict = "greener" | "not-greener" | "about-the-same";

export interface TaxBreakdown {
  gross: number;
  incomeTax: number;
  nationalInsurance: number;
  takeHome: number;
  monthlyTakeHome: number;
}
