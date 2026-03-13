import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useScenario } from "../mocks/context";
import { SCENARIOS, SCENARIO_GROUPS } from "../mocks/scenarios";
import { useFeatureFlags } from "../featureFlags/context";
import { FEATURE_FLAGS } from "../featureFlags/flags";

type Tab = "msw" | "react-query" | "flags";

interface DevToolsPanelProps {
  onClose: () => void;
}

// ── MSW tab ──────────────────────────────────────────────────────────────────

function MswTab() {
  const { scenario, setScenario } = useScenario();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>
        Select a scenario to test different UI states.
      </p>
      {SCENARIO_GROUPS.map((group) => (
        <div key={group.label}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>
            {group.label}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {group.scenarios.map((key) => {
              const s = SCENARIOS[key];
              const isActive = scenario === key;
              return (
                <div
                  key={key}
                  onClick={() => setScenario(key)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--border-radius-md)", cursor: "pointer", border: isActive ? "1.5px solid var(--color-border-info)" : "0.5px solid var(--color-border-tertiary)", background: isActive ? "var(--color-background-info)" : "var(--color-background-primary)", transition: "all 0.15s ease" }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: isActive ? "var(--color-text-info)" : "var(--color-border-tertiary)", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: isActive ? 500 : 400 }}>{s.label}</span>
                  {isActive && <span style={{ fontSize: 10, color: "var(--color-text-info)", marginLeft: "auto" }}>active</span>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── React Query tab ───────────────────────────────────────────────────────────

function statusColor(status: string) {
  if (status === "success") return "#1D9E75";
  if (status === "error") return "var(--color-text-danger)";
  return "var(--color-text-tertiary)";
}

function statusDot(status: string, fetchStatus: string) {
  if (fetchStatus === "fetching") return "#F5A623";
  if (status === "success") return "#1D9E75";
  if (status === "error") return "var(--color-text-danger)";
  return "var(--color-border-secondary)";
}

function ReactQueryTab() {
  const queryClient = useQueryClient();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      forceUpdate((n) => n + 1);
    });
    return unsubscribe;
  }, [queryClient]);

  const queries = queryClient.getQueryCache().getAll();

  if (queries.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--color-text-tertiary)" }}>
        <p style={{ fontSize: 13, margin: 0 }}>No queries in cache yet.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>
        Live view of the React Query cache. Updates in real-time.
      </p>
      {queries.map((query) => {
        const { status, fetchStatus, dataUpdatedAt, data } = query.state;
        const key = JSON.stringify(query.queryKey);
        const updatedAt = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "—";
        const isStale = query.isStale();
        const observerCount = query.getObserversCount();
        const dataPreview = Array.isArray(data)
          ? `${data.length} item${data.length !== 1 ? "s" : ""}`
          : data != null
          ? typeof data === "object"
            ? "{…}"
            : String(data)
          : "—";

        return (
          <div key={key} style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "10px 12px", background: "var(--color-background-primary)" }}>
            {/* Key + status dot */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusDot(status, fetchStatus), flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--color-text-primary)", wordBreak: "break-all" }}>{key}</span>
            </div>

            {/* Meta row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
              <span style={{ fontSize: 11, color: statusColor(status) }}>{fetchStatus === "fetching" ? "fetching…" : status}</span>
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>data: {dataPreview}</span>
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>updated: {updatedAt}</span>
              <span style={{ fontSize: 11, color: isStale ? "#F5A623" : "var(--color-text-tertiary)" }}>{isStale ? "stale" : "fresh"}</span>
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{observerCount} observer{observerCount !== 1 ? "s" : ""}</span>
            </div>

            {/* Refetch button */}
            <button
              onClick={() => query.fetch()}
              style={{ marginTop: 8, fontSize: 11, padding: "3px 8px" }}
              disabled={fetchStatus === "fetching"}
            >
              {fetchStatus === "fetching" ? "Fetching…" : "Refetch"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── Feature Flags tab ─────────────────────────────────────────────────────────

function FlagsTab() {
  const { getFlag, setFlag } = useFeatureFlags();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>
        Toggle feature flags. Persisted in localStorage.
      </p>
      {FEATURE_FLAGS.map((flag) => {
        const enabled = getFlag(flag.key);
        return (
          <div
            key={flag.key}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 12px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)" }}
          >
            <div>
              <p style={{ fontSize: 13, color: "var(--color-text-primary)", margin: 0, fontWeight: 500 }}>{flag.label}</p>
              <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "2px 0 0" }}>{flag.description}</p>
            </div>
            {/* Toggle switch */}
            <div
              onClick={() => setFlag(flag.key, !enabled)}
              style={{ position: "relative", width: 36, height: 20, borderRadius: 10, background: enabled ? "var(--color-text-info)" : "var(--color-border-secondary)", cursor: "pointer", flexShrink: 0, transition: "background 0.2s ease" }}
            >
              <div style={{ position: "absolute", top: 2, left: enabled ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Panel shell ───────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "msw", label: "MSW" },
  { id: "react-query", label: "React Query" },
  { id: "flags", label: "Feature Flags" },
];

export default function DevToolsPanel({ onClose }: DevToolsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("msw");

  return (
    <div style={{ position: "relative", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", marginTop: "1.5rem", background: "var(--color-background-primary)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>DevTools</span>
          <span style={{ fontSize: 10, padding: "2px 6px", background: "var(--color-background-info)", color: "var(--color-text-info)", borderRadius: "var(--border-radius-md)" }}>v2.8</span>
        </div>
        <button onClick={onClose} style={{ border: "none", background: "transparent", color: "var(--color-text-tertiary)", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "2px 4px" }}>×</button>
      </div>

      {/* Tab strip */}
      <div style={{ display: "flex", borderBottom: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)" }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1, padding: "7px 4px", fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? "var(--color-text-info)" : "var(--color-text-secondary)", background: "transparent", border: "none", borderBottom: isActive ? "2px solid var(--color-text-info)" : "2px solid transparent", cursor: "pointer", transition: "all 0.15s ease", marginBottom: -1 }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ minHeight: 260, maxHeight: 380, overflow: "auto", padding: 12 }}>
        {activeTab === "msw" && <MswTab />}
        {activeTab === "react-query" && <ReactQueryTab />}
        {activeTab === "flags" && <FlagsTab />}
      </div>
    </div>
  );
}
