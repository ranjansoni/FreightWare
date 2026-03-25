'use client';

export default function CraneLoad() {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 420 180" className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="cl-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Dock platform */}
        <rect x="0" y="120" width="180" height="60" fill="#1A2035" />
        <line x1="0" y1="120" x2="180" y2="120" stroke="#2A3450" strokeWidth="1.5" />

        {/* Containers stacked on dock */}
        <rect x="15" y="98" width="35" height="22" rx="1.5" fill="#8B5CF6" opacity="0.5" />
        <rect x="55" y="98" width="35" height="22" rx="1.5" fill="#10B981" opacity="0.5" />
        <rect x="15" y="76" width="35" height="22" rx="1.5" fill="#F59E0B" opacity="0.4" />

        {/* Gantry Crane */}
        {/* Left leg */}
        <rect x="100" y="30" width="5" height="90" fill="#2A3450" />
        {/* Right leg */}
        <rect x="165" y="30" width="5" height="90" fill="#2A3450" />
        {/* Top beam */}
        <rect x="85" y="25" width="100" height="8" rx="2" fill="#2A3450" />
        {/* Boom arm extending over water */}
        <rect x="165" y="27" width="120" height="5" fill="#2A3450" rx="1" />
        {/* Boom support cables */}
        <line x1="185" y1="25" x2="230" y2="32" stroke="#2A3450" strokeWidth="1" />
        <line x1="185" y1="25" x2="270" y2="32" stroke="#2A3450" strokeWidth="1" />

        {/* Trolley on boom - moves along */}
        <rect x="220" y="30" width="20" height="5" rx="1" fill="#06B6D4" opacity="0.6">
          <animate attributeName="x" values="220;250;220" dur="3s" repeatCount="indefinite" />
        </rect>

        {/* Cable + Container being lowered */}
        <g>
          {/* Cable */}
          <line x1="230" y1="35" x2="230" y2="70" stroke="#9CA3AF" strokeWidth="0.8">
            <animate attributeName="x1" values="230;260;230" dur="3s" repeatCount="indefinite" />
            <animate attributeName="x2" values="230;260;230" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y2" values="65;90;65" dur="3s" repeatCount="indefinite" />
          </line>
          {/* Spreader */}
          <rect x="218" y="68" width="24" height="3" rx="1" fill="#6B7280">
            <animate attributeName="x" values="218;248;218" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="63;88;63" dur="3s" repeatCount="indefinite" />
          </rect>
          {/* Container */}
          <rect x="220" y="71" width="20" height="14" rx="1.5" fill="#06B6D4" opacity="0.6" stroke="#06B6D4" strokeWidth="0.5">
            <animate attributeName="x" values="220;250;220" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="66;91;66" dur="3s" repeatCount="indefinite" />
          </rect>
          <text x="230" y="80" textAnchor="middle" fill="#06B6D4" fontSize="5" fontFamily="monospace" opacity="0.8">
            20ft
            <animate attributeName="x" values="230;260;230" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="75;100;75" dur="3s" repeatCount="indefinite" />
          </text>
        </g>

        {/* Ship hull */}
        <g>
          <polygon points="200,122 350,122 370,140 190,140" fill="#111827" stroke="#2A3450" strokeWidth="1">
            <animate attributeName="points" values="200,122 350,122 370,140 190,140;200,120 350,120 370,138 190,138;200,122 350,122 370,140 190,140" dur="4s" repeatCount="indefinite" />
          </polygon>
          {/* Ship deck */}
          <rect x="205" y="112" width="140" height="10" rx="1" fill="#1A2035">
            <animate attributeName="y" values="112;110;112" dur="4s" repeatCount="indefinite" />
          </rect>
          {/* Containers already on ship */}
          <rect x="210" y="102" width="18" height="10" rx="1" fill="#EF4444" opacity="0.5">
            <animate attributeName="y" values="102;100;102" dur="4s" repeatCount="indefinite" />
          </rect>
          <rect x="230" y="102" width="18" height="10" rx="1" fill="#10B981" opacity="0.5">
            <animate attributeName="y" values="102;100;102" dur="4s" repeatCount="indefinite" />
          </rect>
          <rect x="250" y="102" width="18" height="10" rx="1" fill="#F59E0B" opacity="0.5">
            <animate attributeName="y" values="102;100;102" dur="4s" repeatCount="indefinite" />
          </rect>
          {/* Bridge */}
          <rect x="320" y="92" width="15" height="20" rx="1" fill="#1A2035">
            <animate attributeName="y" values="92;90;92" dur="4s" repeatCount="indefinite" />
          </rect>
          <rect x="322" y="94" width="11" height="5" rx="0.5" fill="#06B6D4" opacity="0.2">
            <animate attributeName="y" values="94;92;94" dur="4s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Water */}
        <rect x="180" y="138" width="240" height="42" fill="url(#cl-water)" />
        <path d="M180,142 Q210,138 240,142 Q270,146 300,142 Q330,138 360,142 Q390,146 420,142" fill="none" stroke="#06B6D4" strokeWidth="0.6" opacity="0.3">
          <animate attributeName="d" values="M180,142 Q210,138 240,142 Q270,146 300,142 Q330,138 360,142 Q390,146 420,142;M180,142 Q210,146 240,142 Q270,138 300,142 Q330,146 360,142 Q390,138 420,142;M180,142 Q210,138 240,142 Q270,146 300,142 Q330,138 360,142 Q390,146 420,142" dur="3s" repeatCount="indefinite" />
        </path>

        {/* 3D label */}
        <text x="380" y="170" textAnchor="middle" fill="#6B7280" fontSize="7" fontFamily="monospace">
          3D ENGINE
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
        </text>
      </svg>
    </div>
  );
}
