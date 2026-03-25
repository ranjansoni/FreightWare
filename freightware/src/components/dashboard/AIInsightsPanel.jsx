'use client';

import Link from 'next/link';
import { AlertTriangle, Lightbulb, BarChart3, RefreshCw } from 'lucide-react';
import Card from '@/components/shared/Card';
import { AIBadge } from '@/components/shared/Badge';
import HelpIcon from '@/components/shared/HelpIcon';

const insights = [
  {
    icon: AlertTriangle,
    iconColor: 'text-fw-amber',
    text: 'SHP-0003 dimensions likely understated — recommend dock verification before loading',
    href: '/shipments',
  },
  {
    icon: Lightbulb,
    iconColor: 'text-fw-cyan',
    text: 'CLT-002 and CLT-006 shipments share destination (Shanghai) — consolidation opportunity',
    href: '/optimizer',
  },
  {
    icon: BarChart3,
    iconColor: 'text-fw-green',
    text: 'Historical pattern: Friday bookings from Pacific Timber typically +15% volume vs manifest',
    href: '/shipments',
  },
  {
    icon: RefreshCw,
    iconColor: 'text-fw-amber',
    text: '2 shipments flagged for data cleaning — review before optimization run',
    href: '/shipments',
  },
];

export default function AIInsightsPanel() {
  return (
    <Card className="h-full border-fw-purple/20" data-tour="ai-insights">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-base font-display font-semibold text-fw-text">
          AI Recommendations
        </h3>
        <AIBadge />
        <HelpIcon
          text="FreightWare AI analyzes shipment data to detect anomalies, suggest consolidation opportunities, and flag potential issues before they cause delays or overcharges."
          position="bottom-left"
        />
      </div>
      <div className="space-y-3">
        {insights.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={i}
              href={item.href}
              className="flex items-start gap-3 p-3 rounded-md hover:bg-fw-surface-2 transition-colors group"
            >
              <Icon
                size={16}
                className={`${item.iconColor} mt-0.5 flex-shrink-0`}
              />
              <p className="text-sm text-fw-text-dim group-hover:text-fw-text transition-colors leading-relaxed">
                {item.text}
              </p>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
