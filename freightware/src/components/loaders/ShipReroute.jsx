'use client';

export default function ShipReroute() {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 420 180" className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="sr-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id="arrow-cyan" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#06B6D4" />
          </marker>
        </defs>

        {/* Ocean background grid */}
        <g opacity="0.08">
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 12} x2="420" y2={i * 12} stroke="#06B6D4" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="180" stroke="#06B6D4" strokeWidth="0.5" />
          ))}
        </g>

        {/* Port markers */}
        <g>
          {/* Origin port - Vancouver */}
          <circle cx="50" cy="60" r="6" fill="#06B6D4" opacity="0.2" stroke="#06B6D4" strokeWidth="1" />
          <circle cx="50" cy="60" r="2" fill="#06B6D4" />
          <text x="50" y="50" textAnchor="middle" fill="#06B6D4" fontSize="7" fontFamily="monospace">YVR</text>

          {/* Destination port - Shanghai */}
          <circle cx="370" cy="100" r="6" fill="#10B981" opacity="0.2" stroke="#10B981" strokeWidth="1" />
          <circle cx="370" cy="100" r="2" fill="#10B981" />
          <text x="370" y="90" textAnchor="middle" fill="#10B981" fontSize="7" fontFamily="monospace">SHA</text>
        </g>

        {/* Original route - dashed, dim */}
        <path
          d="M56,60 Q150,40 210,70 Q270,100 370,100"
          fill="none" stroke="#6B7280" strokeWidth="1.2" strokeDasharray="4,4" opacity="0.3"
        />
        <text x="180" y="45" fill="#6B7280" fontSize="6" fontFamily="monospace" opacity="0.5">ORIGINAL ROUTE</text>

        {/* Deviation point */}
        <circle cx="210" cy="70" r="10" fill="#F59E0B" opacity="0">
          <animate attributeName="opacity" values="0;0.3;0;0.3;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="210" cy="70" r="4" fill="#F59E0B" opacity="0.8">
          <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
        </circle>
        <text x="210" y="58" textAnchor="middle" fill="#F59E0B" fontSize="6" fontFamily="monospace" fontWeight="bold">
          DEVIATION
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" />
        </text>

        {/* New route - animated drawing */}
        <path
          d="M56,60 Q130,55 210,70 Q250,110 290,120 Q330,115 370,100"
          fill="none" stroke="#06B6D4" strokeWidth="1.8" opacity="0.7"
          strokeDasharray="300" strokeDashoffset="300"
        >
          <animate attributeName="stroke-dashoffset" values="300;0" dur="1.5s" fill="freeze" begin="0.5s" />
        </path>
        <text x="290" y="135" fill="#06B6D4" fontSize="6" fontFamily="monospace">
          ADJUSTED ROUTE
          <animate attributeName="opacity" values="0;0;1" dur="2s" fill="freeze" />
        </text>

        {/* Ship icon moving along new route */}
        <g>
          {/* Simple ship triangle */}
          <polygon points="0,-5 12,0 0,5" fill="#06B6D4" opacity="0.8">
            <animateMotion
              path="M56,60 Q130,55 210,70 Q250,110 290,120 Q330,115 370,100"
              dur="2.5s"
              repeatCount="indefinite"
              rotate="auto"
            />
          </polygon>
          {/* Wake trail */}
          <circle r="2" fill="#06B6D4" opacity="0.3">
            <animateMotion
              path="M56,60 Q130,55 210,70 Q250,110 290,120 Q330,115 370,100"
              dur="2.5s"
              repeatCount="indefinite"
              rotate="auto"
              begin="-0.15s"
            />
          </circle>
        </g>

        {/* Info panel */}
        <g>
          <rect x="10" y="130" width="95" height="40" rx="3" fill="#1A2035" stroke="#2A3450" strokeWidth="0.8" />
          <text x="18" y="144" fill="#6B7280" fontSize="6" fontFamily="monospace">REPLAN TIME</text>
          <text x="18" y="158" fill="#10B981" fontSize="11" fontFamily="monospace" fontWeight="bold">
            0.8s
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
          </text>
          <text x="55" y="158" fill="#6B7280" fontSize="6" fontFamily="monospace">vs 45min</text>
        </g>
      </svg>
    </div>
  );
}
