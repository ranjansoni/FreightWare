'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Box, Check, Flag, ChevronRight } from 'lucide-react';
import usePageTitle from '@/utils/usePageTitle';
import PageLoader from '@/components/shared/PageLoader';
import { optimizationResult } from '@/data/mockOptimizationResult';
import { shipments } from '@/data/mockShipments';
import { packShipmentsIntoContainer } from '@/utils/mockBinPacker';
import { containerTypes } from '@/utils/containerSpecs';
import { clientColors } from '@/utils/clientColors';
import { formatDimensions, formatWeightFull } from '@/utils/formatters';

function buildSequence(container) {
  const items = [];
  for (const id of container.shipments) {
    const s = shipments.find((sh) => sh.id === id);
    if (!s) continue;
    for (let i = 0; i < s.pieces; i++) {
      items.push({
        shipmentId: id,
        pieceIndex: i,
        dims: s.manifestDimensions,
      });
    }
  }
  const packed = packShipmentsIntoContainer(items, container.type);
  return packed.map((p, idx) => ({ ...p, loadOrder: idx + 1 }));
}

function PlacementDiagram({ position, dimensions, containerType, completed }) {
  const spec = containerTypes[containerType];
  if (!spec) return null;
  const cW = spec.internal.width;
  const cL = spec.internal.length;
  const scale = 200 / cL;

  return (
    <svg viewBox={`0 0 ${cL * scale} ${cW * scale}`} className="w-full max-w-md mx-auto h-24 bg-gray-100 rounded-lg">
      <rect x={0} y={0} width={cL * scale} height={cW * scale} fill="none" stroke="#d1d5db" strokeWidth={2} />
      {completed.map((c, i) => (
        <rect
          key={i}
          x={c.z * scale}
          y={c.x * scale}
          width={c.dimensions.length * scale}
          height={c.dimensions.width * scale}
          fill="#e5e7eb"
          stroke="#9ca3af"
          strokeWidth={0.5}
        />
      ))}
      <rect
        x={position.z * scale}
        y={position.x * scale}
        width={dimensions.length * scale}
        height={dimensions.width * scale}
        fill="#06B6D4"
        fillOpacity={0.3}
        stroke="#06B6D4"
        strokeWidth={2}
      />
      <text
        x={5}
        y={cW * scale - 5}
        fontSize={10}
        fill="#6b7280"
      >
        → Loading direction
      </text>
    </svg>
  );
}

