import type { Scenario, ScenarioGroup } from "react-mock-devtools";

// TodoItem is app-specific — not part of the devtools package.
export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export const SCENARIOS: Record<string, Scenario> = {
  default:           { label: "Default (5 todos)", key: "default" },
  empty:             { label: "Empty state",        key: "empty" },
  "all-done":        { label: "All completed",      key: "all-done" },
  "server-error":    { label: "Server error (500)", key: "server-error" },
  "animals-default": { label: "Default animals",    key: "animals-default" },
  "animals-empty":   { label: "Empty animals",      key: "animals-empty" },
};

export const SCENARIO_GROUPS: ScenarioGroup[] = [
  { label: "Todos",   scenarios: ["default", "empty", "all-done", "server-error"] },
  { label: "Animals", scenarios: ["animals-default", "animals-empty"] },
];
