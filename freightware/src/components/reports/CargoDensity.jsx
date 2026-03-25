'use client';

import { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from 'recharts';
import ReportCard from '@/components/shared/ReportCard';
import { shipments } from '@/data/mockShipments';
import { buildDensityData } from '@/utils/reportUtils';
import { clientColors } from '@/utils/clientColors';

function DensityTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const density = d.volume > 0 ? Math.round(d.weight / d.volume) : 0;
  return (
    <div className="bg-fw-surface-2 border border-fw-border rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-fw-text mb-1">
        <span className="font-mono">{d.id}</span> — {d.clientName}
      </p>
      <p className="text-fw-text-dim">{d.description}</p>
      <div className="mt-1 space-y-0.5">
        <p style={{ color: d.color }}>Weight: {d.weight.toLocaleString()} kg</p>
        <p style={{ color: d.color }}>Volume: {d.volume.toFixed(2)} m³</p>
        <p className="text-fw-text-dim">Density: {density} kg/m³</p>
        <p className="text-fw-text-dim">Pieces: {d.pieces}</p>
      </div>
    </div>
  );
}

export default function CargoDensity() {
  const data = useMemo(() => buildDensityData(shipments), []);

  const clientGroups = useMemo(() => {
    const groups = {};
    for (const d of data) {
      if (!groups[d.clientId]) groups[d.clientId] = { name: d.clientName, color: d.color, data: [] };
      groups[d.clientId].data.push(d);
    }
    return Object.values(groups);
  }, [data]);

  return (
    <ReportCard
      id="cargo-density"
      title="Cargo Density Analysis"
      subtitle="Weight vs. volume per shipment — bubble size = piece count"
      insight="Optimal packing requires mixing heavy-compact and light-bulky cargo"
      insightColor="text-fw-amber"
      helpText="Each bubble is one shipment. Position shows weight (x-axis) vs. volume (y-axis), and bubble size represents piece count. The dashed line at 250 kg/m³ separates weight-constrained (above) from volume-constrained (below) shipments."
      footer="Shipments above the 250 kg/m³ density line are weight-constrained (fill weight limit before volume). Below the line are volume-constrained (fill space before weight). The optimizer balances both in each container."
      chartHeight="h-96"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
          <XAxis
            type="number"
            dataKey="weight"
            name="Weight"
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            axisLine={{ stroke: '#2A3450' }}
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}t`}
            label={{ value: 'Weight (tonnes)', position: 'bottom', offset: 5, fill: '#6B7280', fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="volume"
            name="Volume"
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            axisLine={{ stroke: '#2A3450' }}
            tickFormatter={(v) => `${v}m³`}
            label={{ value: 'Volume (m³)', angle: -90, position: 'insideLeft', offset: 0, fill: '#6B7280', fontSize: 11 }}
          />
          <ZAxis type="number" dataKey="pieces" range={[40, 300]} />
          <Tooltip content={<DensityTooltip />} />

          {/* Density reference line: 250 kg/m³ means weight = 250 * volume */}
          <ReferenceLine
            segment={[{ x: 0, y: 0 }, { x: 6000, y: 24 }]}
            stroke="#F59E0B"
            strokeDasharray="6 4"
            strokeOpacity={0.4}
          >
            <Label value="250 kg/m³" position="end" fill="#F59E0B" fontSize={10} />
          </ReferenceLine>

          {clientGroups.map((group) => (
            <Scatter
              key={group.name}
              name={group.name}
              data={group.data}
              fill={group.color}
              fillOpacity={0.7}
              strokeWidth={1}
              stroke={group.color}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </ReportCard>
  );
}
