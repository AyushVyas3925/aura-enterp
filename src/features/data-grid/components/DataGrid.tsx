"use client";

import { useGridStore } from "@/store/gridStore";
import type { InventoryItem } from "@/types";
import { SkeletonRows } from "@/components/Skeletons";

type ColDef = {
  key: keyof InventoryItem | string;
  label: string;
  sortable?: boolean;
  render?: (row: InventoryItem) => React.ReactNode;
};

const COLUMNS: ColDef[] = [
  { key: "id", label: "SKU ID", sortable: false },
  { key: "sku", label: "SKU Code", sortable: true },
  { key: "name", label: "Product Name", sortable: true },
  { key: "category", label: "Category", sortable: true },
  {
    key: "price",
    label: "Price",
    sortable: true,
    render: (row) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.price),
  },
  {
    key: "stock",
    label: "Stock",
    sortable: true,
    render: (row) => {
      if (row.stock === 0)
        return (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}
          >
            Out of Stock
          </span>
        );
      if (row.stock <= 20)
        return (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24" }}
          >
            {row.stock} ⚠
          </span>
        );
      return <span className="tabular-nums">{row.stock.toLocaleString()}</span>;
    },
  },
  { key: "supplier", label: "Supplier", sortable: true },
  { key: "lastRestocked", label: "Last Restocked", sortable: true },
];

type Props = {
  rows: InventoryItem[];
  isLoading: boolean;
  isFetching: boolean;
};

export function DataGrid({ rows, isLoading, isFetching }: Props) {
  const { sortCol, sortDir, toggleSort } = useGridStore();

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) {
      return <span className="sort-icon opacity-30 ml-1">↕</span>;
    }
    return (
      <span
        className="sort-icon ml-1"
        style={{ color: "var(--accent-blue)" }}
      >
        {sortDir === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border-default)" }}
    >
      {/* Subtle fetch indicator — doesn't disrupt layout like a spinner would */}
      {isFetching && !isLoading && (
        <div
          className="h-0.5 w-full"
          style={{ background: "var(--accent-blue)", opacity: 0.6 }}
        />
      )}
      <div className="table-container">
        <table
          className="data-table w-full border-collapse text-sm"
          style={{ borderSpacing: 0 }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-default)" }}>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                  className={`px-4 py-3 text-left text-xs font-medium whitespace-nowrap select-none ${
                    col.sortable ? "cursor-pointer hover:text-white" : ""
                  }`}
                  style={{
                    color:
                      sortCol === col.key
                        ? "var(--text-primary)"
                        : "var(--text-muted)",
                    background: "var(--bg-elevated)",
                    transition: "color 0.15s",
                  }}
                >
                  {col.label}
                  {col.sortable && <SortIcon col={col.key} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonRows count={10} />
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-3xl">🔍</span>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      No products match your filters
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={row.id}
                  className="transition-colors"
                  style={{
                    background:
                      i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-base)",
                    borderBottom: "1px solid var(--border-default)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background =
                      "var(--bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background =
                      i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-base)";
                  }}
                >
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof InventoryItem] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
