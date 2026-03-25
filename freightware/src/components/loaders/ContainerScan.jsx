'use client';

const CONTAINER_COLORS = ['#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#10B981', '#8B5CF6'];

export default function ContainerScan() {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 400 180" className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="scan-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
            <stop offset="40%" stopColor="#06B6D4" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </linearGradient>
          <filter id="scan-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ground line */}
        <line x1="20" y1="155" x2="380" y2="155" stroke="#2A3450" strokeWidth="1" />

        {/* Container row - 2 rows x 4 columns */}
        {CONTAINER_COLORS.map((color, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = 60 + col * 75;
          const y = 105 - row * 50;
          return (
            <g key={i}>
              <rect
                x={x} y={y} width="60" height="45" rx="2"
                fill={color} opacity="0.15"
                stroke={color} strokeWidth="1" strokeOpacity="0.3"
              />
              {/* Container ridges */}
              <line x1={x + 15} y1={y} x2={x + 15} y2={y + 45} stroke={color} strokeWidth="0.3" strokeOpacity="0.3" />
              <line x1={x + 30} y1={y} x2={x + 30} y2={y + 45} stroke={color} strokeWidth="0.3" strokeOpacity="0.3" />
              <line x1={x + 45} y1={y} x2={x + 45} y2={y + 45} stroke={color} strokeWidth="0.3" strokeOpacity="0.3" />
              {/* ID label */}
              <text x={x + 30} y={y + 26} textAnchor="middle" fill={color} opacity="0.5" fontSize="7" fontFamily="monospace">
                {`CTR-${String(i + 1).padStart(3, '0')}`}
              </text>
              {/* Activation glow when scan passes */}
              <rect
                x={x} y={y} width="60" height="45" rx="2"
                fill={color} opacity="0"
              >
                <animate
                  attributeName="opacity"
                  values="0;0;0.3;0.1;0"
                  keyTimes={`0;${0.1 + col * 0.18};${0.15 + col * 0.18};${0.25 + col * 0.18};1`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </rect>
            </g>
          );
        })}

        {/* Scanning beam - vertical line sweeping left to right */}
        <rect
          x="40" y="0" width="8" height="180"
          fill="url(#scan-beam)" filter="url(#scan-glow)"
        >
          <animate
            attributeName="x"
            values="40;360;40"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Scan line trail */}
        <line
          x1="44" y1="10" x2="44" y2="170"
          stroke="#06B6D4" strokeWidth="0.5" opacity="0.6"
        >
          <animate attributeName="x1" values="44;364;44" dur="2s" repeatCount="indefinite" />
          <animate attributeName="x2" values="44;364;44" dur="2s" repeatCount="indefinite" />
        </line>

        {/* Data readout text */}
        <text x="200" y="172" textAnchor="middle" fill="#6B7280" fontSize="8" fontFamily="monospace">
          MANIFEST VALIDATION IN PROGRESS
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
        </text>
      </svg>
    </div>
  );
}
