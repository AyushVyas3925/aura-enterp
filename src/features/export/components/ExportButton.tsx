"use client";

import { useState } from "react";
import { useGridStore } from "@/store/gridStore";
import { exportFilteredCSV } from "@/features/export/utils/csvExporter";

export function ExportButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [exportedCount, setExportedCount] = useState(0);

  const { debouncedSearch, category, maxStock, minPrice, maxPrice } = useGridStore();

  const handleExport = async () => {
    setStatus("loading");
    try {
      const count = await exportFilteredCSV({
        search: debouncedSearch,
        category,
        maxStock,
        minPrice,
        maxPrice,
      });
      setExportedCount(count);
      setStatus("done");
      // Reset back to idle after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const label = {
    idle: "Export CSV",
    loading: "Exporting…",
    done: `✓ ${exportedCount.toLocaleString()} rows`,
    error: "Export failed",
  }[status];

  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: "var(--radius-md)",
    fontSize: 13,
    fontWeight: 500,
    cursor: status === "loading" ? "not-allowed" : "pointer",
    transition: "all 0.15s",
    border: "1px solid",
    background:
      status === "done"
        ? "rgba(34,197,94,0.12)"
        : status === "error"
          ? "rgba(239,68,68,0.12)"
          : "rgba(59,130,246,0.08)",
    borderColor:
      status === "done"
        ? "rgba(34,197,94,0.3)"
        : status === "error"
          ? "rgba(239,68,68,0.3)"
          : "rgba(59,130,246,0.25)",
    color:
      status === "done"
        ? "var(--accent-green)"
        : status === "error"
          ? "var(--accent-red)"
          : "var(--accent-blue)",
    opacity: status === "loading" ? 0.7 : 1,
  };

  return (
    <button
      id="export-csv-btn"
      onClick={handleExport}
      disabled={status === "loading"}
      style={style}
      aria-label="Export current filtered data to CSV"
    >
      {status === "loading" ? (
        <span className="inline-block w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <span>⬇</span>
      )}
      {label}
    </button>
  );
}
