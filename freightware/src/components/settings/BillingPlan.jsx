'use client';

import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import ProgressBar from '@/components/shared/ProgressBar';
import HelpIcon from '@/components/shared/HelpIcon';
import { useToast } from '@/components/shared/ToastProvider';
import { billingPlan, planTiers } from '@/data/mockSettings';
import { CreditCard, Zap, Package, Box, CheckCircle2 } from 'lucide-react';

export default function BillingPlan() {
  const { addToast } = useToast();

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-base font-display font-semibold text-fw-text">
            Current Plan
          </h3>
          <Badge color="cyan">{billingPlan.currentPlan}</Badge>
          <HelpIcon
            text="Your subscription plan determines optimization limits, team size, and available features. Usage resets monthly on your renewal date."
            position="bottom-right"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-fw-bg border border-fw-border rounded-lg p-4 text-center">
            <Zap size={20} className="text-fw-cyan mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-fw-text">{billingPlan.optimizationsUsed}</p>
            <p className="text-xs text-fw-text-muted">Optimizations this month</p>
          </div>
          <div className="bg-fw-bg border border-fw-border rounded-lg p-4 text-center">
            <Package size={20} className="text-fw-green mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-fw-text">{billingPlan.shipmentsProcessed.toLocaleString()}</p>
            <p className="text-xs text-fw-text-muted">Shipments processed</p>
          </div>
          <div className="bg-fw-bg border border-fw-border rounded-lg p-4 text-center">
            <Box size={20} className="text-fw-amber mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-fw-text">{billingPlan.containersPlanned}</p>
            <p className="text-xs text-fw-text-muted">Containers planned</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-fw-text-dim">
              Optimization usage: {billingPlan.optimizationsUsed} of {billingPlan.optimizationsLimit}
            </span>
            <span className="text-xs text-fw-text-muted">
              Renews {billingPlan.renewalDate}
            </span>
          </div>
          <ProgressBar
            value={billingPlan.optimizationsUsed}
            max={billingPlan.optimizationsLimit}
            color={billingPlan.optimizationsUsed > billingPlan.optimizationsLimit * 0.8 ? 'amber' : 'cyan'}
            showPercent={false}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-fw-text-muted">
          <CreditCard size={14} />
          <span>${billingPlan.monthlyPrice}/month · Visa ending 4242</span>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-display font-semibold text-fw-text mb-4 uppercase tracking-wider">
          Available Plans
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {planTiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-lg border p-5 ${
                tier.current
                  ? 'border-fw-cyan/40 bg-fw-cyan/5'
                  : 'border-fw-border'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-display font-bold text-fw-text">
                  {tier.name}
                </h4>
                {tier.current && <Badge color="cyan">Current</Badge>}
              </div>
              <p className="text-2xl font-display font-bold text-fw-text mb-3">
                {tier.price ? `$${tier.price}` : 'Custom'}
                {tier.price && <span className="text-xs text-fw-text-muted font-normal">/mo</span>}
              </p>
              <ul className="space-y-1.5 mb-4">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-fw-text-dim">
                    <CheckCircle2 size={12} className={tier.current ? 'text-fw-cyan' : 'text-fw-text-muted'} />
                    {f}
                  </li>
                ))}
              </ul>
              {!tier.current && (
                <Button
                  variant={tier.name === 'Enterprise' ? 'primary' : 'ghost'}
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    addToast(
                      tier.name === 'Enterprise'
                        ? 'Contact sales@freightware.io for Enterprise'
                        : `Switching to ${tier.name} plan coming in v1.0`,
                      'info'
                    )
                  }
                >
                  {tier.name === 'Enterprise' ? 'Contact Sales' : `Switch to ${tier.name}`}
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
