'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import ReportCard from '@/components/shared/ReportCard';
import { shipments } from '@/data/mockShipments';
import { aggregateByDestination, aggregateByCargo } from '@/utils/reportUtils';

function MixTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="bg-fw-surface-2 border border-fw-border rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-fw-text mb-1" style={{ color: d.color }}>{d.name}</p>
      <p className="text-fw-text-dim">Volume: {d.value} m³</p>
      {d.count !== undefined && <p className="text-fw-text-dim">Shipments: {d.count}</p>}
    </div>
  );
}

function renderOuterLabel({ cx, cy, midAngle, outerRadius, name, value }) {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#9CA3AF"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={11}
      fontFamily="var(--font-mono)"
    >
      {name} ({value} m³)
    </text>
  );
}

export default function DestinationMix() {
  const destData = useMemo(() => aggregateByDestination(shipments), []);
  const cargoData = useMemo(() => aggregateByCargo(shipments), []);

  const totalVolume = useMemo(
    () => shipments.reduce((sum, s) => sum + s.volume, 0).toFixed(1),
    []
  );

  return (
    <ReportCard
      id="destination-mix"
      title="Destination & Cargo Type Distribution"
      subtitle="Outer ring: destination by volume — Inner ring: cargo category mix"
      insight={`${totalVolume} m³ across ${shipments.length} shipments to 3 destinations`}
      insightColor="text-fw-cyan"
      helpText="Nested doughnut chart: the outer ring shows volume distribution by destination port, the inner ring shows cargo category breakdown (standard, temperature-controlled, HAZMAT). The center shows total volume."
      footer="Shanghai dominates as the primary destination. Standard dry cargo makes up the bulk, with meaningful segments for temperature-controlled (frozen seafood) and HAZMAT (industrial chemicals) requiring special handling."
      chartHeight="h-96"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Inner ring: cargo type */}
          <Pie
            data={cargoData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            animationDuration={1000}
          >
            {cargoData.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.6} stroke={entry.color} strokeWidth={1} />
            ))}
          </Pie>

          {/* Outer ring: destination */}
          <Pie
            data={destData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={95}
            outerRadius={130}
            paddingAngle={3}
            label={renderOuterLabel}
            animationDuration={1200}
            animationBegin={200}
          >
            {destData.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.75} stroke={entry.color} strokeWidth={1.5} />
            ))}
          </Pie>

          <Tooltip content={<MixTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
            payload={[
              ...destData.map((d) => ({ value: d.name, type: 'rect', color: d.color })),
              ...cargoData.map((d) => ({ value: d.name, type: 'circle', color: d.color })),
            ]}
          />

          {/* Center label */}
          <text x="50%" y="48%" textAnchor="middle" fill="#E5E7EB" fontSize={16} fontWeight="bold" fontFamily="var(--font-display)">
            {totalVolume} m³
          </text>
          <text x="50%" y="56%" textAnchor="middle" fill="#6B7280" fontSize={10} fontFamily="var(--font-mono)">
            {shipments.length} shipments
          </text>
        </PieChart>
      </ResponsiveContainer>
    </ReportCard>
  );
}
