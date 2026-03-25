'use client';

import PageLoader from '@/components/shared/PageLoader';
import CostWaterfall from '@/components/reports/CostWaterfall';
import ClientTreemap from '@/components/reports/ClientTreemap';
import CargoDensity from '@/components/reports/CargoDensity';
import ContainerBreakdown from '@/components/reports/ContainerBreakdown';
import DestinationMix from '@/components/reports/DestinationMix';
import usePageTitle from '@/utils/usePageTitle';

const SECTIONS = [
  { id: 'cost-waterfall', label: 'Savings' },
  { id: 'client-treemap', label: 'Clients' },
  { id: 'cargo-density', label: 'Density' },
  { id: 'container-breakdown', label: 'Containers' },
  { id: 'destination-mix', label: 'Destinations' },
];

export default function ReportsPage() {
  usePageTitle('Reports');

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <PageLoader theme="reports">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-fw-text">
              Analytics & Reports
            </h2>
            <p className="text-sm text-fw-text-dim mt-1">
              Week of March 24, 2026 — Vancouver export operations
            </p>
          </div>
        </div>

        {/* Jump nav */}
        <div className="sticky top-0 z-30 bg-fw-bg/80 backdrop-blur-sm border-b border-fw-border -mx-6 px-6 py-2 mb-6" data-tour="reports-nav">
          <div className="flex items-center gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="px-3 py-1.5 text-xs font-mono text-fw-text-muted hover:text-fw-cyan hover:bg-fw-cyan/5 rounded-md transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <CostWaterfall />
          <ClientTreemap />
          <CargoDensity />
          <ContainerBreakdown />
          <DestinationMix />
        </div>
      </div>
    </PageLoader>
  );
}
