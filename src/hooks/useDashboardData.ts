"use client";

import { useQuery } from "@tanstack/react-query";
import type { AnalyticsResponse } from "@/types";

export const useDashboardData = () => {
  return useQuery<AnalyticsResponse>({
    queryKey: ["analytics"],
    queryFn: () => fetch("/api/analytics").then((r) => r.json()),
    refetchInterval: 30_000,
    staleTime: 25_000,
  });
}
