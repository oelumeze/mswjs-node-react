import { http, HttpResponse } from "msw";
import type { TodoItem } from "../../scenarios";

const DEFAULT_TODOS: TodoItem[] = [
  { id: "1", title: "Set up MSW handlers", completed: true, createdAt: "2025-03-10T09:00:00Z" },
  { id: "2", title: "Define API scenarios", completed: true, createdAt: "2025-03-10T10:30:00Z" },
  { id: "3", title: "Wire up DevTools panel", completed: false, createdAt: "2025-03-11T14:00:00Z" },
  { id: "4", title: "Test error boundaries", completed: false, createdAt: "2025-03-12T08:00:00Z" },
  { id: "5", title: "Ship to production", completed: false, createdAt: "2025-03-13T11:00:00Z" },
];

const ALL_DONE_TODOS: TodoItem[] = DEFAULT_TODOS.map((t) => ({ ...t, completed: true }));

let liveTodos: TodoItem[] = [...DEFAULT_TODOS];
let nextId = 6;

export function resetTodos() {
  liveTodos = [...DEFAULT_TODOS];
  nextId = 6;
}

export function createTodoHandlers(scenario: string) {
  const isError = scenario === "server-error";

  return [
    http.get("/todos", () => {
      if (isError) return HttpResponse.json({ error: "Internal Server Error" }, { status: 500 });
      if (scenario === "empty") return HttpResponse.json([]);
      if (scenario === "all-done") return HttpResponse.json(ALL_DONE_TODOS);
      return HttpResponse.json(liveTodos);
    }),

    http.post("/todos", async ({ request }) => {
      if (isError) return HttpResponse.json({ error: "Internal Server Error" }, { status: 500 });
      const body = await request.json() as { title: string };
      const newTodo: TodoItem = { id: String(nextId++), title: body.title, completed: false, createdAt: new Date().toISOString() };
      liveTodos = [...liveTodos, newTodo];
      return HttpResponse.json(newTodo, { status: 201 });
    }),

    http.patch("/todos/:id", async ({ params, request }) => {
      if (isError) return HttpResponse.json({ error: "Internal Server Error" }, { status: 500 });
      const id = params.id as string;
      const body = await request.json() as Partial<TodoItem>;
      liveTodos = liveTodos.map((t) => (t.id === id ? { ...t, ...body } : t));
      return HttpResponse.json(liveTodos.find((t) => t.id === id));
    }),

    http.delete("/todos/:id", ({ params }) => {
      if (isError) return HttpResponse.json({ error: "Internal Server Error" }, { status: 500 });
      liveTodos = liveTodos.filter((t) => t.id !== (params.id as string));
      return new HttpResponse(null, { status: 204 });
    }),
  ];
}
