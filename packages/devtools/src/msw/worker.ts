import { setupWorker } from "msw/browser";
import type { RequestHandler } from "msw";
import { loadScenario } from "./storage.ts";

export type MSWWorker = ReturnType<typeof setupWorker>;

export interface CreateMSWWorkerOptions {
  /** Override the initial scenario instead of reading from localStorage. */
  initialScenario?: string;
  /** Override the localStorage key used to persist the active scenario. */
  storageKey?: string;
}

/**
 * Creates an MSW service worker pre-loaded with the handlers for the active
 * scenario (read from localStorage, or the provided `initialScenario`).
 *
 * @example
 * // src/mocks/browser.ts
 * export const worker = createMSWWorker(createHandlers);
 *
 * // src/main.tsx
 * worker.start({ onUnhandledRequest: 'bypass' }).then(() => render());
 */
export function createMSWWorker(
  createHandlers: (scenario: string) => RequestHandler[],
  options: CreateMSWWorkerOptions = {},
): MSWWorker {
  const { initialScenario, storageKey } = options;
  const scenario = initialScenario ?? loadScenario(storageKey);
  return setupWorker(...createHandlers(scenario));
}
