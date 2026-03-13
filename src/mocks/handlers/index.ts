import { createTodoHandlers, resetTodos } from "./todos";
import { createAnimalHandlers, resetAnimals } from "./animals";

export function resetLiveTodos() {
  resetTodos();
  resetAnimals();
}

export function createHandlers(scenario: string) {
  if (scenario.startsWith("animals-")) {
    return createAnimalHandlers(scenario);
  }
  return createTodoHandlers(scenario);
}
