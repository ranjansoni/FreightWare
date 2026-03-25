import { Sparkles } from 'lucide-react';

const colorMap = {
  green: 'bg-fw-green/10 border-fw-green/30 text-fw-green',
  amber: 'bg-fw-amber/10 border-fw-amber/30 text-fw-amber',
  red: 'bg-fw-red/10 border-fw-red/30 text-fw-red',
  cyan: 'bg-fw-cyan/10 border-fw-cyan/30 text-fw-cyan',
  purple: 'bg-fw-purple/10 border-fw-purple/30 text-fw-purple',
  gray: 'bg-fw-surface-2 border-fw-border text-fw-text-muted',
};

const statusMap = {
  clean: 'green',
  confirmed: 'green',
  'auto-corrected': 'amber',
  flagged: 'red',
  'needs-review': 'red',
  'cleaning-required': 'red',
  loaded: 'cyan',
  standard: 'gray',
  high: 'amber',
  critical: 'red',
  low: 'gray',
};

export default function Badge({ children, color, status, className = '' }) {
  const resolvedColor = color || statusMap[status] || 'gray';
  const classes = colorMap[resolvedColor] || colorMap.gray;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono uppercase tracking-wide border ${classes} ${className}`}
    >
      {children}
    </span>
  );
}

export function AIBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-fw-purple/10 border border-fw-purple/30 text-fw-purple text-xs font-mono">
      <Sparkles size={12} /> AI
    </span>
  );
}
