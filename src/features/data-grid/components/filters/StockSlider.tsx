"use client";

import { useState } from "react";
import { useGridStore } from "@/store/gridStore";

const PRESETS = [
  { label: "Any", value: null },
  { label: "≤ 5", value: 5 },
  { label: "≤ 10", value: 10 },
  { label: "≤ 20", value: 20 },
  { label: "≤ 50", value: 50 },
];

export function StockSlider() {
  const { maxStock, setMaxStock } = useGridStore();
  const [sliderVal, setSliderVal] = useState(maxStock ?? 1000);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value);
    setSliderVal(n);
    setMaxStock(n >= 1000 ? null : n);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Max Stock
        </label>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded"
          style={{
            background: "var(--bg-subtle)",
            color: maxStock === null ? "var(--text-muted)" : "var(--accent-amber)",
          }}
        >
          {maxStock === null ? "Any" : `≤ ${maxStock}`}
        </span>
      </div>

      <input
        type="range"
        id="stock-slider"
        min={0}
        max={1000}
        step={5}
        value={sliderVal}
        onChange={handleSliderChange}
      />

      <div className="flex gap-1 flex-wrap mt-1">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setMaxStock(p.value);
              setSliderVal(p.value ?? 1000);
            }}
            className="text-xs px-2 py-0.5 rounded transition-colors"
            style={{
              background:
                maxStock === p.value ? "var(--accent-blue)" : "var(--bg-subtle)",
              color:
                maxStock === p.value ? "white" : "var(--text-secondary)",
              border: "1px solid var(--border-default)",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
