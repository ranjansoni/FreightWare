'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Card from '@/components/shared/Card';
import { optimizationResult } from '@/data/mockOptimizationResult';
import { replanScenario } from '@/data/mockReplanScenario';
import { shipments } from '@/data/mockShipments';
import { packShipmentsIntoContainer } from '@/utils/mockBinPacker';
import { formatCurrency } from '@/utils/formatters';
import HelpIcon from '@/components/shared/HelpIcon';
import { CheckCircle2, ArrowRight, DollarSign, Clock, Timer } from 'lucide-react';

const Container3DScene = dynamic(
  () => import('@/components/loadplan/Container3DScene'),
  { ssr: false }
);

function buildSequence(shipmentIds, containerType, useScanDims = false) {
  const items = [];
  for (const id of shipmentIds) {
    const s = shipments.find((sh) => sh.id === id);
    if (!s) continue;
    const dims =
      useScanDims && id === 'SHP-2026-0003'
        ? replanScenario.actualScan.dimensions
        : s.manifestDimensions;
    for (let i = 0; i < s.pieces; i++) {
      items.push({
        shipmentId: id,
        pieceIndex: i,
        dims: { length: dims.length, width: dims.width, height: dims.height },
      });
    }
  }
  const packed = packShipmentsIntoContainer(items, containerType);
  return packed.map((p, idx) => ({ ...p, loadOrder: idx + 1 }));
}

export default function BeforeAfterView() {
  const originalCTR001 = optimizationResult.containersUsed[0];
  const replanCTR001 = replanScenario.replanResult.updatedContainers[0];

  const movedShipments = ['SHP-2026-0012'];

  const beforeSequence = useMemo(
    () => buildSequence(originalCTR001.shipments, originalCTR001.type, false),
    []
  );
  const afterSequence = useMemo(
    () => buildSequence(replanCTR001.shipments, replanCTR001.type, true),
    []
  );

  const { replanResult } = replanScenario;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-display font-semibold text-fw-text-dim mb-2 uppercase tracking-wider">
            Original Plan
          </p>
          <div className="h-72 rounded-lg overflow-hidden border border-fw-border">
            <Container3DScene
              containerType={originalCTR001.type}
              loadSequence={beforeSequence}
              className="h-full"
            />
          </div>
        </div>
        <div>
          <p className="text-sm font-display font-semibold text-fw-cyan mb-2 uppercase tracking-wider">
            Replanned
          </p>
          <div className="h-72 rounded-lg overflow-hidden border border-fw-cyan/30">
            <Container3DScene
              containerType={replanCTR001.type}
              loadSequence={afterSequence}
              amberPulseIds={movedShipments}
              className="h-full"
            />
          </div>
        </div>
      </div>

      <Card>
        <h3 className="text-sm font-display font-semibold text-fw-text mb-3 uppercase tracking-wider">
          Change Log
        </h3>
        <div className="space-y-2">
          {replanResult.changes.map((change, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-fw-cyan mt-0.5">✦</span>
              <p className="text-sm text-fw-text-dim">{change.details}</p>
            </div>
          ))}
          <div className="flex items-start gap-2">
            <span className="text-fw-cyan mt-0.5">✦</span>
            <p className="text-sm text-fw-text-dim">
              Loading sequence updated for CTR-001
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-fw-border text-sm text-fw-text-dim">
          <div>
            CTR-001: {optimizationResult.containersUsed[0].utilization}% →{' '}
            <span className="text-fw-cyan font-mono">
              {replanResult.newUtilization['CTR-001']}%
            </span>
          </div>
          <div>
            CTR-002: {optimizationResult.containersUsed[1].utilization}% →{' '}
            <span className="text-fw-cyan font-mono">
              {replanResult.newUtilization['CTR-002']}%
            </span>
          </div>
        </div>
      </Card>

      <div className="bg-fw-green/5 border-2 border-fw-green/30 rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <Timer size={28} className="text-fw-green" />
            <div>
              <p className="text-3xl font-display font-bold text-fw-green flex items-center gap-2">
                Replanned in 0.8 seconds
                <HelpIcon
                  text="FreightWare uses warm-starting — the original plan is used as a seed, so the solver only recalculates affected cargo. This reduces replan time from minutes to sub-second, even for large loads."
                  position="bottom-left"
                />
              </p>
              <p className="text-sm text-fw-text-dim mt-1">
                vs ~45 minutes manual replanning
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1">
                <CheckCircle2 size={16} className="text-fw-green" />
                <span className="text-sm font-medium text-fw-text">
                  No additional container
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <DollarSign size={16} className="text-fw-green" />
                <span className="text-lg font-display font-bold text-fw-green">
                  {formatCurrency(replanResult.overflowChargeAvoided)}
                </span>
              </div>
              <p className="text-xs text-fw-text-muted">overflow charge avoided</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <a
          href="/tablet"
          className="flex items-center gap-2 text-sm text-fw-text-muted hover:text-fw-cyan transition-colors"
        >
          See how floor workers use this →{' '}
          <span className="text-fw-cyan font-medium">Tablet View</span>
          <ArrowRight size={14} className="text-fw-cyan" />
        </a>
      </div>
    </motion.div>
  );
}
