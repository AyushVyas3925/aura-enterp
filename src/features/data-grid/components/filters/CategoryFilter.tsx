"use client";

import { CATEGORIES } from "@/types";
import { useGridStore } from "@/store/gridStore";

export function CategoryFilter() {
  const { category, setCategory } = useGridStore();

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-medium"
        style={{ color: "var(--text-muted)" }}
      >
        Category
      </label>
      <select
        id="category-filter"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="text-sm rounded-lg px-3 py-2 outline-none transition-colors"
        style={{
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-default)",
          color: category ? "var(--text-primary)" : "var(--text-muted)",
        }}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