export default function TabletPage() {
  usePageTitle('Floor Assistant');
  const containers = optimizationResult.containersUsed;
  const [selectedContainer, setSelectedContainer] = useState(containers[0].id);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const activeContainer = containers.find((c) => c.id === selectedContainer);
  const sequence = useMemo(
    () => (activeContainer ? buildSequence(activeContainer) : []),
    [activeContainer]
  );

  const currentItem = sequence[currentStep];
  const currentShipment = currentItem
    ? shipments.find((s) => s.id === currentItem.shipmentId)
    : null;

  const handleMarkComplete = useCallback(() => {
    if (currentItem) {
      setCompleted((prev) => [...prev, currentItem]);
    }
    if (currentStep < sequence.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setAllDone(true);
    }
  }, [currentStep, sequence.length, currentItem]);

  const handleContainerChange = useCallback((id) => {
    setSelectedContainer(id);
    setCurrentStep(0);
    setCompleted([]);
    setAllDone(false);
  }, []);

  return (
    <PageLoader theme="tablet">
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
            <Box size={22} className="text-cyan-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              FreightWare
            </h1>
            <p className="text-sm text-gray-500">Floor Assistant</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700 font-medium"
        >
          <ArrowLeft size={16} />
          Back to Planning
        </Link>
      </div>

      {/* Container Selector */}
      <div className="mb-6">
        <select
          value={selectedContainer}
          onChange={(e) => handleContainerChange(e.target.value)}
          className="w-full text-lg p-3 border-2 border-gray-200 rounded-xl bg-white font-medium text-gray-900"
        >
          {containers.map((c) => {
            const spec = containerTypes[c.type];
            return (
              <option key={c.id} value={c.id}>
                {c.id} — {spec?.name} ({c.utilization}% utilized)
              </option>
            );
          })}
        </select>
      </div>

      {/* All Done State */}
      {allDone && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Container {selectedContainer} Loading Complete ✓
          </h2>
          <p className="text-lg text-green-600 mb-4">
            {sequence.length}/{sequence.length} pieces loaded · 0 issues flagged
          </p>
          <p className="text-gray-500 mb-6">
            {activeContainer?.utilization}% volume utilized
          </p>
          <button
            onClick={() => {
              const nextIdx = containers.findIndex((c) => c.id === selectedContainer) + 1;
              if (nextIdx < containers.length) {
                handleContainerChange(containers[nextIdx].id);
              }
            }}
            className="bg-cyan-600 text-white text-lg font-semibold px-8 py-3 rounded-xl hover:bg-cyan-700 transition-colors"
          >
            Select Next Container
          </button>
        </div>
      )}

      {/* Step Card */}
      {!allDone && currentShipment && (
        <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Progress */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                STEP {currentStep + 1}{' '}
                <span className="text-lg font-normal text-gray-400">
                  of {sequence.length}
                </span>
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / sequence.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {/* Shipment Info */}
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: clientColors[currentShipment.clientId] }}
              />
              <div>
                <p className="font-mono text-lg font-bold text-gray-900">
                  {currentItem.shipmentId}
                </p>
                <p className="text-base text-gray-600">
                  {currentShipment.clientName}
                </p>
              </div>
            </div>

            {/* Placement */}
            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-4">
              <p className="text-xs text-cyan-600 font-medium uppercase tracking-wider mb-1">
                Place at
              </p>
              <p className="text-xl sm:text-2xl font-bold text-cyan-800 uppercase">
                {currentItem.position.z < 1 ? 'REAR WALL' : 'MID-SECTION'},{' '}
                {currentItem.position.y < 0.1 ? 'FLOOR LEVEL' : `LEVEL ${Math.ceil(currentItem.position.y / 1.5) + 1}`}
              </p>
            </div>

            {/* Dimensions + Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Dimensions
                </p>
                <p className="text-xl font-bold font-mono text-gray-900">
                  {currentItem.dimensions.width}m × {currentItem.dimensions.length}m × {currentItem.dimensions.height}m
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Weight
                </p>
                <p className="text-xl font-bold font-mono text-gray-900">
                  {formatWeightFull(currentShipment.weight / currentShipment.pieces)}
                </p>
                {currentShipment.weight / currentShipment.pieces > 1000 && (
                  <p className="text-sm text-amber-600 font-semibold mt-1">
                    ⚠️ USE FORKLIFT
                  </p>
                )}
              </div>
            </div>

            {/* Special Instructions */}
            {(currentShipment.fragile || currentShipment.hazmat) && (
              <div className={`rounded-xl p-4 border-2 ${
                currentShipment.hazmat
                  ? 'bg-red-50 border-red-200'
                  : 'bg-amber-50 border-amber-200'
              }`}>
                {currentShipment.fragile && (
                  <p className="text-lg font-bold text-amber-700">
                    ⚠️ FRAGILE — Do not stack above
                  </p>
                )}
                {currentShipment.hazmat && (
                  <p className="text-lg font-bold text-red-700">
                    ☣️ HAZMAT — Class 3 Flammable. Isolate per IMDG.
                  </p>
                )}
              </div>
            )}

            {/* 2D Placement Diagram */}
            <PlacementDiagram
              position={currentItem.position}
              dimensions={currentItem.dimensions}
              containerType={activeContainer.type}
              completed={completed}
            />

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleMarkComplete}
                className="flex-1 bg-green-600 text-white text-lg font-bold py-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 min-h-[56px]"
              >
                <Check size={24} />
                Mark Complete
              </button>
              <button
                onClick={() => setShowFlagModal(true)}
                className="bg-amber-100 text-amber-700 text-base font-semibold px-6 py-4 rounded-xl hover:bg-amber-200 transition-colors flex items-center gap-2 min-h-[56px]"
              >
                <Flag size={20} />
                Flag Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flag Issue Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Flag an Issue</h3>
            </div>
            <div className="p-4 space-y-2">
              {['Wrong dimensions', 'Damaged', 'Missing', 'Other'].map(
                (issue) => (
                  <button
                    key={issue}
                    onClick={() => setShowFlagModal(false)}
                    className="w-full text-left text-lg p-4 rounded-xl border-2 border-gray-200 hover:border-amber-400 hover:bg-amber-50 transition-colors flex items-center justify-between"
                  >
                    {issue}
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                )
              )}
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowFlagModal(false)}
                className="w-full text-gray-500 text-base font-medium py-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </PageLoader>
  );
}
