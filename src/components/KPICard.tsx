"use client";

type Props = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "green" | "red" | "amber";
  subtitle?: string;
};

const colorMap = {
  blue: {
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
    iconBg: "rgba(59,130,246,0.12)",
    text: "#60a5fa",
  },
  green: {
    bg: "rgba(34,197,94,0.06)",
    border: "rgba(34,197,94,0.18)",
    iconBg: "rgba(34,197,94,0.1)",
    text: "#4ade80",
  },
  red: {
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.18)",
    iconBg: "rgba(239,68,68,0.1)",
    text: "#f87171",
  },
  amber: {
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.18)",
    iconBg: "rgba(245,158,11,0.1)",
    text: "#fbbf24",
  },
};

export function KPICard({ label, value, icon, color, subtitle }: Props) {
  const c = colorMap[color];

  return (
    <div
      className="fade-up rounded-xl p-5 flex flex-col gap-3"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium tracking-wide uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{ background: c.iconBg, color: c.text }}
        >
          {icon}
        </span>
      </div>

      <div>
        <div
          className="text-2xl font-semibold tabular-nums"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </div>
        {subtitle && (
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
