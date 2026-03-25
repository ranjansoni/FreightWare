'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import ReportCard from '@/components/shared/ReportCard';
import ChartTooltip from '@/components/shared/ChartTooltip';
import { optimizationResult } from '@/data/mockOptimizationResult';
import { buildWaterfallData } from '@/utils/reportUtils';

function WaterfallBar(props) {
  const { x, y, width, height, base, fill } = props;
  const barY = y;
  const barHeight = height;

  return (
    <g>
      {/* Invisible base spacer */}
      <rect x={x} y={barY + barHeight} width={width} height={0} fill="transparent" />
      {/* Visible bar */}
      <rect x={x} y={barY} width={width} height={barHeight} rx={4} fill={fill} opacity={0.85} />
      {/* Glow for final bar */}
      {fill === '#06B6D4' && (
        <rect x={x - 2} y={barY - 2} width={width + 4} height={barHeight + 4} rx={6} fill="#06B6D4" opacity={0.15} />
      )}
    </g>
  );
}

export default function CostWaterfall() {
  const data = useMemo(() => buildWaterfallData(optimizationResult), []);

  const chartData = data.map((d) => ({
    name: d.name,
    base: d.base,
    value: d.value,
    fill: d.fill,
    label: d.label,
  }));

  return (
    <ReportCard
      id="cost-waterfall"
      title="Cost Savings Waterfall"
      subtitle="Weekly container cost breakdown — baseline vs. optimized"
      insight="40% cost reduction: $13,500 → $5,420 net cost"
      insightColor="text-fw-green"
      helpText="A waterfall chart shows how costs decrease step by step. Starting from the manual baseline cost, each bar subtracts a specific saving — container reduction, overflow avoidance, CO₂ credits — until you reach the final optimized cost."
      footer="Baseline assumes 5 containers at industry-average 72.3% utilization. Optimized uses 3 containers at 91.5% avg utilization via OR-Tools CP-SAT solver."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barCategoryGap="20%">
          <XAxis
            dataKey="name"
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            axisLine={{ stroke: '#2A3450' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            axisLine={{ stroke: '#2A3450' }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            domain={[0, 15000]}
          />
          <Tooltip
            content={
              <ChartTooltip
                formatter={(v, entry) => {
                  const item = data.find((d) => d.name === entry.name);
                  return item?.label || `$${v.toLocaleString()}`;
                }}
              />
            }
          />
          <ReferenceLine y={0} stroke="#2A3450" />
          {/* Invisible base bar for waterfall effect */}
          <Bar dataKey="base" stackId="stack" fill="transparent" isAnimationActive={false} />
          <Bar
            dataKey="value"
            stackId="stack"
            shape={<WaterfallBar />}
            isAnimationActive={true}
            animationDuration={1200}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ReportCard>
  );
}
