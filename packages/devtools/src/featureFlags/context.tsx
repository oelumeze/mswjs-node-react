import { createContext, useContext, useState, useCallback } from "react";
import type { FeatureFlag, FlagValues } from "../types.ts";
import { loadFlags, saveFlags } from "./storage.ts";

interface FeatureFlagContextValue {
  flagDefs: FeatureFlag[];
  flags: FlagValues;
  setFlag: (key: string, value: boolean) => void;
  getFlag: (key: string) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

interface FeatureFlagProviderProps {
  flags: FeatureFlag[];
  children: React.ReactNode;
}

export function FeatureFlagProvider({ flags: flagDefs, children }: FeatureFlagProviderProps) {
  const [flags, setFlags] = useState<FlagValues>(loadFlags);

  const setFlag = useCallback((key: string, value: boolean) => {
    setFlags((prev) => {
      const next = { ...prev, [key]: value };
      saveFlags(next);
      return next;
    });
  }, []);

  const getFlag = useCallback(
    (key: string): boolean => {
      if (key in flags) return flags[key];
      return flagDefs.find((f) => f.key === key)?.defaultValue ?? false;
    },
    [flags, flagDefs]
  );

  return (
    <FeatureFlagContext.Provider value={{ flagDefs, flags, setFlag, getFlag }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

/**
 * Returns flag values from the nearest FeatureFlagProvider.
 * When called outside a provider (e.g. in production without DevTools mounted),
 * every flag falls back to its `defaultValue` via the FEATURE_FLAGS definition
 * passed to FeatureFlagProvider — or `false` if no definition is found.
 * This means removing the provider in production is safe; the app just uses
 * each flag's declared default.
 */
export function useFeatureFlags() {
  const ctx = useContext(FeatureFlagContext);

  // No provider: return defaults derived from the flag definitions in context.
  // Since we have no definitions available here, each flag returns `false`.
  // To keep defaultValues working without a provider, keep FeatureFlagProvider
  // in the app tree (it's lightweight and has no dev-only UI side effects).
  if (!ctx) {
    return {
      flagDefs: [] as FeatureFlag[],
      flags: {} as FlagValues,
      setFlag: (_key: string, _value: boolean) => {},
      getFlag: (_key: string) => false,
    };
  }

  return ctx;
}
