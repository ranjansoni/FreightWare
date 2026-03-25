'use client';

import { Flame, Snowflake, AlertTriangle, MapPin, Package } from 'lucide-react';
import { clientColors } from '@/utils/clientColors';

const DEST_COLORS = {
  Shanghai: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Tokyo: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Busan: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export default function DragOverlayCard({ shipment }) {
  if (!shipment) return null;
  const borderColor = clientColors[shipment.clientId] || '#888';

  return (
    <div
      className="w-64 rounded-lg border-2 border-fw-cyan bg-fw-surface p-3 shadow-xl shadow-fw-cyan/20 pointer-events-none"
      style={{ borderLeftColor: borderColor, borderLeftWidth: 4 }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono font-medium text-fw-cyan">
          {shipment.id}
        </span>
        <div className="flex items-center gap-1">
          {shipment.hazmat && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400">
              <Flame size={10} /> HAZ
            </span>
          )}
          {shipment.tempRange && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-400">
              <Snowflake size={10} />
            </span>
          )}
          {shipment.fragile && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400">
              <AlertTriangle size={10} />
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-fw-text-dim mt-1 truncate">{shipment.clientName}</p>
      <p className="text-[11px] text-fw-text-muted mt-0.5 truncate">{shipment.description}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border ${DEST_COLORS[shipment.destination] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
          <MapPin size={9} />
          {shipment.destination}
        </span>
        <span className="text-[10px] text-fw-text-muted flex items-center gap-0.5">
          <Package size={9} />
          {shipment.pieces}pc · {shipment.weight > 0 ? `${(shipment.weight / 1000).toFixed(1)}t` : '—'} · {shipment.volume.toFixed(1)}m³
        </span>
      </div>
    </div>
  );
}
