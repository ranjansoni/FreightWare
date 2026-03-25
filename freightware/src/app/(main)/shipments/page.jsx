'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Upload, ArrowRight, Zap } from 'lucide-react';
import Button from '@/components/shared/Button';
import ShipmentTable from '@/components/shipments/ShipmentTable';
import ShipmentDetailModal from '@/components/shipments/ShipmentDetailModal';
import ImportCSVModal from '@/components/shipments/ImportCSVModal';
import PageLoader from '@/components/shared/PageLoader';
import { useApp } from '@/context/AppContext';
import usePageTitle from '@/utils/usePageTitle';

export default function ShipmentsPage() {
  usePageTitle('Shipments');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const { shipments, optimizationState } = useApp();

  const flaggedCount = shipments.filter((s) => s.aiFlags.length > 0).length;

  return (
    <PageLoader theme="shipments">
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-fw-text">
            Shipment Management
          </h2>
          <p className="text-sm text-fw-text-dim mt-1">
            {shipments.length} active shipments —{' '}
            {flaggedCount > 0 ? (
              <span className="text-fw-amber">{flaggedCount} flagged for review</span>
            ) : (
              <span className="text-fw-green">all verified</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {optimizationState !== 'complete' && (
            <Link href="/optimizer">
              <Button variant="ghost" size="sm">
                <Zap size={14} />
                Run Optimization
                <ArrowRight size={14} />
              </Button>
            </Link>
          )}
          <div data-tour="csv-import">
            <Button onClick={() => setCsvModalOpen(true)}>
              <Upload size={16} />
              Import CSV
            </Button>
          </div>
        </div>
      </div>

      <ShipmentTable onSelect={setSelectedShipment} />

      <ShipmentDetailModal
        shipment={selectedShipment}
        isOpen={!!selectedShipment}
        onClose={() => setSelectedShipment(null)}
      />

      <ImportCSVModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
      />
    </div>
    </PageLoader>
  );
}
