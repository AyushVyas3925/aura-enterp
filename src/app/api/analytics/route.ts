import { NextResponse } from "next/server";
import { getInventoryData } from "@/lib/inventoryData";

export async function GET() {
  const data = getInventoryData();

  let totalValue = 0;
  let outOfStock = 0;
  const byCategory: Record<string, number> = {};

  for (const item of data) {
    const val = item.price * item.stock;
    totalValue += val;
    if (item.stock === 0) outOfStock++;
    byCategory[item.category] = (byCategory[item.category] ?? 0) + val;
  }

  const portfolioBreakdown = Object.entries(byCategory).map(([name, value]) => ({
    name,
    value: Math.round(value),
  })).sort((a, b) => b.value - a.value);

  const top10 = [...data]
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 10)
    .map(item => ({
      name: item.name.length > 24 ? item.name.slice(0, 24) + '…' : item.name,
      stock: item.stock,
      reorder: item.reorderPoint,
      fullName: item.name,
    }));

  return NextResponse.json({
    totalSKUs: data.length,
    totalInventoryValue: Math.round(totalValue),
    outOfStockCount: outOfStock,
    portfolioBreakdown,
    top10,
  });
}
