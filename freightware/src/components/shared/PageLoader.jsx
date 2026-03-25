'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomFact, pageConfig } from '@/data/loaderContent';
import HarborScene from '@/components/loaders/HarborScene';
import ContainerScan from '@/components/loaders/ContainerScan';
import TetrisPack from '@/components/loaders/TetrisPack';
import CraneLoad from '@/components/loaders/CraneLoad';
import ShipReroute from '@/components/loaders/ShipReroute';
import ForkliftScene from '@/components/loaders/ForkliftScene';
import ChartPrint from '@/components/loaders/ChartPrint';

const THEME_COMPONENTS = {
  dashboard: HarborScene,
  shipments: ContainerScan,
  optimizer: TetrisPack,
  loadplan: CraneLoad,
  replan: ShipReroute,
  tablet: ForkliftScene,
  reports: ChartPrint,
};

export default function PageLoader({ theme = 'dashboard', children }) {
  const [loading, setLoading] = useState(true);
  const [fact, setFact] = useState(null);
  const config = pageConfig[theme] || pageConfig.dashboard;
  const SceneComponent = THEME_COMPONENTS[theme] || HarborScene;
  const isTablet = theme === 'tablet';

  useEffect(() => {
    setFact(getRandomFact());
    const timer = setTimeout(() => setLoading(false), config.duration);
    return () => clearTimeout(timer);
  }, [config.duration]);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${
              isTablet ? 'bg-slate-50' : 'bg-fw-bg'
            }`}
          >
            <div className="w-full max-w-lg px-6 flex flex-col items-center">
              {/* Animation scene */}
              <div className="w-full h-52 mb-8">
                <SceneComponent />
              </div>

              {/* Loading text */}
              <p className={`text-sm font-mono tracking-wide mb-4 ${
                isTablet ? 'text-slate-500' : 'text-fw-text-muted'
              }`}>
                {config.loadingText}
              </p>

              {/* Industry fact */}
              <div className={`text-center max-w-md mb-8 min-h-[3rem] flex items-center ${
                isTablet ? 'text-slate-600' : ''
              }`}>
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className={`text-sm leading-relaxed italic ${
                    isTablet ? 'text-slate-500' : 'text-fw-text-dim'
                  }`}
                >
                  {fact?.text}
                </motion.p>
              </div>

              {/* Progress bar */}
              <div className={`w-full max-w-xs h-1 rounded-full overflow-hidden ${
                isTablet ? 'bg-slate-200' : 'bg-fw-surface-2'
              }`}>
                <div
                  className={`h-full rounded-full ${
                    isTablet ? 'bg-blue-500' : 'bg-fw-cyan'
                  }`}
                  style={{
                    animation: `progress-fill ${config.duration}ms ease-out forwards`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.3, delay: loading ? 0 : 0.1 }}
      >
        {children}
      </motion.div>
    </>
  );
}
