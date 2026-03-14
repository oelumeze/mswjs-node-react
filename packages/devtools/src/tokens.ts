/** CSS variable references with sensible fallbacks so the package works
 *  with or without the host app's design tokens. */
export const t = {
  textPrimary:    "var(--color-text-primary, #1a1a1a)",
  textSecondary:  "var(--color-text-secondary, #555)",
  textTertiary:   "var(--color-text-tertiary, #888)",
  textInfo:       "var(--color-text-info, #0ea5e9)",
  textDanger:     "var(--color-text-danger, #ef4444)",
  bgPrimary:      "var(--color-background-primary, #fff)",
  bgSecondary:    "var(--color-background-secondary, #f5f5f5)",
  bgInfo:         "var(--color-background-info, #e0f2fe)",
  bgDanger:       "var(--color-background-danger, #fee2e2)",
  borderTertiary: "var(--color-border-tertiary, #e5e5e5)",
  borderSecondary:"var(--color-border-secondary, #d4d4d4)",
  borderInfo:     "var(--color-border-info, #7dd3fc)",
  borderDanger:   "var(--color-border-danger, #fca5a5)",
  radiusMd:       "var(--border-radius-md, 6px)",
  radiusLg:       "var(--border-radius-lg, 10px)",
  mono:           "var(--font-mono, monospace)",
} as const;
