'use client';

import { useDroppable } from '@dnd-kit/core';
import { Box, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { containerTypes } from '@/utils/containerSpecs';
import { getShipmentById } from '@/data/mockShipments';
import DraggableShipmentCard from './DraggableShipmentCard';
import HelpIcon from '@/components/shared/HelpIcon';

function CapacityBar({ label, value, max, unit }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const color =
    pct > 100 ? 'bg-red-500' : pct > 90 ? 'bg-amber-500' : 'bg-fw-green';

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[10px] text-fw-text-muted">{label}</span>
        <span className="text-[10px] font-mono text-fw-text-dim">
          {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value?.toLocaleString()}{unit} / {typeof max === 'number' && max % 1 !== 0 ? max.toFixed(1) : max?.toLocaleString()}{unit}
        </span>
      </div>
      <div className="w-full bg-fw-bg rounded-full h-1.5 overflow-hidden">
        <div
          className={`${color} h-1.5 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function ContainerColumn({
  container,
  shipmentIds,
  stats,
  validation,
  onHighlightShipment,
  onHighlightEnd,
  isActive,
  onSelect,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: container.id,
    data: { containerId: container.id },
  });

  const spec = containerTypes[container.type];

  const glowClass = isOver
    ? validation
      ? validation.allowed
        ? validation.warnings.length > 0
          ? 'ring-2 ring-amber-500/60 border-amber-500/60 bg-amber-500/5'
          : 'ring-2 ring-fw-green/60 border-fw-green/60 bg-fw-green/5'
        : 'ring-2 ring-red-500/60 border-red-500/60 bg-red-500/5'
      : 'ring-2 ring-fw-cyan/40 border-fw-cyan/40'
    : isActive
      ? 'border-fw-cyan/50 bg-fw-cyan/5'
      : 'border-fw-border';

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border transition-all duration-200 ${glowClass} bg-fw-surface min-h-[300px]`}
      onClick={() => onSelect?.(container.id)}
    >
      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-fw-border/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Box size={14} className="text-fw-cyan" />
            <span className="text-sm font-mono font-semibold text-fw-text">
              {container.id}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-fw-text-dim px-2 py-0.5 rounded bg-fw-bg">
              {spec?.name}
            </span>
            <HelpIcon
              text="Drag shipments into this container. Green glow = safe to drop. Amber = allowed with warnings. Red = constraint violated (blocked). Capacity bars show weight and volume usage in real-time."
              position="bottom"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <CapacityBar
            label="Weight"
            value={stats?.weight || 0}
            max={spec?.maxWeight || 1}
            unit="kg"
          />
          <CapacityBar
            label="Volume"
            value={stats?.volume || 0}
            max={spec?.volume || 1}
            unit="m³"
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-fw-text-muted">
            {stats?.count || 0} shipment{(stats?.count || 0) !== 1 ? 's' : ''}
          </span>
          <span className="text-xs font-mono font-medium text-fw-cyan">
            {stats?.utilization?.toFixed(1) || '0.0'}%
          </span>
        </div>
      </div>

      {/* Drop feedback message */}
      {isOver && validation && (
        <div className={`px-3 py-1.5 text-[11px] flex items-center gap-1.5 ${
          validation.allowed
            ? validation.warnings.length > 0
              ? 'bg-amber-500/10 text-amber-400'
              : 'bg-fw-green/10 text-fw-green'
            : 'bg-red-500/10 text-red-400'
        }`}>
          {validation.allowed ? (
            validation.warnings.length > 0 ? (
              <>
                <AlertTriangle size={12} />
                <span>{validation.warnings[0]?.message}</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={12} />
                <span>Safe to drop</span>
              </>
            )
          ) : (
            <>
              <AlertCircle size={12} />
              <span>{validation.errors[0]?.message}</span>
            </>
          )}
        </div>
      )}

      {/* Shipment list */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[400px] scrollbar-thin">
        {shipmentIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-fw-text-muted">
            <Box size={24} className="mb-2 opacity-40" />
            <p className="text-xs">Drag shipments here</p>
          </div>
        ) : (
          shipmentIds.map((id) => {
            const s = getShipmentById(id);
            if (!s) return null;
            return (
              <DraggableShipmentCard
                key={id}
                shipment={s}
                containerId={container.id}
                onHover={onHighlightShipment}
                onHoverEnd={onHighlightEnd}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
