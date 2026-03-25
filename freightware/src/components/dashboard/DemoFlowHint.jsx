'use client';

import Link from 'next/link';
import { ArrowRight, Upload } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function DemoFlowHint() {
  const { optimizationState } = useApp();

  if (optimizationState === 'complete') return null;

  return (
    <div className="flex items-center justify-center py-4">
      <Link
        href="/shipments"
        className="flex items-center gap-2 text-sm text-fw-text-muted hover:text-fw-cyan transition-colors group"
      >
        <Upload size={14} className="group-hover:text-fw-cyan" />
        Ready to import shipment data?
        <span className="text-fw-cyan font-medium">Go to Shipments</span>
        <ArrowRight
          size={14}
          className="text-fw-cyan group-hover:translate-x-1 transition-transform"
        />
      </Link>
    </div>
  );
}
