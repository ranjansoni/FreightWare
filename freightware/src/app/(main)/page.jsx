'use client';

import KPIRow from '@/components/dashboard/KPIRow';
import UtilizationChart from '@/components/dashboard/UtilizationChart';
import AIInsightsPanel from '@/components/dashboard/AIInsightsPanel';
import ActiveShipmentsWidget from '@/components/dashboard/ActiveShipmentsWidget';
import DemoFlowHint from '@/components/dashboard/DemoFlowHint';
import PageLoader from '@/components/shared/PageLoader';
import usePageTitle from '@/utils/usePageTitle';

export default function DashboardPage() {
  usePageTitle('Dashboard');

  return (
    <PageLoader theme="dashboard">
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-fw-text">
            Operations Overview
          </h2>
          <p className="text-sm text-fw-text-dim mt-1">
            Vancouver export operations — real-time status
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <KPIRow />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <UtilizationChart />
          </div>
          <div className="lg:col-span-2">
            <AIInsightsPanel />
          </div>
        </div>

        <ActiveShipmentsWidget />

        <DemoFlowHint />
      </div>
    </div>
    </PageLoader>
  );
}
