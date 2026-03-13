import { createContext, useContext, useState, useCallback } from "react";
import { FEATURE_FLAGS, type FlagValues, loadFlags, saveFlags } from "./flags";

interface FeatureFlagContextValue {
  flags: FlagValues;
  setFlag: (key: string, value: boolean) => void;
  getFlag: (key: string) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
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
      return FEATURE_FLAGS.find((f) => f.key === key)?.defaultValue ?? false;
    },
    [flags]
  );

  return (
    <FeatureFlagContext.Provider value={{ flags, setFlag, getFlag }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  const ctx = useContext(FeatureFlagContext);
  if (!ctx) throw new Error("useFeatureFlags must be used inside FeatureFlagProvider");
  return ctx;
}
