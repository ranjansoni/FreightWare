'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/shared/ToastProvider';
import { formatCurrency } from '@/utils/formatters';
import HelpIcon from '@/components/shared/HelpIcon';
import {
  ArrowRight,
  Container,
  TrendingUp,
  DollarSign,
  Leaf,
  FileDown,
} from 'lucide-react';

export default function ResultsSummary() {
  const { optimizationResult } = useApp();
  const { addToast } = useToast();

  if (!optimizationResult) return null;
  const { baseline, optimized, savings } = optimizationResult;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-fw-border">
          <p className="text-xs text-fw-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            Manual Planning
            <HelpIcon
              text="Baseline estimate using industry-standard manual planning: first-fit packing at ~72% utilization. This is what most forwarders achieve without optimization software."
              position="bottom-right"
            />
          </p>
          <div className="space-y-3">
            <Stat
              icon={Container}
              label="Containers"
              value={baseline.containersNeeded}
            />
            <Stat
              icon={TrendingUp}
              label="Avg Utilization"
              value={`${baseline.avgUtilization}%`}
            />
            <Stat
              icon={DollarSign}
              label="Estimated Cost"
              value={formatCurrency(baseline.estimatedCost)}
            />
          </div>
        </Card>

        <Card className="border-fw-cyan/30" glow>
          <p className="text-xs text-fw-cyan uppercase tracking-wider mb-3 font-semibold flex items-center gap-2">
            FreightWare Optimized
            <HelpIcon
              text="Result of AI-driven constraint optimization using CP-SAT solver. The optimizer simultaneously respects all active constraints while minimizing containers and cost."
              position="bottom-left"
            />
          </p>
          <div className="space-y-3">
            <Stat
              icon={Container}
              label="Containers"
              value={optimized.containersNeeded}
              highlight
            />
            <Stat
              icon={TrendingUp}
              label="Avg Utilization"
              value={`${optimized.avgUtilization}%`}
              highlight
            />
            <Stat
              icon={DollarSign}
              label="Estimated Cost"
              value={formatCurrency(optimized.estimatedCost)}
              highlight
            />
          </div>
        </Card>
      </div>

      <Card className="bg-fw-green/5 border-fw-green/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl font-display font-bold text-fw-green">
                −{savings.containersReduced}
              </p>
              <p className="text-xs text-fw-text-dim">containers</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-fw-green">
                +{savings.utilizationGain}%
              </p>
              <p className="text-xs text-fw-text-dim">utilization</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-fw-green">
                {formatCurrency(savings.costSaved)}
              </p>
              <p className="text-xs text-fw-text-dim">saved</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-fw-green">
            <Leaf size={16} />
            <span className="text-sm font-medium">
              {savings.co2Reduced} tonnes CO₂ avoided
            </span>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Link href="/loadplan" className="flex-1">
          <Button className="w-full">
            View Load Plan
            <ArrowRight size={16} />
          </Button>
        </Link>
        <Button
          variant="ghost"
          onClick={() => addToast('PDF export coming in v1.0', 'info')}
        >
          <FileDown size={16} />
          Export Report
        </Button>
      </div>
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={16} className={highlight ? 'text-fw-cyan' : 'text-fw-text-muted'} />
      <span className="text-sm text-fw-text-dim flex-1">{label}</span>
      <span
        className={`text-sm font-mono font-semibold ${
          highlight ? 'text-fw-text' : 'text-fw-text-dim'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
