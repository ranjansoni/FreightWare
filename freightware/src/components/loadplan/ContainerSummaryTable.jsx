'use client';

import { useMemo } from 'react';
import { Download, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { containerTypes } from '@/utils/containerSpecs';
import { getShipmentById } from '@/data/mockShipments';
import { validateAllContainers } from '@/utils/loadPlanValidation';

function buildRowData(containerId, shipmentIds, containerType, allIssues) {
  const spec = containerTypes[containerType];
  if (!spec) return null;

  let weight = 0;
  let volume = 0;
  const destinations = new Set();
  let hazmatCount = 0;
  let fragileCount = 0;
  let tempCount = 0;

  for (const id of shipmentIds) {
    const s = getShipmentById(id);
    if (!s) continue;
    weight += s.weight || 0;
    volume += s.volume || 0;
    if (s.destination) destinations.add(s.destination);
    if (s.hazmat) hazmatCount++;
    if (s.fragile) fragileCount++;
    if (s.tempRange) tempCount++;
  }

  const issues = allIssues?.[containerId] || { errors: [], warnings: [] };

  return {
    id: containerId,
    type: spec.name,
    typeKey: containerType,
    shipments: shipmentIds.length,
    weight,
    volume: Math.round(volume * 100) / 100,
    volPct: spec.volume > 0 ? Math.round((volume / spec.volume) * 1000) / 10 : 0,
    weightPct: spec.maxWeight > 0 ? Math.round((weight / spec.maxWeight) * 1000) / 10 : 0,
    destinations: [...destinations].sort().join(', '),
    hazmatCount,
    fragileCount,
    tempCount,
    warnings: issues.warnings.length,
    errors: issues.errors.length,
  };
}

function exportCSV(rows, unassignedCount) {
  const headers = [
    'Container', 'Type', 'Shipments', 'Weight (kg)', 'Volume (m³)',
    'Vol %', 'Weight %', 'Destinations', 'HAZMAT', 'Fragile', 'Temp Ctrl',
    'Warnings', 'Errors',
  ];

  const csvRows = [headers.join(',')];

  for (const r of rows) {
    csvRows.push([
      r.id,
      `"${r.type}"`,
      r.shipments,
      r.weight,
      r.volume,
      r.volPct,
      r.weightPct,
      `"${r.destinations}"`,
      r.hazmatCount,
      r.fragileCount,
      r.tempCount,
      r.warnings,
      r.errors,
    ].join(','));
  }

  if (unassignedCount > 0) {
    csvRows.push(`Unassigned,,${unassignedCount},,,,,,,,,,`);
  }

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `freightware-loadplan-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ContainerSummaryTable({
  containers,
  assignments,
  unassignedCount,
  allShipments,
}) {
  const allIssues = useMemo(
    () => validateAllContainers(assignments, allShipments, containers),
    [assignments, allShipments, containers]
  );

  const rows = useMemo(() => {
    return containers
      .map((c) => buildRowData(c.id, assignments[c.id] || [], c.type, allIssues))
      .filter(Boolean);
  }, [containers, assignments, allIssues]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => ({
        shipments: acc.shipments + r.shipments,
        weight: acc.weight + r.weight,
        volume: Math.round((acc.volume + r.volume) * 100) / 100,
        warnings: acc.warnings + r.warnings,
        errors: acc.errors + r.errors,
      }),
      { shipments: 0, weight: 0, volume: 0, warnings: 0, errors: 0 }
    );
  }, [rows]);

  return (
    <div className="mt-6 rounded-xl border border-fw-border bg-fw-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-fw-border/50">
        <h3 className="text-sm font-medium text-fw-text">Container Summary</h3>
        <button
          onClick={() => exportCSV(rows, unassignedCount)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-fw-cyan bg-fw-cyan/10 border border-fw-cyan/20 hover:bg-fw-cyan/20 transition-colors"
        >
          <Download size={13} />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-fw-border/50 bg-fw-bg/50">
              <th className="px-3 py-2.5 text-left font-medium text-fw-text-muted">Container</th>
              <th className="px-3 py-2.5 text-left font-medium text-fw-text-muted">Type</th>
              <th className="px-3 py-2.5 text-right font-medium text-fw-text-muted">Shipments</th>
              <th className="px-3 py-2.5 text-right font-medium text-fw-text-muted">Weight</th>
              <th className="px-3 py-2.5 text-right font-medium text-fw-text-muted">Volume</th>
              <th className="px-3 py-2.5 text-right font-medium text-fw-text-muted">Vol %</th>
              <th className="px-3 py-2.5 text-right font-medium text-fw-text-muted">Wt %</th>
              <th className="px-3 py-2.5 text-left font-medium text-fw-text-muted">Destinations</th>
              <th className="px-3 py-2.5 text-center font-medium text-fw-text-muted">Flags</th>
              <th className="px-3 py-2.5 text-center font-medium text-fw-text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-fw-border/30 hover:bg-fw-surface-2/50 transition-colors">
                <td className="px-3 py-2.5 font-mono font-medium text-fw-cyan">{r.id}</td>
                <td className="px-3 py-2.5 text-fw-text-dim">{r.type}</td>
                <td className="px-3 py-2.5 text-right font-mono text-fw-text">{r.shipments}</td>
                <td className="px-3 py-2.5 text-right font-mono text-fw-text-dim">
                  {r.weight.toLocaleString()} <span className="text-fw-text-muted">kg</span>
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-fw-text-dim">
                  {r.volume.toFixed(1)} <span className="text-fw-text-muted">m³</span>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <span className={`font-mono font-medium ${
                    r.volPct > 95 ? 'text-red-400' : r.volPct > 85 ? 'text-fw-green' : 'text-fw-text'
                  }`}>
                    {r.volPct.toFixed(1)}%
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <span className={`font-mono font-medium ${
                    r.weightPct > 95 ? 'text-red-400' : r.weightPct > 85 ? 'text-fw-green' : 'text-fw-text'
                  }`}>
                    {r.weightPct.toFixed(1)}%
                  </span>
                </td>
                <td className="px-3 py-2.5 text-fw-text-dim max-w-[140px] truncate" title={r.destinations}>
                  {r.destinations || '—'}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-center gap-1.5">
                    {r.hazmatCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold" title={`${r.hazmatCount} HAZMAT`}>
                        HAZ {r.hazmatCount}
                      </span>
                    )}
                    {r.tempCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[9px] font-medium" title={`${r.tempCount} temp-controlled`}>
                        TEMP {r.tempCount}
                      </span>
                    )}
                    {r.fragileCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-medium" title={`${r.fragileCount} fragile`}>
                        FRAG {r.fragileCount}
                      </span>
                    )}
                    {r.hazmatCount === 0 && r.tempCount === 0 && r.fragileCount === 0 && (
                      <span className="text-fw-text-muted">—</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-center gap-1">
                    {r.errors > 0 ? (
                      <span className="flex items-center gap-0.5 text-red-400" title={`${r.errors} error(s)`}>
                        <AlertCircle size={13} />
                        <span className="text-[10px] font-bold">{r.errors}</span>
                      </span>
                    ) : r.warnings > 0 ? (
                      <span className="flex items-center gap-0.5 text-amber-400" title={`${r.warnings} warning(s)`}>
                        <AlertTriangle size={13} />
                        <span className="text-[10px] font-bold">{r.warnings}</span>
                      </span>
                    ) : (
                      <CheckCircle2 size={14} className="text-fw-green" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-fw-bg/50 border-t border-fw-border">
              <td className="px-3 py-2.5 font-medium text-fw-text">Total</td>
              <td className="px-3 py-2.5 text-fw-text-muted">{rows.length} containers</td>
              <td className="px-3 py-2.5 text-right font-mono font-medium text-fw-text">{totals.shipments}</td>
              <td className="px-3 py-2.5 text-right font-mono font-medium text-fw-text-dim">{totals.weight.toLocaleString()} kg</td>
              <td className="px-3 py-2.5 text-right font-mono font-medium text-fw-text-dim">{totals.volume.toFixed(1)} m³</td>
              <td colSpan={2} className="px-3 py-2.5"></td>
              <td className="px-3 py-2.5"></td>
              <td colSpan={2} className="px-3 py-2.5 text-center">
                {unassignedCount > 0 && (
                  <span className="text-[10px] text-amber-400 font-medium">
                    +{unassignedCount} unassigned
                  </span>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
