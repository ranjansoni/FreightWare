'use client';

import { useState, useMemo } from 'react';
import { Eye, Filter } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import Badge from '@/components/shared/Badge';
import HelpIcon from '@/components/shared/HelpIcon';
import { useApp } from '@/context/AppContext';
import { clientColors } from '@/utils/clientColors';
import { formatDimensionsShort, formatDate } from '@/utils/formatters';

const STATUS_DOTS = {
  confirmed: 'bg-fw-green',
  clean: 'bg-fw-green',
  'auto-corrected': 'bg-fw-amber',
  flagged: 'bg-fw-red',
  'needs-review': 'bg-fw-red',
  'cleaning-required': 'bg-fw-red',
  loaded: 'bg-fw-cyan',
};

export default function ShipmentTable({ onSelect }) {
  const { shipments } = useApp();
  const [clientFilter, setClientFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [destFilter, setDestFilter] = useState('');
  const [search, setSearch] = useState('');
  const [flagsOnly, setFlagsOnly] = useState(false);

  const clients = useMemo(
    () => [...new Set(shipments.map((s) => s.clientName))].sort(),
    [shipments]
  );
  const destinations = useMemo(
    () => [...new Set(shipments.map((s) => s.destination))].sort(),
    [shipments]
  );

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      if (clientFilter && s.clientName !== clientFilter) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      if (priorityFilter && s.priority !== priorityFilter) return false;
      if (destFilter && s.destination !== destFilter) return false;
      if (flagsOnly && s.aiFlags.length === 0) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          s.id.toLowerCase().includes(q) ||
          s.clientName.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [shipments, clientFilter, statusFilter, priorityFilter, destFilter, flagsOnly, search]);

  const columns = [
    {
      key: 'status',
      label: '',
      width: '36px',
      sortable: false,
      render: (row) => (
        <div className="flex items-center justify-center">
          <div className={`w-2.5 h-2.5 rounded-full ${STATUS_DOTS[row.status] || STATUS_DOTS[row.cleaningStatus] || 'bg-fw-text-muted'}`} />
        </div>
      ),
    },
    {
      key: 'id',
      label: 'ID',
      render: (row) => (
        <span className="font-mono text-xs">{row.id.replace('SHP-2026-', '')}</span>
      ),
    },
    {
      key: 'clientName',
      label: 'Client',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: clientColors[row.clientId] }}
          />
          <span className="truncate max-w-32">{row.clientName}</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (
        <span className="truncate max-w-40 block">{row.description}</span>
      ),
    },
    { key: 'pieces', label: 'Pcs' },
    {
      key: 'dimensions',
      label: 'Dims (L×W×H)',
      sortable: false,
      render: (row) => (
        <span className="font-mono text-xs">
          {formatDimensionsShort(row.manifestDimensions)}
        </span>
      ),
    },
    {
      key: 'weight',
      label: 'Weight',
      render: (row) => (
        <span className="font-mono text-xs">
          {row.weight ? `${row.weight.toLocaleString()}kg` : '—'}
        </span>
      ),
    },
    {
      key: 'volume',
      label: 'Vol (m³)',
      render: (row) => (
        <span className="font-mono text-xs">{row.volume.toFixed(1)}</span>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (row) => <Badge status={row.priority}>{row.priority}</Badge>,
    },
    { key: 'destination', label: 'Dest' },
    {
      key: 'deliveryWindow',
      label: 'Sailing',
      render: (row) => (
        <span className="text-xs">{formatDate(row.deliveryWindow)}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '40px',
      sortable: false,
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(row);
          }}
          className="p-1 rounded hover:bg-fw-surface-2 text-fw-text-muted hover:text-fw-cyan"
          title="View shipment details"
        >
          <Eye size={14} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="bg-fw-bg border border-fw-border rounded-md px-3 py-1.5 text-sm text-fw-text"
        >
          <option value="">All Clients</option>
          {clients.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-fw-bg border border-fw-border rounded-md px-3 py-1.5 text-sm text-fw-text"
        >
          <option value="">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="flagged">Flagged</option>
          <option value="auto-corrected">Auto-corrected</option>
          <option value="loaded">Loaded</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-fw-bg border border-fw-border rounded-md px-3 py-1.5 text-sm text-fw-text"
        >
          <option value="">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="standard">Standard</option>
          <option value="low">Low</option>
        </select>

        <select
          value={destFilter}
          onChange={(e) => setDestFilter(e.target.value)}
          className="bg-fw-bg border border-fw-border rounded-md px-3 py-1.5 text-sm text-fw-text"
        >
          <option value="">All Destinations</option>
          {destinations.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-fw-bg border border-fw-border rounded-md px-3 py-1.5 text-sm text-fw-text placeholder:text-fw-text-muted w-44"
        />

        <button
          onClick={() => setFlagsOnly((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
            flagsOnly
              ? 'border-fw-amber bg-fw-amber/10 text-fw-amber'
              : 'border-fw-border text-fw-text-dim hover:border-fw-amber hover:text-fw-amber'
          }`}
          title="Show only shipments flagged by AI data cleaning"
        >
          <Filter size={12} />
          AI Flags Only
        </button>
        <HelpIcon
          text="Filter and search your shipment manifest. Use 'AI Flags Only' to see shipments with data quality issues detected by FreightWare AI. Resolve flagged items before optimization for best results."
          position="bottom-left"
        />
      </div>

      <div className="flex items-center gap-4 mb-3 text-xs text-fw-text-muted">
        <span className="font-medium">Status:</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fw-green inline-block" /> Confirmed</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fw-amber inline-block" /> Auto-corrected</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fw-red inline-block" /> Flagged</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fw-cyan inline-block" /> Loaded</span>
      </div>

      <div className="bg-fw-surface border border-fw-border rounded-lg overflow-hidden" data-tour="shipment-table">
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={onSelect}
          emptyMessage="No shipments match the current filters"
        />
      </div>
      <p className="text-xs text-fw-text-muted mt-2">
        Showing {filtered.length} of {shipments.length} shipments
      </p>
    </div>
  );
}
