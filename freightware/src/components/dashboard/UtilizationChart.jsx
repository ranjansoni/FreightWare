'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '@/components/shared/Card';
import ChartTooltip from '@/components/shared/ChartTooltip';
import HelpIcon from '@/components/shared/HelpIcon';
import { weeklyUtilizationData } from '@/data/mockOptimizationResult';

export default function UtilizationChart() {
  return (
    <Card className="h-full" data-tour="utilization-chart">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-base font-display font-semibold text-fw-text">
          Utilization Trend
        </h3>
        <HelpIcon
          text="Volume utilization percentage — how much of each container's internal volume is used. 'Before' shows the historical average with manual planning (~72%). 'With FreightWare' shows AI-optimized consolidation (~91%)."
          position="bottom-right"
        />
      </div>
      <p className="text-xs text-fw-text-muted mb-4">
        Rolling 4-week container utilization — Vancouver export operations
      </p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyUtilizationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A3450" />
            <XAxis
              dataKey="week"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: '#2A3450' }}
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: '#2A3450' }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            />
            <Area
              type="monotone"
              dataKey="before"
              name="Before FreightWare"
              stroke="#6B7280"
              strokeDasharray="5 5"
              fill="#6B7280"
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="after"
              name="With FreightWare"
              stroke="#06B6D4"
              fill="#06B6D4"
              fillOpacity={0.15}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
