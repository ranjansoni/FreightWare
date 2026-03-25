'use client';

const BARS = [
  { x: 60,  height: 55, color: '#06B6D4', delay: 0 },
  { x: 105, height: 80, color: '#10B981', delay: 0.15 },
  { x: 150, height: 45, color: '#8B5CF6', delay: 0.3 },
  { x: 195, height: 95, color: '#F59E0B', delay: 0.45 },
  { x: 240, height: 70, color: '#EC4899', delay: 0.6 },
  { x: 285, height: 60, color: '#06B6D4', delay: 0.75 },
  { x: 330, height: 85, color: '#EF4444', delay: 0.9 },
];

export default function ChartPrint() {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 420 180" className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Axes */}
        <line x1="45" y1="10" x2="45" y2="145" stroke="#2A3450" strokeWidth="1.5" />
        <line x1="45" y1="145" x2="380" y2="145" stroke="#2A3450" strokeWidth="1.5" />

        {/* Y-axis ticks */}
        {[0, 1, 2, 3].map((i) => {
          const y = 145 - i * 35;
          return (
            <g key={i}>
              <line x1="40" y1={y} x2="380" y2={y} stroke="#2A3450" strokeWidth="0.5" strokeDasharray="3,3" />
              <text x="35" y={y + 3} textAnchor="end" fill="#6B7280" fontSize="7" fontFamily="monospace">
                {i * 25}%
              </text>
            </g>
          );
        })}

        {/* Bars growing from bottom */}
        {BARS.map((bar, i) => {
          const y = 145 - bar.height;
          return (
            <g key={i}>
              <rect
                x={bar.x} y={145} width={30} height={0} rx={3}
                fill={bar.color} opacity="0.7"
              >
                <animate
                  attributeName="y"
                  values={`145;${y}`}
                  dur="0.6s"
                  begin={`${bar.delay}s`}
                  fill="freeze"
                />
                <animate
                  attributeName="height"
                  values={`0;${bar.height}`}
                  dur="0.6s"
                  begin={`${bar.delay}s`}
                  fill="freeze"
                />
              </rect>
              {/* Value label */}
              <text
                x={bar.x + 15} y={y - 5}
                textAnchor="middle"
                fill={bar.color}
                fontSize="8"
                fontFamily="monospace"
                opacity="0"
              >
                {Math.round(bar.height / 0.95)}%
                <animate
                  attributeName="opacity"
                  values="0;1"
                  dur="0.3s"
                  begin={`${bar.delay + 0.4}s`}
                  fill="freeze"
                />
              </text>
            </g>
          );
        })}

        {/* Trend line connecting bar tops */}
        <polyline
          points={BARS.map((b) => `${b.x + 15},${145 - b.height}`).join(' ')}
          fill="none"
          stroke="#06B6D4"
          strokeWidth="1.5"
          strokeDasharray="200"
          strokeDashoffset="200"
          opacity="0.5"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="200;0"
            dur="0.8s"
            begin="1s"
            fill="freeze"
          />
        </polyline>

        {/* Report label */}
        <text x="210" y="170" textAnchor="middle" fill="#6B7280" fontSize="8" fontFamily="monospace">
          COMPILING ANALYTICS
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
        </text>
      </svg>
    </div>
  );
}
