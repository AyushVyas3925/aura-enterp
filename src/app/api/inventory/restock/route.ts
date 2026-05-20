import { NextRequest, NextResponse } from "next/server";
import { getInventoryData } from "@/lib/inventoryData";

const POST = async (req: NextRequest) => {
  try {
    const { id, quantity } = await req.json();
    const data = getInventoryData();
    const item = data.find((i) => i.id === id);
    
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    
    item.stock += quantity;
    return NextResponse.json({ success: true, item });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
};

export { POST };
