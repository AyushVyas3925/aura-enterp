export type { InventoryItem, Category } from "@/lib/inventoryData";
export { CATEGORIES } from "@/lib/inventoryData";

export type SortDir = "asc" | "desc" | null;

export type GridFilters = {
  search: string;
  category: string;
  maxStock: number | null;
  minPrice: string;
  maxPrice: string;
  sortCol: string;
  sortDir: SortDir;
  page: number;
};

export type InventoryResponse = {
  rows: import("@/lib/inventoryData").InventoryItem[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
};

export type AnalyticsResponse = {
  totalSKUs: number;
  totalInventoryValue: number;
  outOfStockCount: number;
  portfolioBreakdown: { name: string; value: number }[];
  top10: { name: string; stock: number; reorder: number; fullName: string }[];
};
