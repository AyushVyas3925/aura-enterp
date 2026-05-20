import { NextRequest, NextResponse } from "next/server";
import { getInventoryData, InventoryItem } from "@/lib/inventoryData";

const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const category = searchParams.get("category") ?? "";
  const maxStock = searchParams.get("maxStock");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  let data = getInventoryData();

  if (search) {
    data = data.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.sku.toLowerCase().includes(search)
    );
  }
  if (category) data = data.filter((i) => i.category === category);
  if (maxStock) {
    const n = parseInt(maxStock);
    if (!isNaN(n)) data = data.filter((i) => i.stock <= n);
  }
  if (minPrice) {
    const n = parseFloat(minPrice);
    if (!isNaN(n)) data = data.filter((i) => i.price >= n);
  }
  if (maxPrice) {
    const n = parseFloat(maxPrice);
    if (!isNaN(n)) data = data.filter((i) => i.price <= n);
  }

  const exportRows = data.map((item: InventoryItem) => ({
    SKU_ID: item.id,
    SKU_Code: item.sku,
    Product_Name: item.name,
    Category: item.category,
    Price_USD: item.price,
    Stock_Count: item.stock,
    Reorder_Point: item.reorderPoint,
    Supplier: item.supplier,
    Last_Restocked: item.lastRestocked,
  }));

  return NextResponse.json({ rows: exportRows, total: exportRows.length });
};

export { GET };
