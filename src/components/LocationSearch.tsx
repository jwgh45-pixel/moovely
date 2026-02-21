"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, X } from "lucide-react";
import { Location } from "@/lib/types";
import { searchLocations } from "@/data/locations";

interface LocationSearchProps {
  label: string;
  placeholder: string;
  value: Location | null;
  onChange: (location: Location | null) => void;
  accentColor?: "green" | "amber" | "lime";
}

export default function LocationSearch({
  label,
  placeholder,
  value,
  onChange,
  accentColor = "green",
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 1) {
      const matches = searchLocations(query);
      setResults(matches);
      setIsOpen(matches.length > 0);
      setHighlightIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (location: Location) => {
    onChange(location);
    setQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const isLime = accentColor === "amber" || accentColor === "lime";
  const borderColor = isLime ? "border-lime/30" : "border-brand/30";
  const focusBorder = isLime ? "focus:border-lime" : "focus:border-brand";
  const tagBg = isLime
    ? "bg-lime/10 text-lime-dark"
    : "bg-brand-100 text-brand-dark";

  return (
    <div className="relative flex-1">
      <label className="block text-sm font-medium text-ink-muted mb-2">
        {label}
      </label>
      {value ? (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 ${borderColor} bg-surface`}
        >
          <MapPin className="w-5 h-5 text-brand" />
          <div className="flex-1">
            <span className="font-semibold text-ink">{value.name}</span>
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${tagBg}`}>
              {value.region}
            </span>
          </div>
          <button
            onClick={() => onChange(null)}
            className="p-1 hover:bg-brand-50 rounded-full transition-colors"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4 text-ink-muted" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 1 && setIsOpen(results.length > 0)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${borderColor} ${focusBorder} bg-surface search-input text-ink placeholder:text-ink-muted/50 transition-all`}
          />
          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl border border-brand-100 shadow-lg shadow-brand/5 overflow-hidden z-50"
            >
              {results.map((location, i) => (
                <button
                  key={location.id}
                  onClick={() => handleSelect(location)}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-brand-50 transition-colors ${
                    i === highlightIndex ? "bg-brand-50" : ""
                  } ${i !== results.length - 1 ? "border-b border-brand-50" : ""}`}
                >
                  <MapPin className="w-4 h-4 text-brand shrink-0" />
                  <div>
                    <span className="font-medium text-ink">
                      {location.name}
                    </span>
                    <span className="text-xs text-ink-muted ml-2">
                      {location.region}
                      {location.county ? `, ${location.county}` : ""}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
