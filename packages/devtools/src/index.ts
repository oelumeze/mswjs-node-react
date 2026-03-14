// ── Primary API ───────────────────────────────────────────────────────────────
// Most consuming apps only need these two exports.
export { setupDevTools } from "./setup/index.tsx";
export type { SetupDevToolsOptions } from "./setup/index.tsx";

export { DevToolsPanel } from "./components/DevToolsPanel.tsx";

// ── Hooks (for components that need to read devtools state) ───────────────────
export { useScenario } from "./msw/context.tsx";
export { useFeatureFlags } from "./featureFlags/context.tsx";

// ── Advanced / escape-hatch exports ──────────────────────────────────────────
// Use these only when you need fine-grained control instead of setupDevTools().
export { createMSWWorker } from "./msw/worker.ts";
export type { MSWWorker, CreateMSWWorkerOptions } from "./msw/worker.ts";

export { ScenarioProvider } from "./msw/context.tsx";
export type { ScenarioProviderProps } from "./msw/context.tsx";

export { FeatureFlagProvider } from "./featureFlags/context.tsx";

export { loadScenario, saveScenario } from "./msw/storage.ts";

// ── Shared types ──────────────────────────────────────────────────────────────
export type { Scenario, ScenarioGroup, FeatureFlag, FlagValues } from "./types.ts";
