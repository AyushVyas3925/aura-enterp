"use client";

import { useGridStore } from "@/store/gridStore";

type Props = {
  total: number;
  totalPages: number;
};

export const Pagination = ({ total, totalPages }: Props) => {
  const { currentPage, goToPage } = useGridStore();

  if (totalPages <= 1) return null;

  // Only show a window of 5 page buttons to avoid overcrowding
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + windowSize - 1);
  if (end - start < windowSize - 1) start = Math.max(1, end - windowSize + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const btnBase: React.CSSProperties = {
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.15s",
    border: "1px solid var(--border-default)",
    background: "var(--bg-elevated)",
    color: "var(--text-secondary)",
  };

  const activeStyle: React.CSSProperties = {
    ...btnBase,
    background: "var(--accent-blue)",
    border: "1px solid var(--accent-blue)",
    color: "white",
    fontWeight: 500,
  };

  return (
    <div className="flex items-center justify-between mt-3 px-1">
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        {total.toLocaleString()} results · Page {currentPage} of {totalPages}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          style={{ ...btnBase, opacity: currentPage === 1 ? 0.3 : 1 }}
          aria-label="First page"
        >
          «
        </button>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ ...btnBase, opacity: currentPage === 1 ? 0.3 : 1 }}
          aria-label="Previous page"
        >
          ‹
        </button>

        {start > 1 && (
          <span style={{ color: "var(--text-disabled)", fontSize: 12 }}>…</span>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            style={p === currentPage ? activeStyle : btnBase}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        ))}

        {end < totalPages && (
          <span style={{ color: "var(--text-disabled)", fontSize: 12 }}>…</span>
        )}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ ...btnBase, opacity: currentPage === totalPages ? 0.3 : 1 }}
          aria-label="Next page"
        >
          ›
        </button>
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          style={{ ...btnBase, opacity: currentPage === totalPages ? 0.3 : 1 }}
          aria-label="Last page"
        >
          »
        </button>
      </div>
    </div>
  );
}
