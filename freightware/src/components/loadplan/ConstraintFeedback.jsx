'use client';

import { AlertCircle, CheckCircle2, AlertTriangle, ShieldAlert, Thermometer, Weight, Truck, Package } from 'lucide-react';

const RULE_ICONS = {
  'weight-limit': Weight,
  'volume-limit': Package,
  'volume-warning': Package,
  'hazmat-segregation': ShieldAlert,
  'temp-conflict': Thermometer,
  'temp-range-mismatch': Thermometer,
  'fragile-heavy-container': AlertTriangle,
  'fragile-hazmat-mix': ShieldAlert,
  'route-mismatch': Truck,
};

export default function ConstraintFeedback({ validation, className = '' }) {
  if (!validation) return null;

  const { allowed, errors, warnings } = validation;
  const allMessages = [
    ...errors.map((e) => ({ ...e, severity: 'error' })),
    ...warnings.map((w) => ({ ...w, severity: 'warning' })),
  ];

  if (allMessages.length === 0) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-fw-green/10 border border-fw-green/20 ${className}`}>
        <CheckCircle2 size={14} className="text-fw-green flex-shrink-0" />
        <span className="text-xs text-fw-green">All constraints satisfied — safe to place</span>
      </div>
    );
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {allMessages.map((msg, i) => {
        const Icon = RULE_ICONS[msg.ruleId] || AlertCircle;
        const isError = msg.severity === 'error';

        return (
          <div
            key={`${msg.ruleId}-${i}`}
            className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${
              isError
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-amber-500/10 border-amber-500/20'
            }`}
          >
            <Icon
              size={14}
              className={`flex-shrink-0 mt-0.5 ${isError ? 'text-red-400' : 'text-amber-400'}`}
            />
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wide ${isError ? 'text-red-400' : 'text-amber-400'}`}>
                {msg.type}
              </span>
              <p className={`text-xs mt-0.5 ${isError ? 'text-red-300' : 'text-amber-300'}`}>
                {msg.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
