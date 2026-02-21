import { PersonalisationOptions } from "./types";

export type PersonaId = "young-professional" | "growing-family" | "downsizer-wfh";

export interface Persona {
  id: PersonaId;
  label: string;
  emoji: string;
  description: string;
  options: PersonalisationOptions;
}

export const PERSONAS: Persona[] = [
  {
    id: "young-professional",
    label: "Young Professional",
    emoji: "💼",
    description: "1-bed, public transport, social life, no kids",
    options: {
      bedSize: "one",
      includeChildcare: false,
      commuteType: "public-transport",
      lifestyleMultiplier: 1.5,
    },
  },
  {
    id: "growing-family",
    label: "Growing Family",
    emoji: "👨‍👩‍👧",
    description: "3-bed, drives, nursery costs",
    options: {
      bedSize: "three",
      includeChildcare: true,
      commuteType: "drive",
      lifestyleMultiplier: 1,
    },
  },
  {
    id: "downsizer-wfh",
    label: "Downsizer / WFH",
    emoji: "🏡",
    description: "2-bed, works from home, homebody",
    options: {
      bedSize: "two",
      includeChildcare: false,
      commuteType: "wfh",
      lifestyleMultiplier: 0.5,
    },
  },
];

const STORAGE_KEY = "moovely-persona";

export function savePersona(personaId: PersonaId): void {
  try {
    localStorage.setItem(STORAGE_KEY, personaId);
  } catch {
    // localStorage unavailable (SSR, private browsing) - silently ignore
  }
}

export function loadPersona(): Persona | null {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    if (!id) return null;
    return PERSONAS.find((p) => p.id === id) ?? null;
  } catch {
    return null;
  }
}

export function clearPersona(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently ignore
  }
}
