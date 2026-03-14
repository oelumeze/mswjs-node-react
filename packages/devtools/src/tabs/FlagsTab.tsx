import { t } from "../tokens.ts";
import type { FeatureFlag } from "../types.ts";
import { useFeatureFlags } from "../featureFlags/context.tsx";

interface FlagsTabProps {
  featureFlags: FeatureFlag[];
}

export function FlagsTab({ featureFlags }: FlagsTabProps) {
  const { getFlag, setFlag } = useFeatureFlags();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ fontSize: 12, color: t.textSecondary, margin: 0 }}>
        Toggle feature flags. Persisted in localStorage.
      </p>

      {featureFlags.map((flag) => {
        const enabled = getFlag(flag.key);
        return (
          <div
            key={flag.key}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 12px", border: `0.5px solid ${t.borderTertiary}`, borderRadius: t.radiusMd, background: t.bgPrimary }}
          >
            <div>
              <p style={{ fontSize: 13, color: t.textPrimary, margin: 0, fontWeight: 500 }}>{flag.label}</p>
              <p style={{ fontSize: 11, color: t.textTertiary, margin: "2px 0 0" }}>{flag.description}</p>
            </div>

            {/* Toggle switch */}
            <div
              onClick={() => setFlag(flag.key, !enabled)}
              role="switch"
              aria-checked={enabled}
              style={{ position: "relative", width: 36, height: 20, borderRadius: 10, background: enabled ? t.textInfo : t.borderSecondary, cursor: "pointer", flexShrink: 0, transition: "background 0.2s ease" }}
            >
              <div style={{ position: "absolute", top: 2, left: enabled ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
