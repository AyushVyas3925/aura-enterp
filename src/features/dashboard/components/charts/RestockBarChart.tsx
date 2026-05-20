"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Props = {
  data: { name: string; stock: number }[];
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number; payload: { name: string } }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="font-medium mb-1" style={{ color: "var(--text-primary)" }}>
        {payload[0].payload.name}
      </div>
      <div style={{ color: "var(--text-secondary)" }}>
        Stock:{" "}
        <span style={{ color: "var(--accent-amber)" }} className="font-semibold">
          {payload[0].value.toLocaleString()} units
        </span>
      </div>
    </div>
  );
}

function getBarColor(stock: number) {
  if (stock <= 5) return "#ef4444";
  if (stock <= 15) return "#f97316";
  return "#f59e0b";
}

export function RestockBarChart({ data }: Props) {
  if (!data.length) return null;
  const maxStock = Math.max(...data.map((d) => d.stock));
  // Extend domain ceiling so bars have visible width even when all values are equal
  // e.g. if all 10 items have stock=1, a domain of [0,1] collapses bars to zero width
  const domainMax = Math.max(maxStock * 2, 5);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 16, bottom: 0, left: 4 }}
      >
        <XAxis
          type="number"
          domain={[0, domainMax]}
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => Number.isInteger(v) ? String(v) : ""}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={130}
          tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: string) =>
            v.length > 18 ? v.slice(0, 17) + "…" : v
          }
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="stock" radius={[0, 4, 4, 0]} maxBarSize={24}>
          {data.map((entry, i) => (
            <Cell key={i} fill={getBarColor(entry.stock)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
