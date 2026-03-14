import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useScenario, useFeatureFlags } from "react-mock-devtools";
import type { TodoItem } from "../mocks/scenarios";

interface TodoAppProps {
  title?: string;
  subtitle?: string;
  addPlaceholder?: string;
}

async function fetchTodos(): Promise<TodoItem[]> {
  const res = await fetch("/todos");
  if (res.status >= 400) throw new Error(`Server returned ${res.status}`);
  return res.json();
}

export default function TodoApp({
  title = "Todo list",
  subtitle = "Powered by MSW — all requests intercepted at the network layer",
  addPlaceholder = "What needs to be done?",
}: TodoAppProps) {
  const { scenario } = useScenario();
  const { getFlag } = useFeatureFlags();
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState("");

  const showProgressBar = getFlag("showProgressBar");
  const showSubtitle = getFlag("showSubtitle");
  const enableAnimations = getFlag("enableAnimations");
  const compactView = getFlag("compactView");

  const itemPadding = compactView ? "6px 12px" : "10px 12px";
  const transition = enableAnimations ? "all 0.15s ease" : "none";

  const { data: todos = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["todos", scenario],
    queryFn: fetchTodos,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["todos", scenario] });

  const addMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch("/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (res.status >= 400) throw new Error(`Server returned ${res.status}`);
      return res.json();
    },
    onSuccess: () => { setNewTitle(""); invalidate(); },
  });

  const toggleMutation = useMutation({
    mutationFn: async (todo: TodoItem) => {
      const res = await fetch(`/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (res.status >= 400) throw new Error(`Server returned ${res.status}`);
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/todos/${id}`, { method: "DELETE" });
    },
    onSuccess: invalidate,
  });

  const addTodo = () => {
    if (!newTitle.trim()) return;
    addMutation.mutate(newTitle.trim());
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const mutationError = addMutation.error || toggleMutation.error || deleteMutation.error;

  return (
    <div style={{ maxWidth: 540, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0, color: "var(--color-text-primary)" }}>{title}</h2>
        {showSubtitle && (
          <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", margin: "4px 0 0" }}>{subtitle}</p>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder={addPlaceholder}
          style={{ flex: 1 }}
          disabled={addMutation.isPending}
        />
        <button onClick={addTodo} disabled={addMutation.isPending || !newTitle.trim()}>
          {addMutation.isPending ? "Adding..." : "Add"}
        </button>
      </div>

      {isLoading && (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-secondary)" }}>
          <div style={{ display: "inline-block", width: 20, height: 20, border: "2px solid var(--color-border-tertiary)", borderTopColor: "var(--color-text-secondary)", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
          <p style={{ fontSize: 13, marginTop: 8 }}>Fetching todos...</p>
        </div>
      )}

      {(isError || mutationError) && (
        <div style={{ background: "var(--color-background-danger)", border: "0.5px solid var(--color-border-danger)", borderRadius: "var(--border-radius-md)", padding: "12px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: "var(--color-text-danger)", margin: 0, fontWeight: 500 }}>Request failed</p>
          <p style={{ fontSize: 12, color: "var(--color-text-danger)", margin: "4px 0 0", fontFamily: "var(--font-mono)", opacity: 0.8 }}>
            {((isError ? error : mutationError) as Error)?.message}
          </p>
          <button onClick={() => refetch()} style={{ marginTop: 8, fontSize: 12 }}>Retry</button>
        </div>
      )}

      {!isLoading && !isError && todos.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-tertiary)" }}>
          <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12l2 2 4-4"/></svg>
          </div>
          <p style={{ fontSize: 14, margin: 0 }}>No todos yet</p>
          <p style={{ fontSize: 12, margin: "4px 0 0" }}>Add one above or switch scenarios in the DevTools panel</p>
        </div>
      )}

      {!isLoading && !isError && todos.length > 0 && (
        <>
          {showProgressBar && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{completedCount} of {todos.length} completed</span>
              <div style={{ height: 4, width: 120, background: "var(--color-border-tertiary)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(completedCount / todos.length) * 100}%`, background: "var(--color-text-info)", borderRadius: 2, transition: enableAnimations ? "width 0.3s ease" : "none" }} />
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {todos.map((todo) => (
              <div key={todo.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: itemPadding, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", transition }}>
                <div
                  onClick={() => toggleMutation.mutate(todo)}
                  style={{ width: 18, height: 18, borderRadius: "50%", border: todo.completed ? "none" : "1.5px solid var(--color-border-secondary)", background: todo.completed ? "#1D9E75" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition }}
                >
                  {todo.completed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="4 12 10 18 20 6"/></svg>}
                </div>
                <span style={{ flex: 1, fontSize: 14, color: todo.completed ? "var(--color-text-tertiary)" : "var(--color-text-primary)", textDecoration: todo.completed ? "line-through" : "none", transition }}>{todo.title}</span>
                <button onClick={() => deleteMutation.mutate(todo.id)} style={{ border: "none", background: "transparent", color: "var(--color-text-tertiary)", cursor: "pointer", padding: "2px 6px", fontSize: 16, lineHeight: 1, opacity: 0.4 }} title="Delete">×</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
