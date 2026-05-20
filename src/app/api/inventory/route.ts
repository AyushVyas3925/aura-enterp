import { NextRequest, NextResponse } from "next/server";
import { getInventoryData, InventoryItem } from "@/lib/inventoryData";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50"));
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const category = searchParams.get("category") ?? "";
  const maxStock = searchParams.get("maxStock");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sortCol = searchParams.get("sortCol") ?? "";
  const sortDir = searchParams.get("sortDir") ?? "asc";

  let data = getInventoryData();

  if (search) {
    data = data.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.sku.toLowerCase().includes(search) ||
        item.supplier.toLowerCase().includes(search)
    );
  }

  if (category) {
    data = data.filter((item) => item.category === category);
  }

  if (maxStock !== null && maxStock !== "") {
    const n = parseInt(maxStock);
    if (!isNaN(n)) data = data.filter((item) => item.stock <= n);
  }

  if (minPrice !== null && minPrice !== "") {
    const n = parseFloat(minPrice);
    if (!isNaN(n)) data = data.filter((item) => item.price >= n);
  }

  if (maxPrice !== null && maxPrice !== "") {
    const n = parseFloat(maxPrice);
    if (!isNaN(n)) data = data.filter((item) => item.price <= n);
  }

  if (sortCol) {
    data = [...data].sort((a, b) => {
      const av = a[sortCol as keyof InventoryItem];
      const bv = b[sortCol as keyof InventoryItem];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "desc" ? bv - av : av - bv;
      }
      return sortDir === "desc"
        ? String(bv).localeCompare(String(av))
        : String(av).localeCompare(String(bv));
    });
  }

  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const rows = data.slice(offset, offset + limit);

  return NextResponse.json({ rows, total, page, totalPages, limit });
}
