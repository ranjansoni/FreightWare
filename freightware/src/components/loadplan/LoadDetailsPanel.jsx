'use client';

import { useState } from 'react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import ProgressBar from '@/components/shared/ProgressBar';
import { containerTypes } from '@/utils/containerSpecs';
import { getShipmentById } from '@/data/mockShipments';
import { clientColors } from '@/utils/clientColors';
import { formatDimensions, formatWeightFull } from '@/utils/formatters';
import HelpIcon from '@/components/shared/HelpIcon';
import { Play, ChevronLeft, ChevronRight, Pause } from 'lucide-react';

export default function LoadDetailsPanel({
  container,
  loadSequence,
  onHighlight,
  selectedShipment,
  onSelectShipment,
  onPlaySequence,
  onStepTo,
  isPlaying,
  currentStep,
  totalSteps,
}) {
  const spec = containerTypes[container.type];

  const uniqueShipments = [];
  const seen = new Set();
  for (const item of loadSequence) {
    if (!seen.has(item.shipmentId)) {
      seen.add(item.shipmentId);
      uniqueShipments.push(item);
    }
  }

  return (
    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-250px)]">
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-display font-semibold text-fw-text uppercase tracking-wider">
            Container Summary
          </h3>
          <HelpIcon
            text="Volume utilization shows how much of the container's internal space is used. Weight utilization shows the percentage of the container's max payload. Both must stay under 100% for a valid plan."
            position="bottom-right"
          />
        </div>
        <p className="text-xs text-fw-text-dim mb-3">
          {spec?.name} · {formatDimensions(spec?.internal || {})}
        </p>
        <ProgressBar
          value={container.utilization}
          label="Volume Utilization"
          color="cyan"
          className="mb-3"
        />
        <ProgressBar
          value={container.weightUtilization}
          label="Weight Utilization"
          color="green"
          className="mb-2"
        />
        <p className="text-xs text-fw-text-muted">
          {container.shipments.length} shipments · {loadSequence.length} pieces
        </p>
      </Card>

      <Card>
        <h3 className="text-sm font-display font-semibold text-fw-text mb-3 uppercase tracking-wider">
          Shipments in Container
        </h3>
        <div className="space-y-1">
          {uniqueShipments.map((item) => {
            const shipment = getShipmentById(item.shipmentId);
            if (!shipment) return null;
            const isActive = selectedShipment === item.shipmentId;
            return (
              <button
                key={item.shipmentId}
                className={`w-full text-left flex items-center gap-2 px-2 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-fw-cyan/10 border border-fw-cyan/30'
                    : 'hover:bg-fw-surface-2 border border-transparent'
                }`}
                onMouseEnter={() => onHighlight?.(item.shipmentId)}
                onMouseLeave={() => onHighlight?.(null)}
                onClick={() => onSelectShipment?.(item.shipmentId)}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: clientColors[shipment.clientId],
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-fw-text">
                      {item.shipmentId.replace('SHP-2026-', '')}
                    </span>
                    <span className="text-xs text-fw-text-dim truncate">
                      {shipment.description}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-fw-text-muted">
                  {shipment.volume.toFixed(1)}m³
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-display font-semibold text-fw-text uppercase tracking-wider">
            Loading Sequence
          </h3>
          <HelpIcon
            text="The loading sequence shows the optimal order for physically placing cargo into the container. Items loaded last are placed nearest the door for easy access. Heavy items go on the floor first."
            position="left"
          />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPlaySequence}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Show Loading Order'}
          </Button>
        </div>
        {isPlaying && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => onStepTo?.(Math.max(0, currentStep - 1))}
                className="p-1 rounded hover:bg-fw-surface-2 text-fw-text-muted"
                title="Previous loading step"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-mono text-fw-text flex-1 text-center">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <button
                onClick={() => onStepTo?.(Math.min(totalSteps - 1, currentStep + 1))}
                className="p-1 rounded hover:bg-fw-surface-2 text-fw-text-muted"
                title="Next loading step"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <ProgressBar
              value={currentStep + 1}
              max={totalSteps}
              color="cyan"
              showPercent={false}
              size="sm"
            />
            {loadSequence[currentStep] && (
              <LoadInstruction item={loadSequence[currentStep]} step={currentStep + 1} />
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function LoadInstruction({ item, step }) {
  const shipment = getShipmentById(item.shipmentId);
  if (!shipment) return null;

  return (
    <div className="mt-3 bg-fw-bg border border-fw-border rounded-lg p-3">
      <p className="text-xs text-fw-text-dim mb-1">
        Step {step}: Place{' '}
        <span className="font-mono text-fw-cyan">{item.shipmentId}</span>
      </p>
      <p className="text-sm text-fw-text font-medium">{shipment.clientName}</p>
      <p className="text-xs text-fw-text-dim mt-1">
        {formatDimensions(item.dimensions)} · {formatWeightFull(shipment.weight / shipment.pieces)}
      </p>
      {shipment.weight / shipment.pieces > 1000 && (
        <p className="text-xs text-fw-amber mt-1 font-medium">
          ⚠️ Heavy — USE FORKLIFT
        </p>
      )}
      {shipment.fragile && (
        <p className="text-xs text-fw-red mt-1 font-medium">
          ⚠️ FRAGILE — Do not stack above
        </p>
      )}
    </div>
  );
}
