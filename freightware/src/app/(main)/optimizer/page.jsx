'use client';

import { useCallback } from 'react';
import { Zap } from 'lucide-react';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import ConstraintPanel from '@/components/optimizer/ConstraintPanel';
import OptimizationProgress from '@/components/optimizer/OptimizationProgress';
import ResultsSummary from '@/components/optimizer/ResultsSummary';
import PageLoader from '@/components/shared/PageLoader';
import { useApp } from '@/context/AppContext';
import usePageTitle from '@/utils/usePageTitle';

export default function OptimizerPage() {
  usePageTitle('Optimizer');
  const { optimizationState, runOptimization, shipments } = useApp();

  const handleRun = useCallback(() => {
    runOptimization();
  }, [runOptimization]);

  const handleProgressComplete = useCallback(() => {}, []);

  return (
    <PageLoader theme="optimizer">
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-fw-text">
            Load Optimization
          </h2>
          <p className="text-sm text-fw-text-dim mt-1">
            Configure constraints and run the optimizer — select containers, toggle rules, then hit Run
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <ConstraintPanel />
        </div>

        <div className="lg:col-span-3" data-tour="run-optimizer">
          {optimizationState === 'idle' && (
            <Card className="flex flex-col items-center justify-center min-h-[500px]">
              <div className="text-center mb-8">
                <p className="text-fw-text-dim text-sm mb-1">
                  {shipments.length} shipments ready · 5 containers available · 6 constraints active
                </p>
              </div>
              <Button onClick={handleRun} size="lg" className="px-12">
                <Zap size={20} />
                Run Optimization
              </Button>
            </Card>
          )}

          {optimizationState === 'running' && (
            <Card className="min-h-[500px] flex items-center justify-center">
              <OptimizationProgress onComplete={handleProgressComplete} />
            </Card>
          )}

          {optimizationState === 'complete' && (
            <ResultsSummary />
          )}
        </div>
      </div>
    </div>
    </PageLoader>
  );
}
