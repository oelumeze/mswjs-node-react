import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { RequestHandler } from "msw";
import { createMSWWorker } from "../msw/worker.ts";
import { ScenarioProvider } from "../msw/context.tsx";
import { FeatureFlagProvider } from "../featureFlags/context.tsx";
import { DevToolsConfigProvider, type DevToolsInternalConfig } from "./config-context.tsx";
import type { Scenario, ScenarioGroup, FeatureFlag } from "../types.ts";

export interface SetupDevToolsOptions {
  /** Factory that returns MSW handlers for the given scenario key. */
  createHandlers: (scenario: string) => RequestHandler[];
  /** All available scenario definitions, keyed by scenario key. */
  scenarios: Record<string, Scenario>;
  /** Grouped presentation of scenarios shown in the MSW tab. */
  scenarioGroups: ScenarioGroup[];
  /**
   * Called after a scenario switch — use this to reset any in-memory state
   * your handlers maintain (e.g. live data arrays).
   */
  onScenarioChange?: (scenario: string) => void;
  /** Feature flag definitions shown in the Feature Flags tab. Defaults to []. */
  featureFlags?: FeatureFlag[];
  /**
   * Bring your own QueryClient. When omitted, a default client is created
   * with `retry: false` and `staleTime: 0`.
   */
  queryClient?: QueryClient;
  /** Override the localStorage key used to persist the active scenario. */
  storageKey?: string;
}

/**
 * One-time setup call. Returns the MSW worker (start it in main.tsx) and a
 * `DevToolsProvider` that wires up React Query, MSW scenario management, and
 * feature flags — no further configuration needed anywhere else.
 *
 * @example
 * // src/devtools.ts
 * export const { worker, DevToolsProvider } = setupDevTools({
 *   createHandlers,
 *   scenarios: SCENARIOS,
 *   scenarioGroups: SCENARIO_GROUPS,
 *   onScenarioChange: resetData,
 *   featureFlags: FLAGS,
 * });
 *
 * // src/main.tsx
 * worker.start({ onUnhandledRequest: 'bypass' }).then(() =>
 *   createRoot(...).render(<DevToolsProvider><App /></DevToolsProvider>)
 * );
 *
 * // Anywhere in the app
 * {import.meta.env.DEV && <DevToolsPanel />}   // zero props
 */
export function setupDevTools(options: SetupDevToolsOptions) {
  const {
    createHandlers,
    scenarios,
    scenarioGroups,
    onScenarioChange,
    featureFlags = [],
    storageKey,
  } = options;

  // Created once per setupDevTools() call — stable across re-renders.
  const queryClient =
    options.queryClient ??
    new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: 0 } },
    });

  const worker = createMSWWorker(createHandlers, { storageKey });

  const config: DevToolsInternalConfig = { scenarios, scenarioGroups, featureFlags };

  function DevToolsProvider({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ScenarioProvider
          worker={worker}
          createHandlers={createHandlers}
          onScenarioChange={onScenarioChange}
          storageKey={storageKey}
        >
          <FeatureFlagProvider flags={featureFlags}>
            <DevToolsConfigProvider config={config}>
              {children}
            </DevToolsConfigProvider>
          </FeatureFlagProvider>
        </ScenarioProvider>
      </QueryClientProvider>
    );
  }

  return { worker, DevToolsProvider };
}
