'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Cpu } from 'lucide-react';

const STAGES = [
  { label: 'Validating 25 shipment records...', duration: 500 },
  { label: 'Building constraint model (6 constraints)...', duration: 1000 },
  { label: 'Solving with OR-Tools CP-SAT...', duration: 2000, hasProgress: true },
  { label: 'Solution found — Status: OPTIMAL', duration: 500, isComplete: true },
];

export default function OptimizationProgress({ onComplete }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsed(((Date.now() - startTime) / 1000).toFixed(1));
    }, 100);

    let totalDelay = 0;
    STAGES.forEach((stage, i) => {
      setTimeout(() => setCurrentStage(i), totalDelay);
      totalDelay += stage.duration;
    });

    setTimeout(() => {
      clearInterval(timer);
      setElapsed('2.4');
      onComplete?.();
    }, totalDelay);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    if (STAGES[currentStage]?.hasProgress) {
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 8 + 2;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
        }
        setProgress(p);
      }, 80);
      return () => clearInterval(interval);
    }
  }, [currentStage]);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-fw-cyan/10 flex items-center justify-center mb-6">
        <Cpu size={32} className="text-fw-cyan animate-pulse" />
      </div>

      <div className="w-full max-w-md space-y-4 mb-8">
        {STAGES.map((stage, i) => (
          <AnimatePresence key={i}>
            {i <= currentStage && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                {i < currentStage || stage.isComplete ? (
                  <CheckCircle2 size={18} className="text-fw-green flex-shrink-0" />
                ) : (
                  <Loader2
                    size={18}
                    className="text-fw-cyan flex-shrink-0 animate-spin"
                  />
                )}
                <span
                  className={`text-sm ${
                    stage.isComplete && i === currentStage
                      ? 'text-fw-green font-semibold'
                      : i < currentStage
                      ? 'text-fw-text-dim'
                      : 'text-fw-text'
                  }`}
                >
                  {stage.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        ))}

        {STAGES[currentStage]?.hasProgress && (
          <div className="ml-8">
            <div className="w-full bg-fw-bg rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-fw-cyan h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-xs text-fw-text-muted mt-1 text-right font-mono">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-3xl font-display font-bold text-fw-cyan font-mono">
          {elapsed}s
        </p>
        <p className="text-xs text-fw-text-muted mt-1">Elapsed time</p>
      </div>
    </div>
  );
}
