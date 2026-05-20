"use client";

import { useQuery } from "@tanstack/react-query";
import { useGridStore } from "@/store/gridStore";
import type { InventoryResponse } from "@/types";

export const useInventoryGrid = () => {
  const {
    debouncedSearch,
    category,
    maxStock,
    minPrice,
    maxPrice,
    sortCol,
    sortDir,
    currentPage,
  } = useGridStore();

  const params = new URLSearchParams({ page: String(currentPage), limit: "50" });
  if (debouncedSearch) params.set("search", debouncedSearch);
  if (category) params.set("category", category);
  if (maxStock !== null) params.set("maxStock", String(maxStock));
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);
  if (sortCol) {
    params.set("sortCol", sortCol);
    params.set("sortDir", sortDir ?? "asc");
  }

  return useQuery<InventoryResponse>({
    queryKey: ["inventory", params.toString()],
    queryFn: () =>
      fetch(`/api/inventory?${params.toString()}`).then((r) => r.json()),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}
