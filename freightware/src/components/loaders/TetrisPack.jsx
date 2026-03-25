'use client';

const BLOCKS = [
  { x: 10,  w: 80, h: 35, color: '#06B6D4', delay: 0 },
  { x: 90,  w: 55, h: 35, color: '#8B5CF6', delay: 0.15 },
  { x: 145, w: 65, h: 35, color: '#10B981', delay: 0.3 },
  { x: 10,  w: 50, h: 30, color: '#F59E0B', delay: 0.45 },
  { x: 60,  w: 70, h: 30, color: '#EF4444', delay: 0.6 },
  { x: 130, w: 80, h: 30, color: '#06B6D4', delay: 0.75 },
  { x: 10,  w: 65, h: 25, color: '#8B5CF6', delay: 0.9 },
  { x: 75,  w: 45, h: 25, color: '#10B981', delay: 1.05 },
  { x: 120, w: 90, h: 25, color: '#F59E0B', delay: 1.2 },
];

export default function TetrisPack() {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 300 180" className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="block-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Container outline */}
        <rect
          x="5" y="15" width="215" height="145" rx="3"
          fill="none" stroke="#2A3450" strokeWidth="2" strokeDasharray="4,4"
        />
        {/* Container door markings (right side) */}
        <line x1="220" y1="25" x2="220" y2="150" stroke="#2A3450" strokeWidth="2" />
        <circle cx="218" cy="85" r="2" fill="#2A3450" />
        <circle cx="218" cy="95" r="2" fill="#2A3450" />

        {/* Dimension labels */}
        <text x="110" y="12" textAnchor="middle" fill="#2A3450" fontSize="7" fontFamily="monospace">12.03m</text>
        <text x="228" y="85" textAnchor="start" fill="#2A3450" fontSize="7" fontFamily="monospace">2.69m</text>

        {/* Falling blocks */}
        {BLOCKS.map((block, i) => {
          const targetY = 160 - (Math.floor(i / 3) + 1) * (block.h + 2);
          return (
            <g key={i}>
              <rect
                x={block.x} y={-40} width={block.w} height={block.h} rx="2"
                fill={block.color} opacity="0.25"
                stroke={block.color} strokeWidth="0.8" strokeOpacity="0.5"
              >
                <animate
                  attributeName="y"
                  values={`-40;${targetY};${targetY - 3};${targetY}`}
                  keyTimes="0;0.6;0.8;1"
                  dur="0.8s"
                  begin={`${block.delay}s`}
                  fill="freeze"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.25;0.4;0.25"
                  keyTimes="0;0.6;0.8;1"
                  dur="0.8s"
                  begin={`${block.delay}s`}
                  fill="freeze"
                />
              </rect>
              {/* Settle flash */}
              <rect
                x={block.x} y={targetY} width={block.w} height={block.h} rx="2"
                fill={block.color} opacity="0" filter="url(#block-glow)"
              >
                <animate
                  attributeName="opacity"
                  values="0;0.5;0"
                  dur="0.3s"
                  begin={`${block.delay + 0.5}s`}
                  fill="freeze"
                />
              </rect>
            </g>
          );
        })}

        {/* Optimization readout */}
        <g>
          <text x="255" y="40" fill="#6B7280" fontSize="7" fontFamily="monospace">SOLVER</text>
          <text x="255" y="52" fill="#06B6D4" fontSize="8" fontFamily="monospace">
            CP-SAT
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
          </text>
          <text x="255" y="70" fill="#6B7280" fontSize="7" fontFamily="monospace">MODE</text>
          <text x="255" y="82" fill="#10B981" fontSize="8" fontFamily="monospace">Classical</text>
          <text x="255" y="100" fill="#6B7280" fontSize="7" fontFamily="monospace">STATUS</text>
          <text x="255" y="112" fill="#F59E0B" fontSize="8" fontFamily="monospace">
            Solving
            <animate attributeName="opacity" values="0.4;1;0.4" dur="0.8s" repeatCount="indefinite" />
          </text>
          {/* Utilization counter */}
          <text x="255" y="135" fill="#6B7280" fontSize="7" fontFamily="monospace">UTIL</text>
          <text x="255" y="148" fill="#06B6D4" fontSize="12" fontFamily="monospace" fontWeight="bold">
            <animate attributeName="textContent" values="0%;24%;51%;73%;88%;91%" dur="1.8s" fill="freeze" />
            91%
          </text>
        </g>
      </svg>
    </div>
  );
}
