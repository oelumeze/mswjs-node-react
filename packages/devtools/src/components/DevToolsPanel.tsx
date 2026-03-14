import { useState } from "react";
import { t } from "../tokens.ts";
import { useScenario } from "../msw/context.tsx";
import { useDevToolsConfig } from "../setup/config-context.tsx";
import { MswTab } from "../tabs/MswTab.tsx";
import { ReactQueryTab } from "../tabs/ReactQueryTab.tsx";
import { FlagsTab } from "../tabs/FlagsTab.tsx";

type Tab = "msw" | "react-query" | "flags";

const TABS: { id: Tab; label: string }[] = [
  { id: "msw",         label: "MSW" },
  { id: "react-query", label: "React Query" },
  { id: "flags",       label: "Feature Flags" },
];

/**
 * Drop-in devtools panel — no props needed.
 * Wrap your app with the `DevToolsProvider` returned by `setupDevTools()` and
 * this component self-configures from context.
 *
 * @example
 * {import.meta.env.DEV && <DevToolsPanel />}
 */
export function DevToolsPanel() {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("msw");
  const { scenario, setScenario } = useScenario();
  const { scenarios, scenarioGroups, featureFlags } = useDevToolsConfig();

  // ── Collapsed: just a trigger button ─────────────────────────────────────
  if (!open) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "0 1rem 2rem" }}>
        <button
          onClick={() => setOpen(true)}
          style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          Open DevTools
        </button>
      </div>
    );
  }

  // ── Expanded panel ────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 540, margin: "0 auto", padding: "0 1rem 2rem" }}>
      <div style={{ position: "relative", border: `0.5px solid ${t.borderSecondary}`, borderRadius: t.radiusLg, overflow: "hidden", marginTop: "1.5rem", background: t.bgPrimary }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: `0.5px solid ${t.borderTertiary}`, background: t.bgSecondary }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textSecondary} strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 500, color: t.textPrimary }}>DevTools</span>
            <span style={{ fontSize: 10, padding: "2px 6px", background: t.bgInfo, color: t.textInfo, borderRadius: t.radiusMd }}>v0.1</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{ border: "none", background: "transparent", color: t.textTertiary, cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "2px 4px" }}
          >
            ×
          </button>
        </div>

        {/* Tab strip */}
        <div style={{ display: "flex", borderBottom: `0.5px solid ${t.borderTertiary}`, background: t.bgSecondary }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ flex: 1, padding: "7px 4px", fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? t.textInfo : t.textSecondary, background: "transparent", border: "none", borderBottom: isActive ? `2px solid ${t.textInfo}` : "2px solid transparent", cursor: "pointer", transition: "all 0.15s ease", marginBottom: -1 }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div style={{ minHeight: 260, maxHeight: 380, overflow: "auto", padding: 12 }}>
          {activeTab === "msw" && (
            <MswTab
              scenarios={scenarios}
              scenarioGroups={scenarioGroups}
              currentScenario={scenario}
              onScenarioChange={setScenario}
            />
          )}
          {activeTab === "react-query" && <ReactQueryTab />}
          {activeTab === "flags" && <FlagsTab featureFlags={featureFlags} />}
        </div>

      </div>
    </div>
  );
}
