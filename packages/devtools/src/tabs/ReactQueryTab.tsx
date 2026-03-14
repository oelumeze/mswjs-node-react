import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "../tokens.ts";

function statusDotColor(status: string, fetchStatus: string) {
  if (fetchStatus === "fetching") return "#F5A623";
  if (status === "success") return "#1D9E75";
  if (status === "error") return t.textDanger;
  return t.borderSecondary;
}

function statusLabel(status: string, fetchStatus: string) {
  if (fetchStatus === "fetching") return "fetching…";
  return status;
}

function statusTextColor(status: string) {
  if (status === "success") return "#1D9E75";
  if (status === "error") return t.textDanger;
  return t.textTertiary;
}

function dataPreview(data: unknown) {
  if (Array.isArray(data)) return `${data.length} item${data.length !== 1 ? "s" : ""}`;
  if (data != null) return typeof data === "object" ? "{…}" : String(data);
  return "—";
}

export function ReactQueryTab() {
  const queryClient = useQueryClient();
  const [, tick] = useState(0);

  useEffect(() => {
    return queryClient.getQueryCache().subscribe(() => tick((n) => n + 1));
  }, [queryClient]);

  const queries = queryClient.getQueryCache().getAll();

  if (queries.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem 1rem", color: t.textTertiary }}>
        <p style={{ fontSize: 13, margin: 0 }}>No queries in cache yet.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ fontSize: 12, color: t.textSecondary, margin: 0 }}>
        Live view of the React Query cache — updates in real time.
      </p>

      {queries.map((query) => {
        const { status, fetchStatus, dataUpdatedAt, data } = query.state;
        const key = JSON.stringify(query.queryKey);
        const updatedAt = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "—";
        const isStale = query.isStale();
        const observers = query.getObserversCount();

        return (
          <div key={key} style={{ border: `0.5px solid ${t.borderTertiary}`, borderRadius: t.radiusMd, padding: "10px 12px", background: t.bgPrimary }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusDotColor(status, fetchStatus), flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontFamily: t.mono, color: t.textPrimary, wordBreak: "break-all" }}>{key}</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: statusTextColor(status) }}>{statusLabel(status, fetchStatus)}</span>
              <span style={{ fontSize: 11, color: t.textTertiary }}>data: {dataPreview(data)}</span>
              <span style={{ fontSize: 11, color: t.textTertiary }}>updated: {updatedAt}</span>
              <span style={{ fontSize: 11, color: isStale ? "#F5A623" : t.textTertiary }}>{isStale ? "stale" : "fresh"}</span>
              <span style={{ fontSize: 11, color: t.textTertiary }}>{observers} observer{observers !== 1 ? "s" : ""}</span>
            </div>

            <button
              onClick={() => query.fetch()}
              disabled={fetchStatus === "fetching"}
              style={{ fontSize: 11, padding: "3px 8px" }}
            >
              {fetchStatus === "fetching" ? "Fetching…" : "Refetch"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
