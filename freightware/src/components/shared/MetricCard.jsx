'use client';

import Card from '@/components/shared/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({
  label,
  value,
  subtitle,
  trend,
  trendLabel,
  icon: Icon,
  children,
}) {
  const trendUp = trend === 'up';
  const trendColor = trendUp ? 'text-fw-green' : 'text-fw-red';

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-fw-text-dim">{label}</p>
          <p className="text-2xl font-display font-bold text-fw-text mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-fw-text-muted mt-1">{subtitle}</p>
          )}
          {trendLabel && (
            <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
              {trendUp ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span className="text-xs font-medium">{trendLabel}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-fw-cyan/10 flex items-center justify-center flex-shrink-0">
            <Icon size={20} className="text-fw-cyan" />
          </div>
        )}
      </div>
      {children}
    </Card>
  );
}
