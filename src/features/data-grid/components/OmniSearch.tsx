"use client";

import { useEffect } from "react";
import { useGridStore } from "@/store/gridStore";
import { useDebounce } from "@/hooks/useDebounce";

export function OmniSearch() {
  const { searchInput, setSearchInput, applyDebouncedSearch } = useGridStore();
  const debounced = useDebounce(searchInput, 500);

  useEffect(() => {
    applyDebouncedSearch(debounced);
  }, [debounced, applyDebouncedSearch]);

  return (
    <div className="relative">
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none"
        style={{ color: "var(--text-muted)" }}
      >
        🔍
      </span>
      <input
        id="omnisearch"
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search by product, SKU, or supplier…"
        className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm outline-none transition-colors"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          color: "var(--text-primary)",
        }}
        aria-label="Search inventory"
        autoComplete="off"
        spellCheck={false}
      />
      {searchInput && (
        <button
          onClick={() => setSearchInput("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm transition-opacity hover:opacity-75"
          style={{ color: "var(--text-muted)" }}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
