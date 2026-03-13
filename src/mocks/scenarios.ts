export interface Scenario {
  label: string;
  key: string;
}

export interface ScenarioGroup {
  label: string;
  scenarios: string[];
}

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export const SCENARIOS: Record<string, Scenario> = {
  default: { label: "Default (5 todos)", key: "default" },
  empty: { label: "Empty state", key: "empty" },
  "all-done": { label: "All completed", key: "all-done" },
  "server-error": { label: "Server error (500)", key: "server-error" },
  "animals-default": { label: "Default animals", key: "animals-default" },
  "animals-empty": { label: "Empty animals", key: "animals-empty" },
};

export const SCENARIO_GROUPS: ScenarioGroup[] = [
  {
    label: "Todos",
    scenarios: ["default", "empty", "all-done", "server-error"],
  },
  {
    label: "Animals",
    scenarios: ["animals-default", "animals-empty"],
  },
];


const STORAGE_KEY = "msw-scenario";

export function loadScenario(): string {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved && SCENARIOS[saved] ? saved : "default";
}

export function saveScenario(key: string) {
  localStorage.setItem(STORAGE_KEY, key);
}
