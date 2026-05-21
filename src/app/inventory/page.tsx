"use client";

import { useInventoryGrid } from "@/hooks/useInventoryGrid";
import { useGridStore } from "@/store/gridStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { exportFilteredCSV } from "@/features/export/utils/csvExporter";
import type { InventoryItem } from "@/types";
import { CATEGORIES } from "@/types";
import { Search, Download, ArrowUp, ArrowDown, X, MapPin } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  Electronics: { bg: "#EFF6FF", text: "#1D4ED8" },
  Apparel: { bg: "#F5F3FF", text: "#5B21B6" },
  "Home & Garden": { bg: "#FFFBEB", text: "#92400E" },
  Sports: { bg: "#FFF1F2", text: "#9F1239" },
  Automotive: { bg: "#F0FDF4", text: "#166534" },
  "Food & Beverage": { bg: "#ECFDF5", text: "#065F46" },
  "Health & Beauty": { bg: "#FDF4FF", text: "#7E22CE" },
  "Toys & Games": { bg: "#FFF7ED", text: "#C2410C" },
  "Office Supplies": { bg: "#F0F9FF", text: "#0369A1" },
  Furniture: { bg: "#FEF3C7", text: "#92400E" },
};

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="inline-flex items-center px-2 py-0.5 rounded h-6" style={{ background: "#FEE2E2", color: "#991B1B", fontSize: 12, fontWeight: 600 }}>Out of Stock</span>;
  if (stock <= 20) return <span className="inline-flex items-center px-2 py-0.5 rounded h-6" style={{ background: "#FEF3C7", color: "#92400E", fontSize: 12, fontWeight: 600 }}>Low Stock</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded h-6" style={{ background: "#D1FAE5", color: "#065F46", fontSize: 12, fontWeight: 600 }}>In Stock</span>;
}

function CategoryBadge({ cat }: { cat: string }) {
  const s = CATEGORY_STYLES[cat] ?? { bg: "#f0edee", text: "#45464c" };
  return <span className="inline-flex items-center px-2 py-0.5 rounded h-6" style={{ background: s.bg, color: s.text, fontSize: 12, fontWeight: 600 }}>{cat}</span>;
}

type SortCol = keyof InventoryItem | "";

