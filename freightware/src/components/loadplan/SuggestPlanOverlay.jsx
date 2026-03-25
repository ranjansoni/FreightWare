'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, Sparkles, ArrowRight, X, AlertTriangle } from 'lucide-react';
import Button from '@/components/shared/Button';

function PhaseRow({ phase, index, status }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 py-2.5"
    >
      <div className="mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {status === 'running' && (
          <Loader2 size={18} className="text-fw-cyan animate-spin" />
        )}
        {status === 'complete' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            <CheckCircle2 size={18} className="text-fw-green" />
          </motion.div>
        )}
        {status === 'pending' && (
          <div className="w-2 h-2 rounded-full bg-fw-border" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium transition-colors duration-300 ${
          status === 'running'
            ? 'text-fw-cyan'
            : status === 'complete'
              ? 'text-fw-text'
              : 'text-fw-text-muted'
        }`}>
          {phase.label}{status === 'running' ? '...' : ''}
        </p>
        {status === 'complete' && (
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-xs text-fw-text-dim mt-0.5"
          >
            {phase.detail}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export default function SuggestPlanOverlay({ isOpen, phases, summary, onApply, onDismiss }) {
  const [currentPhase, setCurrentPhase] = useState(-1);
  const [phaseStatuses, setPhaseStatuses] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  const startAnimation = useCallback(() => {
    if (!phases || phases.length === 0) return;

    setCurrentPhase(0);
    setPhaseStatuses(phases.map(() => 'pending'));
    setShowSummary(false);
  }, [phases]);

  useEffect(() => {
    if (isOpen && phases) {
      startAnimation();
    }
    if (!isOpen) {
      setCurrentPhase(-1);
      setPhaseStatuses([]);
      setShowSummary(false);
    }
  }, [isOpen, phases, startAnimation]);

  useEffect(() => {
    if (currentPhase < 0 || !phases || currentPhase >= phases.length) return;

    setPhaseStatuses((prev) => {
      const next = [...prev];
      next[currentPhase] = 'running';
      return next;
    });

    const timer = setTimeout(() => {
      setPhaseStatuses((prev) => {
        const next = [...prev];
        next[currentPhase] = 'complete';
        return next;
      });

      if (currentPhase < phases.length - 1) {
        setTimeout(() => setCurrentPhase((p) => p + 1), 200);
      } else {
        setTimeout(() => setShowSummary(true), 400);
      }
    }, phases[currentPhase].durationMs);

    return () => clearTimeout(timer);
  }, [currentPhase, phases]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg mx-4 bg-fw-surface border border-fw-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-fw-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-fw-cyan/10 border border-fw-cyan/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-fw-cyan" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-fw-text">
                    FreightWare AI Optimization
                  </h3>
                  <p className="text-xs text-fw-text-muted mt-0.5">
                    Analyzing {summary?.totalShipments || 0} shipments across {phases?.length || 0} constraint passes
                  </p>
                </div>
              </div>
              {showSummary && (
                <button
                  onClick={onDismiss}
                  className="p-1.5 rounded-md hover:bg-fw-surface-2 text-fw-text-muted transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Phases */}
          <div className="px-6 py-3 max-h-[340px] overflow-y-auto">
            {phases?.map((phase, i) => (
              phaseStatuses[i] !== 'pending' || i <= currentPhase ? (
                <PhaseRow
                  key={i}
                  phase={phase}
                  index={i}
                  status={phaseStatuses[i] || 'pending'}
                />
              ) : (
                <div key={i} className="flex items-center gap-3 py-2.5">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-fw-border" />
                  </div>
                  <p className="text-sm text-fw-text-muted">{phase.label}</p>
                </div>
              )
            ))}
          </div>

          {/* Summary + Actions */}
          <AnimatePresence>
            {showSummary && summary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.4 }}
                className="border-t border-fw-border/50"
              >
                <div className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={16} className="text-fw-green" />
                    <span className="text-sm font-medium text-fw-green">
                      Optimization Complete
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2.5 rounded-lg bg-fw-bg border border-fw-border">
                      <p className="text-lg font-mono font-bold text-fw-cyan">
                        {summary.reassigned}
                      </p>
                      <p className="text-[10px] text-fw-text-muted mt-0.5">Reassigned</p>
                    </div>
                    <div className="text-center p-2.5 rounded-lg bg-fw-bg border border-fw-border">
                      <p className="text-lg font-mono font-bold text-fw-green">
                        {summary.avgUtilization}%
                      </p>
                      <p className="text-[10px] text-fw-text-muted mt-0.5">Avg Utilization</p>
                    </div>
                    <div className="text-center p-2.5 rounded-lg bg-fw-bg border border-fw-border">
                      <p className={`text-lg font-mono font-bold ${summary.overflow > 0 ? 'text-amber-400' : 'text-fw-green'}`}>
                        {summary.overflow}
                      </p>
                      <p className="text-[10px] text-fw-text-muted mt-0.5">Overflow</p>
                    </div>
                  </div>

                  {summary.overflow > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4">
                      <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
                      <p className="text-xs text-amber-300">
                        {summary.overflow} shipment{summary.overflow !== 1 ? 's' : ''} could not fit — moved to unassigned pool. Consider booking an additional container.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={onApply}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={14} />
                      Apply Plan
                    </Button>
                    <button
                      onClick={onDismiss}
                      className="px-4 py-2 rounded-lg text-sm text-fw-text-dim hover:bg-fw-surface-2 border border-fw-border transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
