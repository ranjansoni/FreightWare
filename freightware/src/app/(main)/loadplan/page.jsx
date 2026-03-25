'use client';

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  ArrowRight,
  RefreshCw,
  GripVertical,
  Eye,
  Pencil,
  Undo2,
  Redo2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Button from '@/components/shared/Button';
import ContainerTabs from '@/components/loadplan/ContainerTabs';
import LoadDetailsPanel from '@/components/loadplan/LoadDetailsPanel';
import ContainerColumn from '@/components/loadplan/ContainerColumn';
import UnassignedPool from '@/components/loadplan/UnassignedPool';
import DragOverlayCard from '@/components/loadplan/DragOverlayCard';
import ConstraintFeedback from '@/components/loadplan/ConstraintFeedback';
import SuggestPlanOverlay from '@/components/loadplan/SuggestPlanOverlay';
import ContainerSummaryTable from '@/components/loadplan/ContainerSummaryTable';
import HelpIcon from '@/components/shared/HelpIcon';
import PageLoader from '@/components/shared/PageLoader';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/shared/ToastProvider';
import usePageTitle from '@/utils/usePageTitle';
import useLoadPlanEditor from '@/hooks/useLoadPlanEditor';
import { optimizationResult } from '@/data/mockOptimizationResult';
import { shipments, unassignedShipmentIds, getShipmentById } from '@/data/mockShipments';
import { packShipmentsIntoContainer } from '@/utils/mockBinPacker';
import suggestOptimalPlan from '@/utils/suggestOptimalPlan';

const Container3DScene = dynamic(
  () => import('@/components/loadplan/Container3DScene'),
  { ssr: false }
);

function buildLoadSequences(containersUsed) {
  const shipmentsMap = {};
  for (const s of shipments) {
    shipmentsMap[s.id] = s;
  }

  const result = {};
  for (const container of containersUsed) {
    const items = [];
    for (const shipmentId of container.shipments) {
      const shipment = shipmentsMap[shipmentId];
      if (!shipment) continue;
      for (let i = 0; i < shipment.pieces; i++) {
        items.push({
          shipmentId,
          pieceIndex: i,
          dims: {
            length: shipment.manifestDimensions.length,
            width: shipment.manifestDimensions.width,
            height: shipment.manifestDimensions.height,
          },
        });
      }
    }
    const packed = packShipmentsIntoContainer(items, container.type);
    result[container.id] = packed.map((p, idx) => ({
      ...p,
      loadOrder: idx + 1,
    }));
  }
  return result;
}

