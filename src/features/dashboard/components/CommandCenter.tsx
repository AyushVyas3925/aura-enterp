"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
  PieChart, Pie
} from 'recharts';

export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000)     return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000)         return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

function KpiCard({ label, value, exactValue, borderColor }: { label: string; value: string; exactValue?: string; borderColor: string }) {
  return (
    <div className="border rounded-xl p-6 flex flex-col justify-between" style={{ background: "#FFFFFF", borderColor: "#E5E7EB", borderLeftColor: borderColor, borderLeftWidth: 4 }} title={exactValue}>
      <div style={{ color: "#6B7280", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", color: "#111827" }}>{value}</div>
    </div>
  );
}

function getBarColor(stock: number, reorder: number): string {
  if (stock === 0)          return '#EF4444'; // Red   — Out of stock
  if (stock <= reorder)     return '#F97316'; // Orange — Below reorder level
  if (stock <= reorder * 2) return '#FBBF24'; // Amber  — Getting close
  return '#34D399';                           // Green  — Safe
}

const CATEGORY_COLORS: Record<string, string> = {
  'Electronics':     '#3B82F6',
  'Apparel':         '#8B5CF6',
  'Furniture':       '#F59E0B',
  'Food & Beverage': '#10B981',
  'Sports':          '#F43F5E',
  'Home & Garden':   '#EAB308',
  'Automotive':      '#0EA5E9',
  'Health & Beauty': '#EC4899',
  'Office Supplies': '#6B7280',
  'Toys & Games':    '#FB923C'
};



export function CommandCenter() {
  const { data, isLoading, isError } = useDashboardData();

  if (isError) return (
    <div className="rounded-lg p-6 text-center border" style={{ borderColor: "#ffdad6", background: "#FFFFFF", color: "#ba1a1a", fontSize: 14 }}>
      Failed to load analytics data.
    </div>
  );

  return (
    <section>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 20 }}>
        Command Center
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="skeleton rounded-xl h-[104px]" />)
        ) : (
          <>
            <KpiCard
              label="Total SKUs Active"
              value={data!.totalSKUs.toLocaleString()}
              borderColor="#3B82F6"
            />
            <KpiCard
              label="Total Inventory Value"
              value={formatCompactCurrency(data!.totalInventoryValue)}
              exactValue={`$${data!.totalInventoryValue.toLocaleString()}`}
              borderColor="#10B981"
            />
            <KpiCard
              label="Out of Stock Alerts"
              value={data!.outOfStockCount.toLocaleString()}
              borderColor="#EF4444"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-6">
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
            Restock Priority
          </p>
          <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 16 }}>
            Top 10 products with lowest stock levels
          </p>
          
          <div className="flex-1 min-h-[300px]">
            {isLoading ? (
              <div className="skeleton rounded-lg h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data!.top10} layout="vertical" margin={{ top: 4, right: 24, left: 155, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={[0, (dataMax: number) => Math.max(dataMax, 65)]} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} width={150} />
                  <Tooltip
                    cursor={{ fill: 'rgba(0, 0, 0, 0.03)', radius: 4 }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      const color = getBarColor(d.stock, d.reorder);
                      const status = d.stock === 0 ? 'OUT OF STOCK'
                                   : d.stock <= d.reorder ? 'BELOW REORDER LEVEL'
                                   : d.stock <= d.reorder * 2 ? 'APPROACHING REORDER'
                                   : 'SAFE';
                      return (
                        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 14px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                          <p style={{ fontWeight: 600, marginBottom: 6, color: '#111827' }}>{d.fullName}</p>
                          <p>Stock: <strong style={{ color }}>{d.stock} units</strong></p>
                          <p style={{ color: '#6B7280' }}>Reorder at: {d.reorder} units</p>
                          <p style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color, background: color + '18', padding: '2px 6px', borderRadius: 4, display: 'inline-block' }}>{status}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="stock" radius={[0, 6, 6, 0]} maxBarSize={22} minPointSize={6} isAnimationActive={false} background={{ fill: '#F3F4F6', radius: 6 }}>
                    <LabelList dataKey="stock" position="right" fontSize={11} fill="#6B7280" fontWeight={600} />
                    {data!.top10.map((entry, index) => <Cell key={index} fill={getBarColor(entry.stock, entry.reorder)} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
            {[
              { color: '#EF4444', label: 'Out of stock' },
              { color: '#F97316', label: 'Below reorder level' },
              { color: '#FBBF24', label: 'Approaching reorder' },
              { color: '#34D399', label: 'Safe' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6B7280' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24, height: '100%' }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
            Portfolio Distribution
          </p>
          <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 16 }}>
            Inventory valuation by category (price × stock)
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isLoading ? (
                <div className="skeleton rounded-full h-[180px] w-[180px] mx-auto mt-6" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={data!.portfolioBreakdown}
                      cx="50%" cy="50%"
                      outerRadius={85} innerRadius={0}
                      dataKey="value"
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      isAnimationActive={false}
                    >
                      {data!.portfolioBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? '#6B7280'} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const { name, value } = payload[0].payload;
                        const pct = ((value / data!.totalInventoryValue) * 100).toFixed(1);
                        const color = CATEGORY_COLORS[name] ?? '#6B7280';
                        return (
                          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 14px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                            <p style={{ fontWeight: 600, color, marginBottom: 4 }}>{name}</p>
                            <p>Value: <strong>${value.toLocaleString()}</strong></p>
                            <p style={{ color: '#6B7280' }}>Portfolio share: {pct}%</p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px 16px', width: '100%', borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton h-4 rounded w-full" />)
              ) : (
                data!.portfolioBreakdown.map(({ name, value }) => {
                  const pct = ((value / data!.totalInventoryValue) * 100).toFixed(1);
                  const color = CATEGORY_COLORS[name] ?? '#6B7280';
                  return (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#374151', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', flex: 1 }} title={name}>{name}</span>
                      <span style={{ fontSize: 11, color: '#6B7280', fontVariantNumeric: 'tabular-nums', fontWeight: 600, flexShrink: 0 }}>{pct}%</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
