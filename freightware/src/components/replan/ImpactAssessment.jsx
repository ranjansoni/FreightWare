import Card from '@/components/shared/Card';
import { AIBadge } from '@/components/shared/Badge';
import HelpIcon from '@/components/shared/HelpIcon';
import { AlertTriangle, Clock, DollarSign } from 'lucide-react';

export default function ImpactAssessment() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-base font-display font-semibold text-fw-text">
          Impact Assessment
        </h3>
        <AIBadge />
        <HelpIcon
          text="AI-generated impact analysis showing which containers are affected, whether cargo still fits, estimated overflow cost, and time comparison vs. manual replanning."
          position="bottom-left"
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-fw-amber mt-0.5" />
          <p className="text-sm text-fw-text-dim">
            This deviation affects Container{' '}
            <span className="font-mono text-fw-text">CTR-001</span> (currently
            at 94.2% utilization)
          </p>
        </div>
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-fw-red mt-0.5" />
          <p className="text-sm text-fw-text-dim">
            Increased volume cannot fit in current arrangement
          </p>
        </div>
        <div className="bg-fw-red/5 border border-fw-red/20 rounded-lg p-3 mt-2">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-fw-red" />
            <span className="text-sm font-semibold text-fw-red">
              Risk: Overflow to 4th container at $2,200 CAD
            </span>
          </div>
        </div>
        <div className="flex items-start gap-3 mt-2">
          <Clock size={16} className="text-fw-text-muted mt-0.5" />
          <p className="text-sm text-fw-text-muted">
            Manual replanning: ~45 minutes. FreightWare:{' '}
            <span className="text-fw-cyan font-semibold">seconds.</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