const InventoryPage = () => {
  const queryClient = useQueryClient();
  const store = useGridStore();
  const { applyDebouncedSearch } = store;
  const { data, isLoading, isFetching } = useInventoryGrid();
  const [exporting, setExporting] = useState(false);
  const [sortCol, setSortCol] = useState<SortCol>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedSku, setSelectedSku] = useState<InventoryItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  const debounced = useDebounce(store.searchInput, 500);

  useEffect(() => {
    applyDebouncedSearch(debounced);
  }, [debounced, applyDebouncedSearch]);

  const handleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
    store.toggleSort(col as string);
  };

  const handleExport = async () => {
    setExporting(true);
    try { await exportFilteredCSV({ search: store.debouncedSearch, category: store.category, maxStock: store.maxStock, minPrice: store.minPrice, maxPrice: store.maxPrice }); }
    finally { setExporting(false); }
  };

  const handleRestock = async (id: string, name: string) => {
    try {
      const res = await fetch("/api/inventory/restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: 250 }),
      });
      if (!res.ok) throw new Error();
      
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      
      if (selectedSku && selectedSku.id === id) {
        setSelectedSku({ ...selectedSku, stock: selectedSku.stock + 250 });
      }
      showToast(`Restocked +250 units for ${name}`, "success");
    } catch (e) {
      console.error(e);
      showToast(`Failed to restock ${name}`, "error");
    }
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ArrowDown size={14} style={{ opacity: 0, transition: "opacity 0.15s" }} className="group-hover:opacity-40" />;
    return sortDir === "desc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  const thStyle = (align?: string) => `p-3 whitespace-nowrap cursor-pointer select-none group hover:bg-gray-50 sticky top-0 bg-white z-10 border-b ${align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}`;
  const thBase = { fontSize: 13, fontWeight: 600, color: "#45464c", borderColor: "#E5E7EB" };

  return (
    <section className="flex flex-col gap-4">
      <h2 style={{ fontWeight: 600, fontSize: 18 }}>Inventory</h2>

      <div className="bg-white border rounded-lg p-3 flex flex-wrap items-center gap-3" style={{ borderColor: "#E5E7EB", background: "#FFFFFF" }}>
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} color="#45464c" />
        <label htmlFor="inventory-search" className="sr-only">Search inventory</label>
          <input
            id="inventory-search"
            className="w-full h-9 pl-9 pr-3 rounded border text-sm outline-none"
            style={{ borderColor: "#E5E7EB", fontSize: 14, color: "#1b1b1d" }}
            placeholder="Search by SKU or Name..."
            value={store.searchInput}
            onChange={e => store.setSearchInput(e.target.value)}
            autoComplete="off"
          />
        </div>

        <label htmlFor="category-filter" className="sr-only">Filter by category</label>
        <select
          id="category-filter"
          aria-label="Filter by category"
          className="h-9 rounded border text-sm outline-none min-w-36"
          style={{ borderColor: "#E5E7EB", fontSize: 13, color: "#1b1b1d", background: "#FFFFFF" }}
          value={store.category}
          onChange={e => store.setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="flex items-center gap-2 border rounded h-9 px-3" style={{ borderColor: "#E5E7EB", background: "#FFFFFF" }}>
          <label htmlFor="stock-range" className="whitespace-nowrap" style={{ fontSize: 13, color: "#374151" }}>Stock ≤ 500</label>
          <input
            id="stock-range"
            type="range" min={0} max={500} step={5} className="w-24"
            aria-label={`Maximum stock filter: ${store.maxStock === null ? 500 : store.maxStock}`}
            value={store.maxStock === null ? 500 : store.maxStock}
            onChange={e => { const v = parseInt(e.target.value); store.setMaxStock(v >= 500 ? null : v); }}
          />
          <span style={{ fontSize: 12, fontFamily: "monospace", color: "#1b1b1d", minWidth: 28 }}>
            {store.maxStock === null ? 500 : store.maxStock}
          </span>
        </div>

        <div className="flex items-center gap-2 border rounded h-9 px-3" style={{ borderColor: "#E5E7EB", background: "#FFFFFF" }}>
          <span className="whitespace-nowrap" style={{ fontSize: 13, color: "#45464c" }}>Price ($)</span>
          <input type="number" placeholder="Min" min={0} value={store.minPrice} onChange={e => store.setPriceRange(e.target.value, store.maxPrice)} className="w-16 outline-none text-sm" />
          <span style={{ color: "#c6c6cd" }}>-</span>
          <input type="number" placeholder="Max" min={0} value={store.maxPrice} onChange={e => store.setPriceRange(store.minPrice, e.target.value)} className="w-16 outline-none text-sm" />
        </div>

        <div className="w-[72px] shrink-0">
          {(store.category || store.maxStock !== null || store.debouncedSearch || store.minPrice || store.maxPrice) && (
            <button onClick={store.resetFilters} className="flex items-center justify-center gap-1 w-full h-9 rounded transition-colors hover:bg-gray-50" style={{ fontSize: 13, color: "#45464c" }}>
              <X size={14} /> Clear
            </button>
          )}
        </div>

        <button
          id="export-csv-btn"
          onClick={handleExport}
          disabled={exporting}
          className="h-9 px-4 rounded flex items-center gap-2 ml-auto transition-colors"
          style={{ background: "#111827", color: "#fff", fontSize: 13, fontWeight: 500, opacity: exporting ? 0.7 : 1 }}
        >
          <Download size={16} />
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      <div className="bg-white border rounded-lg flex flex-col" style={{ borderColor: "#E5E7EB", height: 520, background: "#FFFFFF", overflowX: "auto" }}>
        {isFetching && !isLoading && <div className="h-0.5 w-full shrink-0" style={{ background: "#3B82F6" }} />}
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[900px] table-fixed">
            <thead>
              <tr className="border-b" style={{ borderColor: "#E5E7EB" }}>
                {([
                  { key: "name", label: "productName", minWidth: 200, width: "20%" },
                  { key: "sku", label: "sku", width: "11%" },
                  { key: "category", label: "category", noSort: true, width: "12%" },
                  { key: "price", label: "price", width: "11%" },
                  { key: "cost", label: "cost", noSort: true, width: "11%" },
                  { key: "stock", label: "stockQuantity", width: "12%" },
                  { key: "reorderPoint", label: "reorderLevel", noSort: true, width: "11%" },
                  { key: "lastRestocked", label: "lastUpdated", noSort: true, width: "12%" },
                ] as { key: string; label: string; width: string; minWidth?: number; noSort?: boolean; align?: string }[]).map(col => (
                  <th key={col.key} className={thStyle(col.align)} style={{ ...thBase, minWidth: col.minWidth, width: col.width }} onClick={() => !col.noSort && handleSort(col.key as SortCol)}>
                    <div className="inline-flex items-center gap-1 justify-start">
                      {col.label}
                      {!col.noSort && <SortIcon col={col.key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontSize: 14 }}>
              {isLoading
                ? Array.from({ length: 12 }).map((_, i) => (
                    <tr key={i} className="border-b" style={{ borderColor: "#E5E7EB" }}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="p-3 text-left">
                          <div
                            className="skeleton h-4 rounded"
                            style={{
                              width: `${60 + ((i * 8 + j) * 17 % 40)}%`,
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                : !data?.rows.length
                  ? (
                    <tr><td colSpan={8} className="p-12 text-center" style={{ color: "#45464c" }}>
                      No products match your filters.
                    </td></tr>
                  )
                  : data.rows.map((row) => {
                      const maxStockVal = row.reorderPoint * 2.5 || 100;
                      const percent = Math.min(100, (row.stock / maxStockVal) * 100);
                      const barColor = row.stock === 0 ? "#EF4444" : row.stock <= row.reorderPoint ? "#F97316" : "#10B981";
                      return (
                        <tr key={row.id} className="border-b transition-colors hover:bg-gray-50 cursor-pointer" style={{ borderColor: "#E5E7EB" }} onClick={() => setSelectedSku(row)}>
                          <td className="p-3 font-medium" style={{ color: "#000", minWidth: 200 }}>{row.name}</td>
                          <td className="p-3" style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, color: "#45464c" }}>{row.sku}</td>
                          <td className="p-3"><CategoryBadge cat={row.category} /></td>
                          <td className="p-3 text-left" style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, color: "#000" }}>${row.price.toFixed(2)}</td>
                          <td className="p-3 text-left" style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, color: "#45464c" }}>${(row.price * 0.65).toFixed(2)}</td>
                          <td className="p-3 text-left">
                            <div className="flex flex-col items-start gap-1 w-fit">
                              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, color: row.stock === 0 ? "#EF4444" : row.stock <= row.reorderPoint ? "#F97316" : "#000", fontWeight: 500 }}>
                                {row.stock.toLocaleString()}
                              </span>
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${percent}%`, backgroundColor: barColor }} />
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-left" style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, color: "#45464c" }}>{row.reorderPoint}</td>
                          <td className="p-3" style={{ fontSize: 13, color: "#45464c" }}>{row.lastRestocked}</td>
                        </tr>
                      );
                    })
              }
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t flex items-center justify-between shrink-0" style={{ borderColor: "#E5E7EB", fontSize: 13, color: "#45464c", background: "#FFFFFF" }}>
          <div>
            {data ? `Showing page ${data.page} of ${data.totalPages} · ${data.total.toLocaleString()} entries` : "Loading..."}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => store.goToPage(store.currentPage - 1)}
              disabled={store.currentPage === 1}
              className="px-3 py-1 border rounded transition-colors hover:bg-gray-50 disabled:opacity-40"
              style={{ borderColor: "#E5E7EB" }}
            >Previous</button>
            {data && Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
              const half = Math.floor(5 / 2);
              const start = Math.max(1, Math.min(store.currentPage - half, data.totalPages - 4));
              const p = start + i;
              return (
                <button
                  key={p}
                  onClick={() => store.goToPage(p)}
                  className="px-3 py-1 border rounded transition-colors"
                  style={{ borderColor: "#E5E7EB", background: p === store.currentPage ? "#111827" : "transparent", color: p === store.currentPage ? "#fff" : "#1b1b1d" }}
                >{p}</button>
              );
            })}
            {data && data.totalPages > 5 && <span className="px-2">...</span>}
            <button
              onClick={() => store.goToPage(store.currentPage + 1)}
              disabled={!data || store.currentPage === data.totalPages}
              className="px-3 py-1 border rounded transition-colors hover:bg-gray-50 disabled:opacity-40"
              style={{ borderColor: "#E5E7EB" }}
            >Next</button>
          </div>
        </div>
      </div>

      {selectedSku && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setSelectedSku(null)}>
          <div className="w-full max-w-md h-full bg-white shadow-2xl p-6 flex flex-col border-l" style={{ borderColor: "#E5E7EB" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: "#E5E7EB" }}>
              <div>
                <span className="text-sm font-semibold" style={{ color: "#3B82F6", fontFamily: "ui-monospace, monospace" }}>{selectedSku.sku}</span>
                <h2 className="text-xl font-bold mt-1 text-gray-900">SKU Specification</h2>
              </div>
              <button aria-label="Close details dialog" onClick={() => setSelectedSku(null)} className="w-8 h-8 rounded-md flex items-center justify-center border hover:bg-gray-50" style={{ borderColor: "#E5E7EB" }}>
                <X size={16} />
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">{selectedSku.name}</h3>
              <div className="flex gap-2 flex-wrap">
                <CategoryBadge cat={selectedSku.category} />
                <StockBadge stock={selectedSku.stock} />
              </div>
            </div>

            <div className="border rounded-xl p-5 mb-8" style={{ borderColor: "#E5E7EB", background: "#F8FAFC" }}>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Real-Time Inventory Metrics</div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                <div>
                  <div className="text-sm text-gray-500">Available Units</div>
                  <div className="text-xl font-bold mt-1 text-gray-900">{selectedSku.stock.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Unit Base Price</div>
                  <div className="text-xl font-bold mt-1 text-gray-900" style={{ fontFamily: "ui-monospace, monospace" }}>${selectedSku.price.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Asset Valuation</div>
                  <div className="text-xl font-bold mt-1 text-green-600" style={{ fontFamily: "ui-monospace, monospace" }}>${(selectedSku.price * selectedSku.stock).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Supply Lead Time</div>
                  <div className="text-xl font-bold mt-1 text-gray-900">3-5 Days</div>
                </div>
              </div>
            </div>

            <div className="border rounded-xl p-5 mb-8 bg-white" style={{ borderColor: "#E5E7EB" }}>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Logistics Facility Routing</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center border bg-gray-50" style={{ borderColor: "#E5E7EB" }}>
                  <MapPin size={18} className="text-gray-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{selectedSku.supplier}</div>
                  <div className="text-sm text-gray-500 mt-0.5">Last Restocked: {selectedSku.lastRestocked}</div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t flex gap-3" style={{ borderColor: "#E5E7EB" }}>
              <button
                onClick={() => handleRestock(selectedSku.id, selectedSku.name)}
                className="flex-1 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors"
                style={{ background: "#3B82F6", color: "#fff", height: 44 }}
              >
                Generate Requisition (+250)
              </button>
              <button
                onClick={() => setSelectedSku(null)}
                className="px-6 rounded-lg border text-sm font-semibold transition-colors hover:bg-gray-50"
                style={{ borderColor: "#E5E7EB", color: "#1b1b1d", height: 44 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className="fixed bottom-5 right-5 z-[999] px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm text-white"
          style={{
            background: toast.type === "success" ? "#10B981" : "#EF4444",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
          }}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </section>
  );
};

export default InventoryPage;
