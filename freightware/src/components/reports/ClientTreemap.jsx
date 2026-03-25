'use client';

import { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import ReportCard from '@/components/shared/ReportCard';
import { shipments } from '@/data/mockShipments';
import { aggregateClientVolumes } from '@/utils/reportUtils';

function TreemapContent({ x, y, width, height, name, volume, shipmentCount, color }) {
  if (width < 40 || height < 30) return null;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={4} fill={color} opacity={0.2} stroke={color} strokeWidth={1.5} strokeOpacity={0.5} />
      <rect x={x} y={y} width={width} height={height} rx={4} fill={color} opacity={0.08} />
      {width > 70 && (
        <>
          <text x={x + 8} y={y + 18} fill={color} fontSize={12} fontWeight="600" fontFamily="var(--font-display)">
            {name}
          </text>
          <text x={x + 8} y={y + 34} fill="#9CA3AF" fontSize={10} fontFamily="var(--font-mono)">
            {volume?.toFixed(1)} m³ · {shipmentCount} shipments
          </text>
        </>
      )}
      {width <= 70 && width > 40 && (
        <text x={x + width / 2} y={y + height / 2} fill={color} fontSize={10} fontWeight="600" textAnchor="middle" dominantBaseline="middle">
          {name?.split(' ')[0]}
        </text>
      )}
    </g>
  );
}

function TreemapTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="bg-fw-surface-2 border border-fw-border rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-fw-text mb-1">{d.name}</p>
      <p style={{ color: d.color }}>Volume: {d.volume?.toFixed(1)} m³</p>
      <p className="text-fw-text-dim">Weight: {d.weight?.toLocaleString()} kg</p>
      <p className="text-fw-text-dim">Shipments: {d.shipmentCount} ({d.pieces} pieces)</p>
    </div>
  );
}

export default function ClientTreemap() {
  const data = useMemo(() => {
    const clients = aggregateClientVolumes(shipments);
    return [{ name: 'root', children: clients.map((c) => ({ ...c, size: c.volume })) }];
  }, []);

  const totalVolume = useMemo(
    () => shipments.reduce((sum, s) => sum + s.volume, 0).toFixed(1),
    []
  );

  return (
    <ReportCard
      id="client-treemap"
      title="Client Volume Portfolio"
      subtitle="Cargo volume contribution by client — sized proportionally"
      insight={`${totalVolume} m³ total across 8 clients`}
      insightColor="text-fw-cyan"
      helpText="A treemap sizes each rectangle proportional to the client's total cargo volume. Larger blocks mean higher volume. Hover to see volume, weight, and shipment count per client."
      footer="Larger rectangles represent higher volume contributors. Pacific Timber and Fraser Valley Agriculture dominate, accounting for over 45% of total volume."
    >
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          nameKey="name"
          content={<TreemapContent />}
          animationDuration={800}
        >
          <Tooltip content={<TreemapTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </ReportCard>
  );
}
