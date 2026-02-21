"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  PoundSterling,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Search,
  SlidersHorizontal,
  X,
  Compass,
  Home,
  Banknote,
} from "lucide-react";
import { Location, Region } from "@/lib/types";
import { locations } from "@/data/locations";
import { quickCompare, formatCurrency, formatCurrencyShort } from "@/lib/calculations";
import LocationSearch from "@/components/LocationSearch";
import CowMascot from "@/components/CowMascot";

type SortField = "annualDiff" | "rent" | "salary" | "housePrice";

const ALL_REGIONS: Region[] = [
  "London",
  "South East",
  "South West",
  "East of England",
  "East Midlands",
  "West Midlands",
  "North West",
  "North East",
  "Yorkshire and the Humber",
  "Scotland",
  "Wales",
  "Northern Ireland",
];

interface RankedLocation {
  location: Location;
  annualDiff: number;
  verdict: "greener" | "not-greener" | "about-the-same";
}

export default function ExploreClient() {
  const [homeLocation, setHomeLocation] = useState<Location | null>(null);
  const [customSalary, setCustomSalary] = useState<string>("");
  const [selectedRegions, setSelectedRegions] = useState<Set<Region>>(new Set());
  const [sortField, setSortField] = useState<SortField>("annualDiff");
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const salary = customSalary
    ? parseInt(customSalary.replace(/[^0-9]/g, ""), 10) || undefined
    : undefined;

  // Rank all locations against the home location
  const ranked = useMemo<RankedLocation[]>(() => {
    if (!homeLocation) return [];

    return locations
      .filter((loc) => loc.id !== homeLocation.id)
      .map((loc) => {
        const { annualDiff, verdict } = quickCompare(homeLocation, loc, salary);
        return { location: loc, annualDiff, verdict };
      });
  }, [homeLocation, salary]);

  // Apply filters and sorting
  const filtered = useMemo(() => {
    let results = [...ranked];

    // Region filter
    if (selectedRegions.size > 0) {
      results = results.filter((r) =>
        selectedRegions.has(r.location.region)
      );
    }

    // Text search filter
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      results = results.filter(
        (r) =>
          r.location.name.toLowerCase().includes(q) ||
          r.location.region.toLowerCase().includes(q) ||
          (r.location.county && r.location.county.toLowerCase().includes(q))
      );
    }

    // Sort
    results.sort((a, b) => {
      switch (sortField) {
        case "annualDiff":
          return b.annualDiff - a.annualDiff; // best first
        case "rent":
          return a.location.rentTwoBed - b.location.rentTwoBed; // cheapest first
        case "salary":
          return b.location.medianSalary - a.location.medianSalary; // highest first
        case "housePrice":
          return a.location.avgHousePrice - b.location.avgHousePrice; // cheapest first
      }
    });

    return results;
  }, [ranked, selectedRegions, sortField, searchFilter]);

  const toggleRegion = (region: Region) => {
    const next = new Set(selectedRegions);
    if (next.has(region)) {
      next.delete(region);
    } else {
      next.add(region);
    }
    setSelectedRegions(next);
  };

  const greenerCount = filtered.filter((r) => r.verdict === "greener").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <CowMascot size="md" className="mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-charcoal mb-2">
          Where&apos;s{" "}
          <span className="gradient-text">your</span> greener pasture?
        </h1>
        <p className="text-charcoal-muted max-w-xl mx-auto">
          Pick where you live now, and we&apos;ll rank every other location by how
          much better (or worse) off you&apos;d be. Instant clarity.
        </p>
      </div>

      {/* Selection panel */}
      <div className="bg-white rounded-2xl border border-grass-100 shadow-lg shadow-grass/5 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <LocationSearch
            label="I currently live in"
            placeholder="Type your city or town..."
            value={homeLocation}
            onChange={setHomeLocation}
            accentColor="green"
          />
          <div className="flex-1">
            <label className="block text-sm font-medium text-charcoal-muted mb-2">
              My salary (optional)
            </label>
            <div className="relative">
              <PoundSterling className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
              <input
                type="text"
                inputMode="numeric"
                value={
                  customSalary
                    ? Number(
                        customSalary.replace(/[^0-9]/g, "")
                      ).toLocaleString("en-GB")
                    : ""
                }
                onChange={(e) =>
                  setCustomSalary(e.target.value.replace(/,/g, ""))
                }
                placeholder="Leave blank for area medians"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-grass/20 focus:border-grass bg-white search-input text-charcoal placeholder:text-charcoal-muted/40 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {homeLocation ? (
        <>
          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <p className="text-sm text-charcoal-muted">
              <span className="font-semibold text-charcoal">
                {filtered.length}
              </span>{" "}
              locations compared against {homeLocation.name}
              {greenerCount > 0 && (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-better font-medium">
                    {greenerCount} greener
                  </span>
                </>
              )}
            </p>

            <div className="ml-auto flex items-center gap-2">
              {/* Search within results */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter..."
                  className="pl-9 pr-3 py-2 rounded-lg border border-grass-100 text-sm w-40 focus:w-56 transition-all search-input"
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-3 h-3 text-charcoal-muted" />
                  </button>
                )}
              </div>

              {/* Filters toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-all ${
                  showFilters || selectedRegions.size > 0
                    ? "border-grass bg-grass-50 text-grass-dark"
                    : "border-grass-100 text-charcoal-muted hover:border-grass-200"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {selectedRegions.size > 0 && (
                  <span className="bg-grass text-white text-xs px-1.5 rounded-full">
                    {selectedRegions.size}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Region filters */}
          {showFilters && (
            <div className="bg-white rounded-xl border border-grass-100 p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-charcoal">
                  Filter by region
                </p>
                {selectedRegions.size > 0 && (
                  <button
                    onClick={() => setSelectedRegions(new Set())}
                    className="text-xs text-grass hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_REGIONS.map((region) => (
                  <button
                    key={region}
                    onClick={() => toggleRegion(region)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedRegions.has(region)
                        ? "bg-grass text-white"
                        : "bg-grass-50 text-charcoal-muted hover:bg-grass-100"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort tabs */}
          <div className="flex gap-1 mb-4 bg-grass-50/50 p-1 rounded-xl w-fit">
            {([
              { field: "annualDiff" as SortField, label: "Best value", icon: TrendingUp },
              { field: "rent" as SortField, label: "Cheapest rent", icon: Home },
              { field: "salary" as SortField, label: "Highest salary", icon: Banknote },
              { field: "housePrice" as SortField, label: "Cheapest to buy", icon: Home },
            ]).map(({ field, label, icon: Icon }) => (
              <button
                key={field}
                onClick={() => setSortField(field)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  sortField === field
                    ? "bg-white text-grass-dark shadow-sm"
                    : "text-charcoal-muted hover:text-charcoal"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Results table */}
          <div className="space-y-2">
            {filtered.map((item, i) => (
              <Link
                key={item.location.id}
                href={`/compare/${homeLocation.id}-vs-${item.location.id}`}
                className="group flex items-center gap-4 bg-white rounded-xl border border-grass-100 p-4 hover:border-grass-200 hover:shadow-md hover:shadow-grass/5 transition-all"
              >
                {/* Rank */}
                <div className="w-8 text-center shrink-0">
                  <span
                    className={`text-sm font-bold ${
                      i < 3 ? "text-grass" : "text-charcoal-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Location info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-charcoal truncate">
                      {item.location.name}
                    </p>
                    <span className="text-xs text-charcoal-muted bg-grass-50 px-2 py-0.5 rounded-full shrink-0">
                      {item.location.region}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-charcoal-muted">
                    <span>
                      Rent: {formatCurrency(item.location.rentTwoBed)}/mo
                    </span>
                    <span>
                      Salary: {formatCurrencyShort(item.location.medianSalary)}
                    </span>
                    <span className="hidden sm:inline">
                      House: {formatCurrencyShort(item.location.avgHousePrice)}
                    </span>
                  </div>
                </div>

                {/* Annual diff */}
                <div className="text-right shrink-0">
                  <div
                    className={`flex items-center gap-1 text-sm font-bold ${
                      item.verdict === "greener"
                        ? "text-better"
                        : item.verdict === "not-greener"
                        ? "text-worse"
                        : "text-charcoal-muted"
                    }`}
                  >
                    {item.verdict === "greener" ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : item.verdict === "not-greener" ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                    {formatCurrency(Math.abs(item.annualDiff))}/yr
                  </div>
                  <p className="text-xs text-charcoal-muted">
                    {item.verdict === "greener"
                      ? "better off"
                      : item.verdict === "not-greener"
                      ? "worse off"
                      : "about the same"}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-4 h-4 text-charcoal-muted group-hover:text-grass group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-charcoal-muted">
                No locations match your filters. Try broadening your search.
              </p>
            </div>
          )}
        </>
      ) : (
        /* Empty state */
        <div className="text-center py-16">
          <Compass className="w-12 h-12 text-grass-200 mx-auto mb-4" />
          <p className="text-charcoal-muted text-lg">
            Pick where you live to see the rankings
          </p>
          <p className="text-charcoal-muted/60 text-sm mt-1">
            We&apos;ll compare it against every other location in the UK
          </p>
        </div>
      )}
    </div>
  );
}
