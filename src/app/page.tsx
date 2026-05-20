"use client";

import { useState } from "react";
import { CommandCenter } from "@/features/dashboard/components/CommandCenter";
import InventoryPage from "./inventory/page";
import { Package, BarChart2, Settings, Bell, LogOut, HelpCircle, LucideIcon } from "lucide-react";

type View = "dashboard" | "inventory";

const Home = function() {
  const [view, setView] = useState<View>("dashboard");

  const navItem = (id: View, IconComponent: LucideIcon, label: string) => {
    const active = view === id;
    return (
      <li>
        <button
          id={`nav-${id}`}
          onClick={() => setView(id)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors"
          style={{
            background: active ? "#dce2f3" : "transparent",
            color: active ? "#1b1b1d" : "#45464c",
            fontWeight: active ? 700 : 400,
            fontSize: 13,
          }}
        >
          <IconComponent size={18} strokeWidth={active ? 2.5 : 2} />
          {label}
        </button>
      </li>
    );
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F1F5F9", color: "#1b1b1d", fontFamily: "Inter, sans-serif" }}>
      <nav className="shrink-0 flex flex-col h-screen sticky top-0 border-r py-4" style={{ width: 240, background: "#F8FAFC", borderColor: "#c6c6cd" }}>
        <div className="px-6 mb-8">
          <h1 style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.02em" }}>Aura Engine</h1>
        </div>

        <div className="px-6 mb-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#1D4ED8" }}>
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>IO</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Inventory Ops</div>
            <div style={{ fontSize: 13, color: "#45464c" }}>Global Logistics</div>
          </div>
        </div>

        <ul className="flex-1 px-2 flex flex-col gap-1 mt-6">
          {navItem("dashboard", BarChart2, "Command Center")}
          {navItem("inventory", Package, "Inventory")}
        </ul>

        <div className="px-2 mt-auto">
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors hover:bg-gray-50" style={{ color: "#45464c", fontSize: 13 }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <main className="flex flex-col" style={{ width: "calc(100vw - 240px)" }}>
        <header className="flex justify-between items-center px-6 h-16 sticky top-0 z-50 border-b" style={{ background: "#FFFFFF", borderColor: "#c6c6cd" }}>
          <div className="flex items-center gap-4 ml-auto">
            <button className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-gray-50" style={{ color: "#45464c" }}>
              <Bell size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-gray-50" style={{ color: "#45464c" }}>
              <Settings size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-gray-50" style={{ color: "#45464c" }}>
              <HelpCircle size={18} />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#1D4ED8" }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>IO</span>
            </div>
          </div>
        </header>

        <div className="p-6 flex flex-col gap-8 overflow-y-auto" style={{ background: "#F1F5F9" }}>
          {view === "dashboard" ? <CommandCenter /> : <InventoryPage />}
        </div>
      </main>
    </div>
  );
};

export default Home;
