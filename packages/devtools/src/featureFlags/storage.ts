import type { FlagValues } from "../types.ts";

const STORAGE_KEY = "react-mock-devtools:feature-flags";

export function loadFlags(): FlagValues {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as FlagValues) : {};
  } catch {
    return {};
  }
}

export function saveFlags(flags: FlagValues) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
}