export default function LoadPlanPage() {
  const { optimizationResult: appResult } = useApp();
  const { addToast } = useToast();
  const data = appResult || optimizationResult;

  const [editMode, setEditMode] = useState(false);
  const [activeContainer, setActiveContainer] = useState(data.containersUsed[0].id);
  const [highlightedShipment, setHighlightedShipment] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeDragId, setActiveDragId] = useState(null);
  const [overContainerId, setOverContainerId] = useState(null);
  const [suggestResult, setSuggestResult] = useState(null);
  const [showSuggestOverlay, setShowSuggestOverlay] = useState(false);

  usePageTitle('Load Plan');
  const sceneRef = useRef();

  const editor = useLoadPlanEditor(data.containersUsed, unassignedShipmentIds);

  const viewLoadSequences = useMemo(
    () => buildLoadSequences(data.containersUsed),
    [data]
  );

  const currentContainer = data.containersUsed.find(
    (c) => c.id === activeContainer
  );

  const currentSequence = editMode
    ? (editor.loadSequences[activeContainer] || [])
    : (viewLoadSequences[activeContainer] || []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleTabChange = useCallback((id) => {
    setActiveContainer(id);
    setSelectedShipment(null);
    setHighlightedShipment(null);
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const handlePlaySequence = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setCurrentStep(0);
    sceneRef.current?.animateLoadSequence();
  }, [isPlaying]);

  const handleStepTo = useCallback((step) => {
    setCurrentStep(step);
    sceneRef.current?.setVisibleCount(step + 1);
  }, []);

  useEffect(() => {
    if (isPlaying && currentStep < currentSequence.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((s) => s + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= currentSequence.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, currentSequence.length]);

  const draggedShipment = activeDragId ? getShipmentById(activeDragId) : null;

  const liveValidation = useMemo(() => {
    if (!activeDragId || !overContainerId) return null;
    return editor.previewMove(activeDragId, overContainerId);
  }, [activeDragId, overContainerId, editor]);

  function handleDragStart(event) {
    setActiveDragId(event.active.id);
  }

  function handleDragOver(event) {
    const overId = event.over?.data?.current?.containerId || event.over?.id || null;
    setOverContainerId(overId);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveDragId(null);
    setOverContainerId(null);

    if (!over) return;

    const shipmentId = active.id;
    const fromId = active.data.current?.fromContainerId || 'unassigned';
    const toId = over.data?.current?.containerId || over.id;

    if (fromId === toId) return;

    const result = editor.moveShipment(shipmentId, fromId, toId);

    if (!result.allowed) {
      addToast(result.errors[0]?.message || 'Cannot place shipment here', 'error');
    } else if (result.warnings.length > 0) {
      addToast(result.warnings[0]?.message, 'warning');
    }
  }

  function handleDragCancel() {
    setActiveDragId(null);
    setOverContainerId(null);
  }

  const handleSuggestPlan = useCallback(() => {
    const result = suggestOptimalPlan(
      editor.containers,
      editor.assignments,
      editor.unassigned
    );
    setSuggestResult(result);
    setShowSuggestOverlay(true);
  }, [editor.containers, editor.assignments, editor.unassigned]);

  const handleApplyPlan = useCallback(() => {
    if (!suggestResult) return;
    editor.applyPlan(suggestResult.assignments, suggestResult.unassigned);
    setShowSuggestOverlay(false);
    if (suggestResult.summary.overflow > 0) {
      addToast(
        `Plan applied — ${suggestResult.summary.overflow} shipment${suggestResult.summary.overflow !== 1 ? 's' : ''} moved to unassigned pool`,
        'warning'
      );
    } else {
      addToast(`Plan applied — ${suggestResult.summary.reassigned} shipments reassigned at ${suggestResult.summary.avgUtilization}% utilization`, 'success');
    }
    setSuggestResult(null);
  }, [suggestResult, editor, addToast]);

  const handleDismissPlan = useCallback(() => {
    setShowSuggestOverlay(false);
    setSuggestResult(null);
  }, []);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setIsPlaying(false);
  };

  return (
    <PageLoader theme="loadplan">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-fw-text">
              Load Plan
            </h2>
            <p className="text-sm text-fw-text-dim mt-1 flex items-center gap-1">
              {editMode
                ? 'Drag shipments between containers to adjust the load plan'
                : '3D container visualization and loading sequence'}
              {editMode && (
                <HelpIcon
                  text="Use the grip handle on each shipment card to drag it between containers. Green glow = safe, amber = warning, red = blocked. The 3D preview on the right updates live. Use Undo/Redo to revert changes."
                  position="bottom"
                />
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Edit mode toggle */}
            <div className="flex rounded-lg border border-fw-border overflow-hidden">
              <button
                onClick={() => { setEditMode(false); setIsPlaying(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                  !editMode
                    ? 'bg-fw-cyan/10 text-fw-cyan border-r border-fw-cyan/20'
                    : 'text-fw-text-dim hover:text-fw-text border-r border-fw-border'
                }`}
              >
                <Eye size={14} />
                View
              </button>
              <button
                onClick={toggleEditMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                  editMode
                    ? 'bg-fw-cyan/10 text-fw-cyan'
                    : 'text-fw-text-dim hover:text-fw-text'
                }`}
              >
                <Pencil size={14} />
                Edit Plan
              </button>
            </div>

            {editMode && (
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={editor.undo}
                  disabled={!editor.canUndo}
                  className="p-1.5 rounded-md hover:bg-fw-surface-2 text-fw-text-dim disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Undo"
                >
                  <Undo2 size={16} />
                </button>
                <button
                  onClick={editor.redo}
                  disabled={!editor.canRedo}
                  className="p-1.5 rounded-md hover:bg-fw-surface-2 text-fw-text-dim disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Redo"
                >
                  <Redo2 size={16} />
                </button>
                <button
                  onClick={() => { editor.reset(); addToast('Load plan reset to optimized state', 'info'); }}
                  disabled={!editor.hasChanges}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-fw-text-dim hover:bg-fw-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Reset to optimized"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
                <div className="w-px h-5 bg-fw-border mx-1" />
                <button
                  onClick={handleSuggestPlan}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-fw-cyan bg-fw-cyan/10 border border-fw-cyan/30 hover:bg-fw-cyan/20 transition-colors"
                  title="AI-powered plan suggestion"
                >
                  <Sparkles size={14} />
                  Suggest Plan
                </button>
              </div>
            )}

            {!editMode && (
              <Link href="/replan">
                <Button variant="ghost" size="sm">
                  <RefreshCw size={14} />
                  Simulate Deviation
                  <ArrowRight size={14} />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* View Mode */}
        {!editMode && (
          <>
            <ContainerTabs
              containers={data.containersUsed}
              activeId={activeContainer}
              onSelect={handleTabChange}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4">
              <div className="lg:col-span-3 relative" data-tour="container-3d">
                <div className="h-[500px] rounded-lg overflow-hidden border border-fw-border">
                  <Container3DScene
                    containerType={currentContainer?.type}
                    loadSequence={currentSequence}
                    highlightedShipment={highlightedShipment}
                    selectedShipment={selectedShipment}
                    onSelectShipment={setSelectedShipment}
                    sceneRef={sceneRef}
                    className="h-full"
                  />
                </div>
                <div className="absolute top-3 right-3 flex gap-1">
                  {['iso', 'front', 'top', 'side'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => sceneRef.current?.setCameraPreset(preset)}
                      className="px-2 py-1 bg-fw-surface/80 border border-fw-border rounded text-xs font-mono text-fw-text-dim hover:text-fw-cyan hover:border-fw-cyan/40 transition-colors backdrop-blur-sm"
                    >
                      {preset.charAt(0).toUpperCase() + preset.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2" data-tour="load-details">
                <LoadDetailsPanel
                  container={currentContainer}
                  loadSequence={currentSequence}
                  onHighlight={setHighlightedShipment}
                  selectedShipment={selectedShipment}
                  onSelectShipment={setSelectedShipment}
                  onPlaySequence={handlePlaySequence}
                  onStepTo={handleStepTo}
                  isPlaying={isPlaying}
                  currentStep={currentStep}
                  totalSteps={currentSequence.length}
                />
              </div>
            </div>
          </>
        )}

        {/* Suggest Plan Overlay */}
        <SuggestPlanOverlay
          isOpen={showSuggestOverlay}
          phases={suggestResult?.phases}
          summary={suggestResult?.summary}
          onApply={handleApplyPlan}
          onDismiss={handleDismissPlan}
        />

        {/* Edit Mode */}
        {editMode && (
          <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            {/* Unassigned pool */}
            <UnassignedPool
              shipmentIds={editor.unassigned}
              onHighlightShipment={setHighlightedShipment}
              onHighlightEnd={() => setHighlightedShipment(null)}
            />

            {/* Live validation feedback */}
            {activeDragId && overContainerId && overContainerId !== 'unassigned' && (
              <div className="mt-3">
                <ConstraintFeedback validation={liveValidation} />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4" data-tour="drag-drop-editor">
              {/* Container columns */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {editor.containers.map((c) => (
                    <ContainerColumn
                      key={c.id}
                      container={c}
                      shipmentIds={editor.assignments[c.id] || []}
                      stats={editor.containerStats[c.id]}
                      validation={
                        activeDragId && overContainerId === c.id
                          ? liveValidation
                          : null
                      }
                      onHighlightShipment={setHighlightedShipment}
                      onHighlightEnd={() => setHighlightedShipment(null)}
                      isActive={activeContainer === c.id}
                      onSelect={handleTabChange}
                    />
                  ))}
                </div>
              </div>

              {/* 3D Preview */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-fw-text-dim">
                      3D Preview — {activeContainer}
                    </span>
                    <div className="flex gap-1">
                      {['iso', 'top'].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => sceneRef.current?.setCameraPreset(preset)}
                          className="px-1.5 py-0.5 bg-fw-surface border border-fw-border rounded text-[10px] font-mono text-fw-text-muted hover:text-fw-cyan transition-colors"
                        >
                          {preset.charAt(0).toUpperCase() + preset.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-[360px] rounded-lg overflow-hidden border border-fw-border">
                    <Container3DScene
                      containerType={currentContainer?.type}
                      loadSequence={currentSequence}
                      highlightedShipment={highlightedShipment}
                      selectedShipment={selectedShipment}
                      onSelectShipment={setSelectedShipment}
                      sceneRef={sceneRef}
                      className="h-full"
                    />
                  </div>

                  {/* Quick stats */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {editor.containers.map((c) => {
                      const st = editor.containerStats[c.id];
                      return (
                        <button
                          key={c.id}
                          onClick={() => handleTabChange(c.id)}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            activeContainer === c.id
                              ? 'border-fw-cyan/50 bg-fw-cyan/5'
                              : 'border-fw-border hover:border-fw-border/80'
                          }`}
                        >
                          <p className="text-[10px] font-mono text-fw-text-dim">{c.id}</p>
                          <p className={`text-sm font-mono font-bold ${
                            (st?.utilization || 0) > 95
                              ? 'text-red-400'
                              : (st?.utilization || 0) > 85
                                ? 'text-fw-green'
                                : 'text-fw-text'
                          }`}>
                            {st?.utilization?.toFixed(1) || '0.0'}%
                          </p>
                          <p className="text-[10px] text-fw-text-muted">{st?.count || 0} shipments</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Drag overlay */}
            <DragOverlay dropAnimation={{ duration: 200 }}>
              {draggedShipment ? <DragOverlayCard shipment={draggedShipment} /> : null}
            </DragOverlay>
          </DndContext>

          {/* Container Summary Table */}
          <ContainerSummaryTable
            containers={editor.containers}
            assignments={editor.assignments}
            unassignedCount={editor.unassigned.length}
            allShipments={editor.allShipments}
          />
          </>
        )}
      </div>
    </PageLoader>
  );
}
