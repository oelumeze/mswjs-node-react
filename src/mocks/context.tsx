import { createContext, useContext, useState, useCallback } from "react";
import { worker } from "./browser";
import { createHandlers, resetLiveTodos } from "./handlers/index";
import { loadScenario, saveScenario } from "./scenarios";

interface ScenarioContextValue {
  scenario: string;
  setScenario: (key: string) => void;
}

const ScenarioContext = createContext<ScenarioContextValue | null>(null);

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
  const [scenario, setScenarioState] = useState<string>(loadScenario);

  const setScenario = useCallback((key: string) => {
    saveScenario(key);
    resetLiveTodos();
    worker.use(...createHandlers(key));
    setScenarioState(key);
  }, []);

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
