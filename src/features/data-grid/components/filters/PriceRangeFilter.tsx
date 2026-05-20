"use client";

import { useState } from "react";
import { useGridStore } from "@/store/gridStore";

export function PriceRangeFilter() {
  const { minPrice, maxPrice, setPriceRange } = useGridStore();
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const commit = () => setPriceRange(localMin, localMax);

  const inputStyle = {
    background: "var(--bg-subtle)",
    border: "1px solid var(--border-default)",
    color: "var(--text-primary)",
    borderRadius: "var(--radius-sm)",
    padding: "6px 10px",
    fontSize: "13px",
    width: "100%",
    outline: "none",
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
        Price Range (USD)
      </label>
      <div className="flex items-center gap-2">
        <input
          id="price-min"
          type="number"
          placeholder="Min"
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          style={inputStyle}
          min={0}
        />
        <span style={{ color: "var(--text-disabled)" }}>–</span>
        <input
          id="price-max"
          type="number"
          placeholder="Max"
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          style={inputStyle}
          min={0}
        />
      </div>
    </div>
  );
}
