"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Slice = { category: string; value: number; percentage: number };

const PALETTE = [
  "#3b82f6",
  "#a855f7",
  "#22c55e",
  "#f59e0b",
  "#06b6d4",
  "#ec4899",
  "#f97316",
  "#14b8a6",
  "#8b5cf6",
  "#84cc16",
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Slice }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(d.value);

  return (
    <div className="chart-tooltip">
      <div className="font-medium mb-1">{d.category}</div>
      <div style={{ color: "var(--text-secondary)" }}>
        Value:{" "}
        <span style={{ color: "var(--accent-blue)" }} className="font-semibold">
          {formatted}
        </span>
      </div>
      <div style={{ color: "var(--text-muted)" }}>{d.percentage}% of portfolio</div>
    </div>
  );
}

export function PortfolioPieChart({ data }: { data: Slice[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={105}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(val) => (
            <span style={{ color: "var(--text-secondary)", fontSize: 11 }}>{val}</span>
          )}
          iconSize={8}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
