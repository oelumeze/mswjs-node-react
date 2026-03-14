// Default key kept intentionally consistent with the original app's key so
// any previously saved scenario preference survives the migration.
const DEFAULT_KEY = "msw-scenario";

export function loadScenario(storageKey = DEFAULT_KEY): string {
  return localStorage.getItem(storageKey) ?? "default";
}

export function saveScenario(key: string, storageKey = DEFAULT_KEY): void {
  localStorage.setItem(storageKey, key);
}
