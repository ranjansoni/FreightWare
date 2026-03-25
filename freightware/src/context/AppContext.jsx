'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { shipments as initialShipments } from '@/data/mockShipments';
import { optimizationResult } from '@/data/mockOptimizationResult';
import { replanScenario } from '@/data/mockReplanScenario';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [shipments, setShipments] = useState(initialShipments);
  const [optimizationState, setOptimizationState] = useState('idle');
  const [optResult, setOptResult] = useState(null);
  const [replanState, setReplanState] = useState('idle');
  const [replanResult, setReplanResult] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tourActive, setTourActive] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem('fw-tour-seen')) {
        setTourActive(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1280px)');
    const handler = (e) => setSidebarCollapsed(e.matches);
    handler(mq);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const runOptimization = useCallback(() => {
    setOptimizationState('running');
    return new Promise((resolve) => {
      setTimeout(() => {
        setOptResult(optimizationResult);
        setOptimizationState('complete');
        resolve(optimizationResult);
      }, 4500);
    });
  }, []);

  const triggerReplan = useCallback(() => {
    setReplanState('deviation-received');
  }, []);

  const executeReplan = useCallback(() => {
    setReplanState('replanning');
    return new Promise((resolve) => {
      setTimeout(() => {
        setReplanResult(replanScenario.replanResult);
        setReplanState('complete');
        resolve(replanScenario.replanResult);
      }, 2000);
    });
  }, []);

  const updateShipment = useCallback((id, updates) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const importCSV = useCallback(() => {
    setShipments(initialShipments);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const startTour = useCallback(() => {
    setTourActive(true);
  }, []);

  const dismissTour = useCallback(() => {
    setTourActive(false);
    try {
      localStorage.setItem('fw-tour-seen', '1');
    } catch {}
  }, []);

  const value = {
    shipments,
    optimizationState,
    optimizationResult: optResult,
    replanState,
    replanResult,
    replanScenario,
    sidebarCollapsed,
    tourActive,
    runOptimization,
    triggerReplan,
    executeReplan,
    updateShipment,
    importCSV,
    toggleSidebar,
    startTour,
    dismissTour,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
