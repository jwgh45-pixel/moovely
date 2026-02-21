"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, ArrowRight, Sparkles } from "lucide-react";
import { Location } from "@/lib/types";
import LocationSearch from "@/components/LocationSearch";

interface ComparisonSearchProps {
  currentFrom: Location;
  currentTo: Location;
}

export default function ComparisonSearch({
  currentFrom,
  currentTo,
}: ComparisonSearchProps) {
  const [fromLocation, setFromLocation] = useState<Location | null>(
    currentFrom
  );
  const [toLocation, setToLocation] = useState<Location | null>(currentTo);
  const router = useRouter();

  const handleCompare = () => {
    if (fromLocation && toLocation && fromLocation.id !== toLocation.id) {
      router.push(`/compare/${fromLocation.id}-vs-${toLocation.id}`);
    }
  };

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
    if (fromLocation && toLocation) {
      router.push(`/compare/${toLocation.id}-vs-${fromLocation.id}`);
    }
  };

  const hasChanged =
    fromLocation?.id !== currentFrom.id || toLocation?.id !== currentTo.id;

  return (
    <div className="bg-surface rounded-2xl border border-brand-100 p-4 mb-8">
      <div className="flex flex-col md:flex-row gap-3 items-end">
        <LocationSearch
          label="From"
          placeholder="Type a city..."
          value={fromLocation}
          onChange={setFromLocation}
          accentColor="green"
        />
        <button
          onClick={handleSwap}
          className="hidden md:flex w-10 h-10 shrink-0 items-center justify-center rounded-full border border-brand-200 hover:bg-brand-50 transition-colors mb-1"
          aria-label="Swap locations"
        >
          <ArrowLeftRight className="w-4 h-4 text-brand" />
        </button>
        <LocationSearch
          label="To"
          placeholder="Type a city..."
          value={toLocation}
          onChange={setToLocation}
          accentColor="amber"
        />
        {hasChanged && fromLocation && toLocation && (
          <button
            onClick={handleCompare}
            className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl hover:bg-brand-dark transition-colors font-medium shrink-0 mb-1"
          >
            <Sparkles className="w-4 h-4" />
            Compare
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
