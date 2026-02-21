"use client";

import { useState, useMemo } from "react";
import { Location, PersonalisationOptions, DEFAULT_OPTIONS } from "@/lib/types";
import { compareLocations } from "@/lib/calculations";
import PersonalisationPanel from "@/components/PersonalisationPanel";
import ComparisonResults from "@/components/ComparisonResults";

interface InteractiveComparisonProps {
  from: Location;
  to: Location;
}

export default function InteractiveComparison({
  from,
  to,
}: InteractiveComparisonProps) {
  const [options, setOptions] = useState<PersonalisationOptions>(DEFAULT_OPTIONS);

  // Recalculate whenever options change - this is the magic
  const result = useMemo(
    () => compareLocations(from, to, options),
    [from, to, options]
  );

  return (
    <>
      <PersonalisationPanel
        options={options}
        onChange={setOptions}
        fromMedianSalary={from.medianSalary}
        toMedianSalary={to.medianSalary}
      />
      <ComparisonResults result={result} />
    </>
  );
}
