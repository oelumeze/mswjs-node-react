import { t } from "../tokens.ts";
import type { Scenario, ScenarioGroup } from "../types.ts";

interface MswTabProps {
  scenarios: Record<string, Scenario>;
  scenarioGroups: ScenarioGroup[];
  currentScenario: string;
  onScenarioChange: (key: string) => void;
}

export function MswTab({ scenarios, scenarioGroups, currentScenario, onScenarioChange }: MswTabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ fontSize: 12, color: t.textSecondary, margin: 0 }}>
        Select a scenario to test different UI states.
      </p>

      {scenarioGroups.map((group) => (
        <div key={group.label}>
          <p style={{ fontSize: 11, fontWeight: 600, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>
            {group.label}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {group.scenarios.map((key) => {
              const s = scenarios[key];
              if (!s) return null;
              const isActive = currentScenario === key;
              return (
                <div
                  key={key}
                  onClick={() => onScenarioChange(key)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: t.radiusMd, cursor: "pointer", border: isActive ? `1.5px solid ${t.borderInfo}` : `0.5px solid ${t.borderTertiary}`, background: isActive ? t.bgInfo : t.bgPrimary, transition: "all 0.15s ease" }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: isActive ? t.textInfo : t.borderTertiary, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: t.textPrimary, fontWeight: isActive ? 500 : 400 }}>{s.label}</span>
                  {isActive && <span style={{ fontSize: 10, color: t.textInfo, marginLeft: "auto" }}>active</span>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
