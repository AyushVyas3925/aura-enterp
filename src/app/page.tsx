"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { CommandCenter } from "@/features/dashboard/components/CommandCenter";
import InventoryPage from "./inventory/page";
import { Settings, Bell, HelpCircle, BarChart2, Package } from "lucide-react";

type View = "dashboard" | "inventory";

const NAV_TABS: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Operational Command", icon: BarChart2 },
  { id: "inventory", label: "SKU Registry Grid", icon: Package },
];

const Home = function () {
  const [view, setView] = useState<View>("dashboard");

  // Pill position derived from actual rendered button dimensions
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0, ready: false });
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Run after paint so DOM dimensions are accurate
  useLayoutEffect(() => {
    const updatePill = () => {
      const idx = NAV_TABS.findIndex(t => t.id === view);
      const btn = btnRefs.current[idx];
      if (btn) {
        setPill({ left: btn.offsetLeft, top: btn.offsetTop, width: btn.offsetWidth, height: btn.offsetHeight, ready: true });
      }
    };

    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [view]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#F1F5F9", color: "#1b1b1d", fontFamily: "Inter, sans-serif" }}
    >
      {/* ── STICKY TOP HEADER ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}
      >
        {/* Row 1 – brand + utility icons */}
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <h1 style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.02em" }}>
            Aura Engine
          </h1>

          <div className="flex items-center gap-1">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors relative"
              style={{ color: "#4B5563" }}
              title="Notifications"
            >
              <Bell size={17} aria-hidden="true" />
              <span
                aria-label="3 notifications"
                className="absolute flex items-center justify-center rounded-full text-white font-bold"
                style={{
                  top: 5,
                  right: 5,
                  width: 14,
                  height: 14,
                  background: "#EF4444",
                  fontSize: 9,
                  lineHeight: 1,
                }}
              >
                3
              </span>
            </button>
            <button
              aria-label="Settings"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              style={{ color: "#4B5563" }}
            >
              <Settings size={17} />
            </button>
            <button
              aria-label="Help and Documentation"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              style={{ color: "#4B5563" }}
            >
              <HelpCircle size={17} />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center ml-1 shrink-0"
              style={{ background: "#1D4ED8" }}
            >
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>IO</span>
            </div>
          </div>
        </div>

        {/* Row 2 – tabs: pill follows actual button dimensions via refs */}
        <nav aria-label="Main navigation" className="relative px-4 md:px-6 pt-2 pb-3">
          <div
            role="tablist"
            aria-label="Application views"
            className="relative flex items-center gap-2"
          >

            {/* Sliding pill — positioned & sized by measured button DOM rect */}
            {pill.ready && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: pill.top,
                  left: pill.left,
                  width: pill.width,
                  height: pill.height,
                  background: "#1b1b1d",
                  borderRadius: 8,
                  transition: "left 0.22s cubic-bezier(0.4,0,0.2,1), width 0.22s cubic-bezier(0.4,0,0.2,1)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
            )}

            {NAV_TABS.map(({ id, label, icon: Icon }, idx) => {
              const active = view === id;
              return (
                <button
                  key={id}
                  id={`nav-${id}`}
                  role="tab"
                  aria-selected={active}
                  aria-controls={`panel-${id}`}
                  ref={el => { btnRefs.current[idx] = el; }}
                  onClick={() => setView(id)}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    background: "transparent",
                    color: active ? "#ffffff" : "#4B5563",
                    border: "none",
                    transition: "color 0.2s ease",
                  }}
                >
                  <Icon size={14} aria-hidden="true" strokeWidth={active ? 2.5 : 2} />
                  {label}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* ── PAGE CONTENT ── */}
      <main className="flex-1 overflow-hidden relative">
        <div
          id="panel-dashboard"
          role="tabpanel"
          aria-labelledby="nav-dashboard"
          className="absolute inset-0 overflow-y-auto p-4 md:p-6 transition-opacity duration-200"
          style={{
            opacity: view === "dashboard" ? 1 : 0,
            pointerEvents: view === "dashboard" ? "auto" : "none",
          }}
        >
          <CommandCenter />
        </div>

        <div
          id="panel-inventory"
          role="tabpanel"
          aria-labelledby="nav-inventory"
          className="absolute inset-0 overflow-y-auto p-4 md:p-6 transition-opacity duration-200"
          style={{
            opacity: view === "inventory" ? 1 : 0,
            pointerEvents: view === "inventory" ? "auto" : "none",
          }}
        >
          <InventoryPage />
        </div>
      </main>
    </div>
  );
};

export default Home;
