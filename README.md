# ⚡ Aura Engine

**Enterprise Inventory Command Center** — a high-performance, real-time inventory management dashboard built for operational scale. Manage 50,000+ SKUs with intelligent search, live analytics, and instant data export.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-Private-red)

---

## 🚀 Live Demo

> **[aura-engine.vercel.app](https://aura-engine.vercel.app)** _(if deployed)_

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)

---

## 🔍 Overview

Aura Engine is a **Next.js 15 App Router** application purpose-built for enterprise inventory operations. It provides two primary views:

| View | Description |
|------|-------------|
| **Operational Command** | Real-time analytics dashboard with KPI cards, portfolio breakdown charts, and top-performing SKU visualizations |
| **SKU Registry Grid** | Full-featured data grid with server-side pagination, multi-column sorting, faceted filtering, and CSV export across 50,000+ inventory items |

---

## ✨ Key Features

### 📊 Operational Command Dashboard
- **Live KPI Cards** — Total SKUs, inventory value, out-of-stock & low-stock alerts
- **Portfolio Breakdown** — Category distribution via interactive Recharts pie/bar charts
- **Top 10 SKUs** — Stock vs. reorder-point comparison with drill-down details

### 📦 SKU Registry Grid
- **50,000+ Row Support** — Server-side pagination with zero client-side lag
- **Intelligent Search** — Debounced full-text search across SKU names & identifiers
- **Multi-Column Sorting** — Ascending/descending sort on any column
- **Faceted Filters** — Filter by category, stock thresholds, and price range
- **CSV Export** — One-click export of the full filtered dataset (not just the visible page)

### ⚙️ Engineering Highlights
- **Module-Level Data Caching** — Shared 50k-item dataset generated once per server process via `lib/inventoryData.ts`, reused across all API routes
- **Custom Debounce Hook** — Purpose-built `useDebounce` with ref-based cleanup to avoid React 19 + App Router edge cases
- **Zustand State Management** — Lightweight, type-safe client state for grid filters and pagination
- **TanStack Query v5** — `placeholderData` strategy keeps the previous page visible during fetches — no empty-table flash
- **TanStack Table v8** — Headless table primitives for full rendering control

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) |
| **UI Library** | [React 19](https://react.dev) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) |
| **Charts** | [Recharts 3](https://recharts.org) |
| **Data Grid** | [TanStack Table 8](https://tanstack.com/table) |
| **Server State** | [TanStack Query 5](https://tanstack.com/query) |
| **Client State** | [Zustand 5](https://zustand.docs.pmnd.rs) |
| **CSV Export** | [PapaParse 5](https://www.papaparse.com) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Fonts** | [Inter](https://fonts.google.com/specimen/Inter) (via `next/font`) |
| **Mock Data** | [@faker-js/faker](https://fakerjs.dev) |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client (React 19)             │
│                                                 │
│  ┌──────────────┐  ┌────────────────────────┐   │
│  │  CommandCenter│  │   SKU Registry Grid    │   │
│  │  (Dashboard)  │  │  (TanStack Table)      │   │
│  └──────┬───────┘  └──────────┬─────────────┘   │
│         │                     │                  │
│  ┌──────┴─────────────────────┴──────────────┐   │
│  │          TanStack Query v5                │   │
│  │       (caching, refetch, placeholderData) │   │
│  └──────────────────┬────────────────────────┘   │
│                     │                            │
│  ┌──────────────────┴────────────────────────┐   │
│  │           Zustand Store                   │   │
│  │    (filters, pagination, sort state)      │   │
│  └───────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────┘
                      │  HTTP (JSON)
┌─────────────────────┴───────────────────────────┐
│               Server (Next.js API Routes)        │
│                                                  │
│  /api/analytics ───┐                             │
│  /api/inventory ───┼──► lib/inventoryData.ts     │
│  /api/inventory/   │    (module-level cache,     │
│       export ──────┘     50k items, Faker.js)    │
└──────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or yarn / pnpm / bun)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/aura-engine.git
cd aura-engine

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## 📁 Project Structure

```
aura-engine/
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analytics/      # GET — dashboard KPIs & chart data
│   │   │   └── inventory/
│   │   │       ├── route.ts    # GET — paginated, filtered, sorted inventory
│   │   │       └── export/
│   │   │           └── route.ts # GET — full filtered dataset (CSV export)
│   │   ├── inventory/
│   │   │   └── page.tsx        # SKU Registry Grid view
│   │   ├── globals.css         # Global styles & Tailwind directives
│   │   ├── layout.tsx          # Root layout (Inter font, metadata, providers)
│   │   ├── page.tsx            # Main shell — tab navigation between views
│   │   └── providers.tsx       # React Query provider wrapper
│   ├── components/             # Shared/reusable UI components
│   ├── features/
│   │   ├── dashboard/
│   │   │   └── components/
│   │   │       └── CommandCenter.tsx  # Analytics dashboard with charts
│   │   └── export/
│   │       └── utils/          # CSV export utilities (PapaParse)
│   ├── hooks/
│   │   ├── useDashboardData.ts # TanStack Query hook for analytics
│   │   ├── useDebounce.ts      # Custom debounce with ref-based cleanup
│   │   └── useInventoryGrid.ts # TanStack Query hook for grid data
│   ├── lib/
│   │   └── inventoryData.ts    # Faker-generated 50k-item dataset (cached)
│   ├── store/
│   │   └── gridStore.ts        # Zustand store for grid filters & pagination
│   └── types/
│       └── index.ts            # Shared TypeScript types & interfaces
├── Prompts.md                  # AI-assisted development decision log
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics` | Returns dashboard KPIs: total SKUs, inventory value, out-of-stock count, low-stock count, category breakdown, and top 10 SKUs |
| `GET` | `/api/inventory` | Returns paginated, filtered, sorted inventory rows. Supports query params: `search`, `category`, `maxStock`, `minPrice`, `maxPrice`, `sortCol`, `sortDir`, `page`, `limit` |
| `GET` | `/api/inventory/export` | Returns the complete filtered dataset (bypasses pagination) for CSV export |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software owned by **ProdeskIT / Aura Enterprise**.

---

<p align="center">
  Built with ❤️ by the <strong>Aura Enterprise</strong> team
</p>
