"use client";

import { useState, useMemo, useEffect } from "react";
import { Location, PersonalisationOptions, DEFAULT_OPTIONS } from "@/lib/types";
import { compareLocations } from "@/lib/calculations";
import { loadPersona, type PersonaId } from "@/lib/presets";
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
  const [initialPersona, setInitialPersona] = useState<PersonaId | null>(null);

  // On mount, check localStorage for a saved persona and apply it
  useEffect(() => {
    const saved = loadPersona();
    if (saved) {
      setInitialPersona(saved.id);
      setOptions((prev) => ({
        ...saved.options,
        customSalary: prev.customSalary,
      }));
    }
  }, []);

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
        initialPersona={initialPersona}
      />
      <ComparisonResults result={result} options={options} />
    </>
  );
}
