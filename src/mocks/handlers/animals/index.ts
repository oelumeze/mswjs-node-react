import { http, HttpResponse } from "msw";
import type { TodoItem } from "../../scenarios";

const DEFAULT_ANIMALS: TodoItem[] = [
  { id: "a1", title: "African Elephant", completed: false, createdAt: "2025-03-10T09:00:00Z" },
  { id: "a2", title: "Bengal Tiger", completed: false, createdAt: "2025-03-10T10:00:00Z" },
  { id: "a3", title: "Blue Whale", completed: false, createdAt: "2025-03-11T08:00:00Z" },
];

let liveAnimals: TodoItem[] = [...DEFAULT_ANIMALS];
let nextAnimalId = 4;

export function resetAnimals() {
  liveAnimals = [...DEFAULT_ANIMALS];
  nextAnimalId = 4;
}

export function createAnimalHandlers(scenario: string) {
  return [
    http.get("/todos", () => {
      if (scenario === "animals-empty") return HttpResponse.json([]);
      return HttpResponse.json(liveAnimals);
    }),

    http.post("/todos", async ({ request }) => {
      const body = await request.json() as { title: string };
      const newAnimal: TodoItem = { id: `a${nextAnimalId++}`, title: body.title, completed: false, createdAt: new Date().toISOString() };
      liveAnimals = [...liveAnimals, newAnimal];
      return HttpResponse.json(newAnimal, { status: 201 });
    }),

    http.patch("/todos/:id", async ({ params, request }) => {
      const id = params.id as string;
      const body = await request.json() as Partial<TodoItem>;
      liveAnimals = liveAnimals.map((a) => (a.id === id ? { ...a, ...body } : a));
      return HttpResponse.json(liveAnimals.find((a) => a.id === id));
    }),

    http.delete("/todos/:id", ({ params }) => {
      liveAnimals = liveAnimals.filter((a) => a.id !== (params.id as string));
      return new HttpResponse(null, { status: 204 });
    }),
  ];
}
