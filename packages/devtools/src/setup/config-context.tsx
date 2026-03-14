import { createContext, useContext } from "react";
import type { Scenario, ScenarioGroup, FeatureFlag } from "../types.ts";

export interface DevToolsInternalConfig {
  scenarios: Record<string, Scenario>;
  scenarioGroups: ScenarioGroup[];
  featureFlags: FeatureFlag[];
}

const DevToolsConfigContext = createContext<DevToolsInternalConfig>({
  scenarios: {},
  scenarioGroups: [],
  featureFlags: [],
});

export function DevToolsConfigProvider({
  config,
  children,
}: {
  config: DevToolsInternalConfig;
  children: React.ReactNode;
}) {
  return (
    <DevToolsConfigContext.Provider value={config}>
      {children}
    </DevToolsConfigContext.Provider>
  );
}

export function useDevToolsConfig(): DevToolsInternalConfig {
  return useContext(DevToolsConfigContext);
}
