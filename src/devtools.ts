import { setupDevTools } from "react-mock-devtools";
import { createHandlers, resetLiveTodos } from "./mocks/handlers/index";
import { SCENARIOS, SCENARIO_GROUPS } from "./mocks/scenarios";
import { FEATURE_FLAGS } from "./featureFlags/flags";

export const { worker, DevToolsProvider } = setupDevTools({
  createHandlers,
  scenarios: SCENARIOS,
  scenarioGroups: SCENARIO_GROUPS,
  onScenarioChange: resetLiveTodos,
  featureFlags: FEATURE_FLAGS,
});
