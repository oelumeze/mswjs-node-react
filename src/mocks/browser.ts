import { setupWorker } from "msw/browser";
import { createHandlers } from "./handlers/index";
import { loadScenario } from "./scenarios";

export const worker = setupWorker(...createHandlers(loadScenario()));
