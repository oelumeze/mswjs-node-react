import { createContext, useContext, useState, useCallback } from "react";
import type { RequestHandler } from "msw";
import type { MSWWorker } from "./worker.ts";
import { loadScenario, saveScenario } from "./storage.ts";

interface ScenarioContextValue {
  scenario: string;
  setScenario: (key: string) => void;
}

const ScenarioContext = createContext<ScenarioContextValue | null>(null);

export interface ScenarioProviderProps {
  /** The MSW worker instance (from createMSWWorker or setupWorker). */
  worker: MSWWorker;
  /** Returns the MSW handlers for a given scenario key. */
  createHandlers: (scenario: string) => RequestHandler[];
  /**
   * Called after the scenario changes — use this to reset any in-memory
   * data your handlers maintain (e.g. live todo/animal arrays).
   */
  onScenarioChange?: (scenario: string) => void;
  /**
   * Override the starting scenario. Defaults to the value persisted in
   * localStorage (same key used by createMSWWorker).
   */
  initialScenario?: string;
  /** Override the localStorage key used to persist the active scenario. */
  storageKey?: string;
  children: React.ReactNode;
}

export function ScenarioProvider({
  worker,
  createHandlers,
  onScenarioChange,
  initialScenario,
  storageKey,
  children,
}: ScenarioProviderProps) {
  const [scenario, setScenarioState] = useState<string>(
    () => initialScenario ?? loadScenario(storageKey),
  );

  const setScenario = useCallback(
    (key: string) => {
      saveScenario(key, storageKey);
      onScenarioChange?.(key);
      worker.use(...createHandlers(key));
      setScenarioState(key);
    },
    [worker, createHandlers, onScenarioChange, storageKey],
  );

  return (
    <ScenarioContext.Provider value={{ scenario, setScenario }}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const ctx = useContext(ScenarioContext);
  if (!ctx) throw new Error("useScenario must be used inside ScenarioProvider");
  return ctx;
}
