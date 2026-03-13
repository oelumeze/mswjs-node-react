import { useScenario } from "../mocks/context";
import { SCENARIOS, SCENARIO_GROUPS } from "../mocks/scenarios";

interface DevToolsPanelProps {
  onClose: () => void;
}

export default function DevToolsPanel({ onClose }: DevToolsPanelProps) {
  const { scenario, setScenario } = useScenario();

  return (
    <div style={{ position: "relative", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", marginTop: "1.5rem", background: "var(--color-background-primary)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>MSW DevTools</span>
          <span style={{ fontSize: 10, padding: "2px 6px", background: "var(--color-background-info)", color: "var(--color-text-info)", borderRadius: "var(--border-radius-md)" }}>v2.8</span>
        </div>
        <button onClick={onClose} style={{ border: "none", background: "transparent", color: "var(--color-text-tertiary)", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "2px 4px" }}>×</button>
      </div>

      {/* Grouped scenario list */}
      <div style={{ minHeight: 260, maxHeight: 380, overflow: "auto", padding: 12 }}>
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 12px" }}>
          Select a scenario to test different UI states.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
      </div>
    </div>
  );
}
