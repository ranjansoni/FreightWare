'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

const STAGES = [
  { label: 'Analyzing deviation impact...', duration: 300 },
  { label: 'Warm-starting from current solution...', duration: 300 },
  { label: 'Replanning with updated constraints...', duration: 500 },
  { label: 'New plan found — 0.8 seconds', duration: 500, isComplete: true },
];

export default function ReplanAnimation({ onComplete }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const e = (Date.now() - startTime) / 1000;
      setElapsed(Math.min(0.8, e).toFixed(1));
    }, 50);

    let totalDelay = 0;
    STAGES.forEach((stage, i) => {
      setTimeout(() => setCurrentStage(i), totalDelay);
      totalDelay += stage.duration;
    });

    setTimeout(() => {
      clearInterval(timer);
      setElapsed('0.8');
      onComplete?.();
    }, totalDelay + 200);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-14 h-14 rounded-2xl bg-fw-cyan/10 flex items-center justify-center mb-6">
        <RefreshCw size={28} className="text-fw-cyan animate-spin" />
      </div>

      <div className="w-full max-w-sm space-y-3 mb-6">
        {STAGES.map((stage, i) => (
          <AnimatePresence key={i}>
            {i <= currentStage && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                {i < currentStage || stage.isComplete ? (
                  <CheckCircle2
                    size={16}
                    className={`flex-shrink-0 ${
                      stage.isComplete ? 'text-fw-green' : 'text-fw-green'
                    }`}
                  />
                ) : (
                  <Loader2
                    size={16}
                    className="flex-shrink-0 text-fw-cyan animate-spin"
                  />
                )}
                <span
                  className={`text-sm ${
                    stage.isComplete && i === currentStage
                      ? 'text-fw-green font-semibold'
                      : 'text-fw-text-dim'
                  }`}
                >
                  {stage.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      <p className="text-4xl font-display font-bold text-fw-cyan font-mono">
        {elapsed}s
      </p>
      <p className="text-xs text-fw-text-muted mt-1">Replan time</p>
    </div>
  );
}
