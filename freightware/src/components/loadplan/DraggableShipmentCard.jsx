'use client';

import { useDraggable } from '@dnd-kit/core';
import { AlertTriangle, Flame, Snowflake, MapPin, Package, GripVertical } from 'lucide-react';
import { clientColors } from '@/utils/clientColors';

const DEST_COLORS = {
  Shanghai: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Tokyo: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Busan: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export default function DraggableShipmentCard({
  shipment,
  containerId,
  onHover,
  onHoverEnd,
  compact = false,
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: shipment.id,
    data: { shipment, fromContainerId: containerId },
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const borderColor = clientColors[shipment.clientId] || '#888';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg border transition-all ${
        isDragging
          ? 'opacity-40 border-fw-cyan shadow-lg shadow-fw-cyan/10 z-50'
          : 'border-fw-border hover:border-fw-cyan/40 bg-fw-surface hover:bg-fw-surface-2'
      } ${compact ? 'p-2' : 'p-3'}`}
      onMouseEnter={() => onHover?.(shipment.id)}
      onMouseLeave={() => onHoverEnd?.()}
    >
      <div
        className="absolute left-0 top-2 bottom-2 w-1 rounded-full"
        style={{ backgroundColor: borderColor }}
      />

      <div className="flex items-start gap-2 pl-2">
        <button
          className="mt-0.5 cursor-grab active:cursor-grabbing text-fw-text-muted hover:text-fw-text-dim flex-shrink-0 touch-none"
          {...listeners}
          {...attributes}
        >
          <GripVertical size={14} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono font-medium text-fw-cyan truncate">
              {shipment.id}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              {shipment.hazmat && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  <Flame size={10} />
                  HAZ
                </span>
              )}
              {shipment.tempRange && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <Snowflake size={10} />
                  {shipment.tempRange.min}°C
                </span>
              )}
              {shipment.fragile && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <AlertTriangle size={10} />
                </span>
              )}
            </div>
          </div>

          {!compact && (
            <p className="text-xs text-fw-text-dim mt-0.5 truncate">
              {shipment.clientName}
            </p>
          )}

          <p className="text-[11px] text-fw-text-muted mt-0.5 truncate">
            {shipment.description}
          </p>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border ${DEST_COLORS[shipment.destination] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              <MapPin size={9} />
              {shipment.destination}
            </span>
            <span className="text-[10px] text-fw-text-muted flex items-center gap-0.5">
              <Package size={9} />
              {shipment.pieces}pc
            </span>
            <span className="text-[10px] text-fw-text-muted">
              {shipment.weight > 0 ? `${(shipment.weight / 1000).toFixed(1)}t` : '—'}
            </span>
            <span className="text-[10px] text-fw-text-muted">
              {shipment.volume.toFixed(1)}m³
            </span>
            {shipment.priority === 'high' && (
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" title="High priority" />
            )}
            {shipment.priority === 'critical' && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" title="Critical priority" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
