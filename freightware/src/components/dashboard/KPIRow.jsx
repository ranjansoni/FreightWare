'use client';

import MetricCard from '@/components/shared/MetricCard';
import ProgressBar from '@/components/shared/ProgressBar';
import HelpIcon from '@/components/shared/HelpIcon';
import { Package, Box, BarChart3, DollarSign } from 'lucide-react';

export default function KPIRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" data-tour="kpi-row">
      <MetricCard
        label={
          <span className="flex items-center gap-1.5">
            Active Shipments
            <HelpIcon
              text="Total shipments currently in the planning pipeline this week. Includes confirmed, flagged, and auto-corrected shipments across all clients."
              position="bottom-right"
            />
          </span>
        }
        value="25"
        subtitle="Across 8 clients"
        icon={Package}
      >
        <div className="flex items-end gap-1 mt-3 h-8">
          {[18, 22, 19, 25, 23, 21, 25].map((v, i) => (
            <div
              key={i}
              className="flex-1 bg-fw-cyan/20 rounded-t"
              style={{ height: `${(v / 25) * 100}%` }}
            />
          ))}
        </div>
      </MetricCard>

      <MetricCard
        label={
          <span className="flex items-center gap-1.5">
            Containers Planned
            <HelpIcon
              text="Number of containers the optimizer assigned vs. total available in the yard. Fewer containers used means lower freight costs and reduced carbon emissions."
              position="bottom-right"
            />
          </span>
        }
        value="3 of 5"
        icon={Box}
      >
        <div className="mt-3">
          <ProgressBar value={3} max={5} color="cyan" showPercent={false} />
          <p className="text-xs text-fw-text-muted mt-1">
            2 containers available in yard
          </p>
        </div>
      </MetricCard>

      <MetricCard
        label={
          <span className="flex items-center gap-1.5">
            Avg Utilization
            <HelpIcon
              text="Average volume utilization across all planned containers. Industry average is ~65%. FreightWare's AI optimization targets 90%+ by intelligently consolidating shipments."
              position="bottom-right"
            />
          </span>
        }
        value="91.5%"
        trend="up"
        trendLabel="Up from 72.3% baseline"
        icon={BarChart3}
      />

      <MetricCard
        label={
          <span className="flex items-center gap-1.5">
            Weekly Savings
            <HelpIcon
              text="Cost saved this week by using FreightWare vs. manual planning. Calculated from container reduction (fewer containers × per-container rate) plus overflow charge avoidance."
              position="bottom-left"
            />
          </span>
        }
        value="$5,400"
        subtitle="2 containers saved"
        trend="up"
        trendLabel="vs. manual planning"
        icon={DollarSign}
      />
    </div>
  );
}
