import { create } from "zustand";
import type { SortDir } from "@/types";

type GridState = {
  searchInput: string;
  debouncedSearch: string;
  category: string;
  maxStock: number | null;
  minPrice: string;
  maxPrice: string;
  sortCol: string;
  sortDir: SortDir;
  currentPage: number;

  setSearchInput: (val: string) => void;
  applyDebouncedSearch: (val: string) => void;
  setCategory: (val: string) => void;
  setMaxStock: (val: number | null) => void;
  setPriceRange: (min: string, max: string) => void;
  toggleSort: (col: string) => void;
  goToPage: (n: number) => void;
  resetFilters: () => void;
};

const defaults = {
  searchInput: "",
  debouncedSearch: "",
  category: "",
  maxStock: null,
  minPrice: "",
  maxPrice: "",
  sortCol: "",
  sortDir: null as SortDir,
  currentPage: 1,
};

export const useGridStore = create<GridState>((set, get) => ({
  ...defaults,

  setSearchInput: (val) => set({ searchInput: val }),

  applyDebouncedSearch: (val) => set({ debouncedSearch: val, currentPage: 1 }),

  setCategory: (val) => set({ category: val, currentPage: 1 }),

  setMaxStock: (val) => set({ maxStock: val, currentPage: 1 }),

  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max, currentPage: 1 }),

  toggleSort: (col) => {
    const { sortCol, sortDir } = get();
    if (sortCol !== col) {
      set({ sortCol: col, sortDir: "asc", currentPage: 1 });
    } else if (sortDir === "asc") {
      set({ sortDir: "desc" });
    } else {
      set({ sortCol: "", sortDir: null });
    }
  },

  goToPage: (n) => set({ currentPage: n }),

  resetFilters: () => set({ ...defaults }),
}));
