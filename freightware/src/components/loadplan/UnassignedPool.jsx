'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ChevronDown, ChevronUp, Package, CheckCircle2, Filter } from 'lucide-react';
import { getShipmentById } from '@/data/mockShipments';
import DraggableShipmentCard from './DraggableShipmentCard';
import HelpIcon from '@/components/shared/HelpIcon';

const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'Shanghai', label: 'Shanghai' },
  { id: 'Tokyo', label: 'Tokyo' },
  { id: 'Busan', label: 'Busan' },
  { id: 'hazmat', label: 'HAZMAT' },
  { id: 'temp', label: 'Temp Ctrl' },
];

export default function UnassignedPool({ shipmentIds, onHighlightShipment, onHighlightEnd }) {
  const [expanded, setExpanded] = useState(true);
  const [filter, setFilter] = useState('all');

  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned',
    data: { containerId: 'unassigned' },
  });

  const filtered = shipmentIds.filter((id) => {
    if (filter === 'all') return true;
    const s = getShipmentById(id);
    if (!s) return false;
    if (filter === 'hazmat') return s.hazmat;
    if (filter === 'temp') return !!s.tempRange;
    return s.destination === filter;
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border transition-all duration-200 ${
        isOver
          ? 'ring-2 ring-fw-cyan/40 border-fw-cyan/40 bg-fw-cyan/5'
          : 'border-fw-border bg-fw-surface'
      }`}
    >
      <div className="w-full flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-fw-cyan" />
          <span className="text-sm font-medium text-fw-text">Available Shipments</span>
          <HelpIcon
            text="These shipments are not assigned to any container. Drag them into a container column to add them to the load plan. New bookings and removed shipments appear here."
            position="bottom-right"
          />
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-fw-cyan/10 text-fw-cyan border border-fw-cyan/20">
            {shipmentIds.length}
          </span>
        </div>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="p-1 rounded-md hover:bg-fw-surface-2 transition-colors"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <ChevronUp size={16} className="text-fw-text-dim" /> : <ChevronDown size={16} className="text-fw-text-dim" />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-3">
          {shipmentIds.length === 0 ? (
            <div className="flex items-center gap-2 py-4 justify-center text-fw-green">
              <CheckCircle2 size={16} />
              <span className="text-sm">All shipments assigned</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                <Filter size={12} className="text-fw-text-muted" />
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={(e) => { e.stopPropagation(); setFilter(opt.id); }}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      filter === opt.id
                        ? 'bg-fw-cyan/20 text-fw-cyan border border-fw-cyan/30'
                        : 'bg-fw-bg text-fw-text-muted hover:text-fw-text-dim border border-transparent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto scrollbar-thin">
                {filtered.map((id) => {
                  const s = getShipmentById(id);
                  if (!s) return null;
                  return (
                    <DraggableShipmentCard
                      key={id}
                      shipment={s}
                      containerId="unassigned"
                      onHover={onHighlightShipment}
                      onHoverEnd={onHighlightEnd}
                      compact
                    />
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-xs text-fw-text-muted col-span-full py-2 text-center">
                    No shipments match this filter
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
