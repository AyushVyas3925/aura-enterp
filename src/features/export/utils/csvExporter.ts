import Papa from "papaparse";

type ExportParams = {
  search: string;
  category: string;
  maxStock: number | null;
  minPrice: string;
  maxPrice: string;
};

export const exportFilteredCSV = async (filters: ExportParams): Promise<number> => {
  const p = new URLSearchParams();
  if (filters.search) p.set("search", filters.search);
  if (filters.category) p.set("category", filters.category);
  if (filters.maxStock !== null) p.set("maxStock", String(filters.maxStock));
  if (filters.minPrice) p.set("minPrice", filters.minPrice);
  if (filters.maxPrice) p.set("maxPrice", filters.maxPrice);

  const res = await fetch(`/api/inventory/export?${p.toString()}`);
  if (!res.ok) throw new Error("Export failed — server returned " + res.status);

  const { rows, total } = await res.json();

  const csv = Papa.unparse(rows, { header: true });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `aura-inventory-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return total;
}
