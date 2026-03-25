'use client';

import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import HelpIcon from '@/components/shared/HelpIcon';
import { getFlaggedShipments } from '@/data/mockShipments';
import { clientColors } from '@/utils/clientColors';

const FLAG_LABELS = {
  dimension_mismatch: 'Dimension mismatch',
  missing_weight: 'Missing weight',
  duplicate_suspected: 'Duplicate suspected',
  inconsistent_units: 'Inconsistent units',
  client_name_typo: 'Client name typo',
  missing_hazmat_un: 'Missing HAZMAT UN code',
};

export default function ActiveShipmentsWidget() {
  const flagged = getFlaggedShipments();

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-display font-semibold text-fw-text flex items-center gap-2">
          Shipments Requiring Attention
          <HelpIcon
            text="Shipments flagged by FreightWare AI for data quality issues — dimension mismatches, missing weights, duplicate entries, etc. Resolve these before running the optimizer for best results."
            position="bottom-right"
          />
        </h3>
        <Link
          href="/shipments"
          className="text-xs text-fw-cyan hover:text-fw-cyan/80 flex items-center gap-1"
        >
          View All Shipments <ArrowRight size={12} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fw-border">
              <th className="text-left py-2 px-2 text-xs font-medium text-fw-text-muted uppercase tracking-wider">
                ID
              </th>
              <th className="text-left py-2 px-2 text-xs font-medium text-fw-text-muted uppercase tracking-wider">
                Client
              </th>
              <th className="text-left py-2 px-2 text-xs font-medium text-fw-text-muted uppercase tracking-wider">
                Issue
              </th>
              <th className="text-left py-2 px-2 text-xs font-medium text-fw-text-muted uppercase tracking-wider">
                AI Suggestion
              </th>
              <th className="text-left py-2 px-2 text-xs font-medium text-fw-text-muted uppercase tracking-wider w-10" />
            </tr>
          </thead>
          <tbody>
            {flagged.map((s, i) => (
              <tr
                key={s.id}
                className={`border-b border-fw-border/50 ${
                  i % 2 === 0 ? 'bg-fw-surface' : 'bg-fw-surface-2'
                }`}
              >
                <td className="py-2.5 px-2 font-mono text-xs text-fw-text">
                  {s.id.replace('SHP-2026-', '')}
                </td>
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: clientColors[s.clientId] }}
                    />
                    <span className="text-fw-text text-xs truncate max-w-28">
                      {s.clientName}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-2">
                  <Badge
                    status={
                      s.aiFlags[0]?.includes('missing') ? 'flagged' : 'flagged'
                    }
                  >
                    {FLAG_LABELS[s.aiFlags[0]] || s.aiFlags[0]}
                  </Badge>
                </td>
                <td className="py-2.5 px-2 text-xs text-fw-text-dim max-w-xs truncate">
                  {s.aiSuggestions[0]?.slice(0, 80)}...
                </td>
                <td className="py-2.5 px-2">
                  <Link
                    href="/shipments"
                    className="p-1 rounded hover:bg-fw-surface-2 text-fw-text-muted hover:text-fw-cyan inline-flex"
                    title="View shipment details"
                  >
                    <Eye size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
