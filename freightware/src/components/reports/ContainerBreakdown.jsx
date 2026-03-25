'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import ReportCard from '@/components/shared/ReportCard';
import { optimizationResult } from '@/data/mockOptimizationResult';
import { shipments } from '@/data/mockShipments';
import { clients } from '@/data/mockClients';
import { clientColors } from '@/utils/clientColors';
import { buildContainerComposition } from '@/utils/reportUtils';

function CompositionTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-fw-surface-2 border border-fw-border rounded-lg px-3 py-2 text-xs shadow-lg min-w-[160px]">
      <p className="font-medium text-fw-text mb-1.5">{label}</p>
      {payload
        .filter((p) => p.value > 0)
        .sort((a, b) => b.value - a.value)
        .map((entry) => {
          const clientName = entry.payload[`${entry.dataKey}_name`] || entry.dataKey;
          return (
            <div key={entry.dataKey} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: entry.fill || entry.color }} />
                <span className="text-fw-text-dim">{clientName}</span>
              </span>
              <span style={{ color: entry.fill || entry.color }} className="font-mono">
                {entry.value} m³
              </span>
            </div>
          );
        })}
    </div>
  );
}

export default function ContainerBreakdown() {
  const data = useMemo(
    () => buildContainerComposition(optimizationResult.containersUsed, shipments),
    []
  );

  const clientIds = useMemo(() => {
    const ids = new Set();
    for (const row of data) {
      for (const key of Object.keys(row)) {
        if (key.startsWith('CLT-') && !key.includes('_name')) ids.add(key);
      }
    }
    return [...ids];
  }, [data]);

  return (
    <ReportCard
      id="container-breakdown"
      title="Container Composition"
      subtitle="Volume contribution by client per container — stacked horizontal"
      insight="3–4 clients share each container — true LCL consolidation"
      insightColor="text-fw-purple"
      helpText="Horizontal stacked bars show how each container's volume is divided among clients. Multiple colors per bar means true LCL consolidation — multiple clients sharing one container efficiently."
      footer="Each color segment represents one client's cargo volume. The dashed line marks the container's volume capacity. Efficient consolidation mixes complementary cargo types."
      chartHeight="h-72"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" barCategoryGap="25%" margin={{ left: 10, right: 20 }}>
          <XAxis
            type="number"
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            axisLine={{ stroke: '#2A3450' }}
            tickFormatter={(v) => `${v} m³`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'var(--font-mono)' }}
            axisLine={{ stroke: '#2A3450' }}
            width={70}
          />
          <Tooltip content={<CompositionTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            formatter={(value) => {
              const client = clients.find((c) => c.id === value);
              return client ? client.name : value;
            }}
          />

          {clientIds.map((cid) => (
            <Bar
              key={cid}
              dataKey={cid}
              stackId="volume"
              fill={clientColors[cid]}
              fillOpacity={0.75}
              radius={0}
              animationDuration={1000}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ReportCard>
  );
}
