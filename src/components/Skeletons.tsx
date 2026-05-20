"use client";

export const SkeletonRows = ({ count = 10 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i}>
          {[140, 100, 180, 120, 80, 80, 90, 120].map((w, j) => (
            <td key={j} className="px-4 py-3">
              <div
                className="skeleton h-3 rounded"
                style={{ width: `${w * (0.6 + Math.random() * 0.4)}px` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-8 w-8 rounded-lg" />
      </div>
      <div className="skeleton h-7 w-32 rounded" />
      <div className="skeleton h-2.5 w-20 rounded" />
    </div>
  );
}

export function SkeletonChart({ height = 280 }: { height?: number }) {
  return (
    <div className="skeleton rounded-lg w-full" style={{ height }} />
  );
}
