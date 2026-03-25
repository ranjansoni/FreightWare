'use client';

import { useState, useCallback, useMemo } from 'react';
import { shipments as allShipmentsData, getShipmentById } from '@/data/mockShipments';
import { containerTypes } from '@/utils/containerSpecs';
import { packShipmentsIntoContainer } from '@/utils/mockBinPacker';
import { validateMove } from '@/utils/loadPlanValidation';

function buildAssignmentsFromResult(containersUsed) {
  const map = {};
  for (const c of containersUsed) {
    map[c.id] = [...c.shipments];
  }
  return map;
}

function computeContainerStats(containerId, shipmentIds, containerType) {
  const spec = containerTypes[containerType];
  if (!spec) return { weight: 0, volume: 0, utilization: 0, weightUtil: 0, count: 0 };

  let weight = 0;
  let volume = 0;
  for (const id of shipmentIds) {
    const s = getShipmentById(id);
    if (s) {
      weight += s.weight || 0;
      volume += s.volume || 0;
    }
  }

  return {
    weight,
    volume: Math.round(volume * 100) / 100,
    utilization: Math.round((volume / spec.volume) * 1000) / 10,
    weightUtil: Math.round((weight / spec.maxWeight) * 1000) / 10,
    count: shipmentIds.length,
  };
}

function buildLoadSequence(shipmentIds, containerType) {
  const items = [];
  for (const shipmentId of shipmentIds) {
    const shipment = getShipmentById(shipmentId);
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
  const packed = packShipmentsIntoContainer(items, containerType);
  return packed.map((p, idx) => ({ ...p, loadOrder: idx + 1 }));
}

/**
 * Custom hook managing the editable load plan state.
 * Provides assignments, stats, load sequences, undo/redo, and validation.
 */
export default function useLoadPlanEditor(containersUsed, extraUnassigned = []) {
  const initialAssignments = useMemo(
    () => buildAssignmentsFromResult(containersUsed),
    [containersUsed]
  );

  const allAssignedIds = useMemo(() => {
    const set = new Set();
    for (const ids of Object.values(initialAssignments)) {
      for (const id of ids) set.add(id);
    }
    return set;
  }, [initialAssignments]);

  const initialUnassigned = useMemo(
    () => extraUnassigned.filter((id) => !allAssignedIds.has(id)),
    [extraUnassigned, allAssignedIds]
  );

  const [assignments, setAssignments] = useState(initialAssignments);
  const [unassigned, setUnassigned] = useState(initialUnassigned);
  const [history, setHistory] = useState({ past: [], future: [] });

  const containers = useMemo(() => containersUsed, [containersUsed]);

  const allShipments = useMemo(() => allShipmentsData, []);

  const containerStats = useMemo(() => {
    const stats = {};
    for (const c of containers) {
      stats[c.id] = computeContainerStats(c.id, assignments[c.id] || [], c.type);
    }
    return stats;
  }, [assignments, containers]);

  const loadSequences = useMemo(() => {
    const seqs = {};
    for (const c of containers) {
      seqs[c.id] = buildLoadSequence(assignments[c.id] || [], c.type);
    }
    return seqs;
  }, [assignments, containers]);

  const pushHistory = useCallback((prevAssignments, prevUnassigned) => {
    setHistory((h) => ({
      past: [...h.past.slice(-19), { assignments: prevAssignments, unassigned: prevUnassigned }],
      future: [],
    }));
  }, []);

  const moveShipment = useCallback(
    (shipmentId, fromId, toId) => {
      if (fromId === toId) return { allowed: true, errors: [], warnings: [] };

      const shipment = getShipmentById(shipmentId);
      if (!shipment) return { allowed: false, errors: [{ message: 'Shipment not found' }], warnings: [] };

      if (toId !== 'unassigned') {
        const result = validateMove(shipment, toId, assignments, allShipments, containers);
        if (!result.allowed) return result;
      }

      pushHistory(assignments, unassigned);

      setAssignments((prev) => {
        const next = { ...prev };
        if (fromId !== 'unassigned') {
          next[fromId] = (prev[fromId] || []).filter((id) => id !== shipmentId);
        }
        if (toId !== 'unassigned') {
          next[toId] = [...(prev[toId] || []), shipmentId];
        }
        return next;
      });

      setUnassigned((prev) => {
        let next = prev;
        if (fromId === 'unassigned') {
          next = prev.filter((id) => id !== shipmentId);
        }
        if (toId === 'unassigned') {
          next = [...(fromId === 'unassigned' ? prev : next), shipmentId];
        }
        return next;
      });

      if (toId !== 'unassigned') {
        const result = validateMove(shipment, toId, assignments, allShipments, containers);
        return { allowed: true, errors: [], warnings: result.warnings };
      }
      return { allowed: true, errors: [], warnings: [] };
    },
    [assignments, unassigned, allShipments, containers, pushHistory]
  );

  const previewMove = useCallback(
    (shipmentId, targetContainerId) => {
      if (targetContainerId === 'unassigned') {
        return { allowed: true, errors: [], warnings: [] };
      }
      const shipment = getShipmentById(shipmentId);
      if (!shipment) return { allowed: false, errors: [{ message: 'Shipment not found' }], warnings: [] };
      return validateMove(shipment, targetContainerId, assignments, allShipments, containers);
    },
    [assignments, allShipments, containers]
  );

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.past.length === 0) return h;
      const prev = h.past[h.past.length - 1];
      return {
        past: h.past.slice(0, -1),
        future: [{ assignments, unassigned }, ...h.future],
      };
    });
    setHistory((h) => {
      if (h.future.length > 0 || h.past.length >= 0) {
        return h;
      }
      return h;
    });
  }, [assignments, unassigned]);

  const performUndo = useCallback(() => {
    if (history.past.length === 0) return;
    const prev = history.past[history.past.length - 1];
    setHistory((h) => ({
      past: h.past.slice(0, -1),
      future: [{ assignments, unassigned }, ...h.future],
    }));
    setAssignments(prev.assignments);
    setUnassigned(prev.unassigned);
  }, [history, assignments, unassigned]);

  const performRedo = useCallback(() => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    setHistory((h) => ({
      past: [...h.past, { assignments, unassigned }],
      future: h.future.slice(1),
    }));
    setAssignments(next.assignments);
    setUnassigned(next.unassigned);
  }, [history, assignments, unassigned]);

  const reset = useCallback(() => {
    pushHistory(assignments, unassigned);
    setAssignments(initialAssignments);
    setUnassigned(initialUnassigned);
  }, [assignments, unassigned, initialAssignments, initialUnassigned, pushHistory]);

  const applyPlan = useCallback((newAssignments, newUnassigned) => {
    pushHistory(assignments, unassigned);
    setAssignments(newAssignments);
    setUnassigned(newUnassigned);
  }, [assignments, unassigned, pushHistory]);

  const hasChanges = useMemo(() => {
    return JSON.stringify(assignments) !== JSON.stringify(initialAssignments) ||
      JSON.stringify(unassigned) !== JSON.stringify(initialUnassigned);
  }, [assignments, unassigned, initialAssignments, initialUnassigned]);

  return {
    assignments,
    unassigned,
    containers,
    containerStats,
    loadSequences,
    allShipments,
    moveShipment,
    previewMove,
    undo: performUndo,
    redo: performRedo,
    reset,
    applyPlan,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    hasChanges,
  };
}
