'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import Button from '@/components/shared/Button';
import DeviationAlert from '@/components/replan/DeviationAlert';
import ImpactAssessment from '@/components/replan/ImpactAssessment';
import ReplanAnimation from '@/components/replan/ReplanAnimation';
import BeforeAfterView from '@/components/replan/BeforeAfterView';
import PageLoader from '@/components/shared/PageLoader';
import usePageTitle from '@/utils/usePageTitle';

export default function ReplanPage() {
  usePageTitle('Replan');
  const [stage, setStage] = useState('deviation');

  const handleReplan = useCallback(() => {
    setStage('replanning');
  }, []);

  const handleReplanComplete = useCallback(() => {
    setTimeout(() => setStage('complete'), 500);
  }, []);

  return (
    <PageLoader theme="replan">
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-fw-text">
            Real-time Replanning
          </h2>
          <p className="text-sm text-fw-text-dim mt-1">
            When dock scanners detect dimension mismatches, FreightWare replans in under a second
          </p>
        </div>
        {stage === 'complete' && (
          <Button variant="ghost" size="sm" onClick={() => setStage('deviation')}>
            <RefreshCw size={14} />
            Reset Demo
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <DeviationAlert />

        {stage === 'deviation' && (
          <>
            <ImpactAssessment />
            <div className="flex justify-center py-4">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Button onClick={handleReplan} size="lg" className="px-12">
                  <RefreshCw size={20} />
                  Replan Now
                </Button>
              </motion.div>
              <p className="text-xs text-fw-text-muted self-end ml-4">
                Warm-starts from current solution — only affected containers re-solved
              </p>
            </div>
          </>
        )}

        {stage === 'replanning' && (
          <div className="bg-fw-surface border border-fw-border rounded-lg">
            <ReplanAnimation onComplete={handleReplanComplete} />
          </div>
        )}

        {stage === 'complete' && <BeforeAfterView />}
      </div>
    </div>
    </PageLoader>
  );
}
