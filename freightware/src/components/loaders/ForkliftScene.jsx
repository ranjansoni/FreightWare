'use client';

export default function ForkliftScene() {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 420 180" className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Warehouse floor */}
        <rect x="0" y="140" width="420" height="40" fill="#e2e8f0" />
        {/* Floor markings */}
        <line x1="0" y1="140" x2="420" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />
        {/* Safety line */}
        <line x1="0" y1="142" x2="420" y2="142" stroke="#f59e0b" strokeWidth="1" strokeDasharray="8,4" opacity="0.5" />

        {/* Container door (right side) */}
        <rect x="320" y="50" width="90" height="90" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
        {/* Door opening */}
        <rect x="330" y="55" width="35" height="80" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
        <rect x="368" y="55" width="35" height="80" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
        {/* Door handles */}
        <rect x="362" y="85" width="3" height="15" rx="1" fill="#94a3b8" />
        <rect x="368" y="85" width="3" height="15" rx="1" fill="#94a3b8" />
        {/* Container label */}
        <text x="365" y="47" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">CTR-001</text>

        {/* Cargo already loaded inside container */}
        <rect x="375" y="85" width="22" height="15" rx="1" fill="#06B6D4" opacity="0.3" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.4" />
        <rect x="375" y="68" width="22" height="15" rx="1" fill="#8B5CF6" opacity="0.25" stroke="#8B5CF6" strokeWidth="0.5" strokeOpacity="0.4" />
        <rect x="335" y="100" width="26" height="18" rx="1" fill="#10B981" opacity="0.3" stroke="#10B981" strokeWidth="0.5" strokeOpacity="0.4" />
        <rect x="335" y="80" width="26" height="18" rx="1" fill="#F59E0B" opacity="0.25" stroke="#F59E0B" strokeWidth="0.5" strokeOpacity="0.4" />

        {/* Forklift - animated moving right */}
        <g className="loader-forklift-move">
          {/* Forks */}
          <rect x="170" y="125" width="45" height="3" rx="0.5" fill="#64748b" />
          <rect x="170" y="132" width="45" height="3" rx="0.5" fill="#64748b" />
          {/* Mast */}
          <rect x="163" y="90" width="5" height="50" rx="1" fill="#475569" />
          <rect x="170" y="90" width="3" height="50" rx="0.5" fill="#475569" />
          {/* Pallet + cargo on forks */}
          <rect x="175" y="118" width="35" height="4" rx="0.5" fill="#a16207" opacity="0.6" />
          <rect x="178" y="100" width="28" height="18" rx="1.5" fill="#06B6D4" opacity="0.5" stroke="#06B6D4" strokeWidth="0.8" strokeOpacity="0.5" />
          <text x="192" y="112" textAnchor="middle" fill="#06B6D4" fontSize="5" fontFamily="monospace" opacity="0.7">SHP-012</text>
          {/* Body */}
          <rect x="130" y="100" width="35" height="35" rx="3" fill="#475569" />
          {/* Cab */}
          <rect x="133" y="95" width="18" height="20" rx="2" fill="#64748b" />
          {/* Window */}
          <rect x="135" y="97" width="14" height="8" rx="1" fill="#06B6D4" opacity="0.15" />
          {/* Wheels */}
          <circle cx="140" cy="140" r="7" fill="#334155" stroke="#475569" strokeWidth="1.5" />
          <circle cx="140" cy="140" r="2.5" fill="#64748b" />
          <circle cx="160" cy="140" r="5" fill="#334155" stroke="#475569" strokeWidth="1.5" />
          <circle cx="160" cy="140" r="2" fill="#64748b" />
          {/* Exhaust */}
          <circle cx="132" cy="98" r="1.5" fill="#94a3b8" opacity="0">
            <animate attributeName="cy" values="98;85;70" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.2;0" dur="1s" repeatCount="indefinite" />
            <animate attributeName="r" values="1.5;3;4" dur="1s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Waiting pallets on the left */}
        <rect x="20" y="120" width="30" height="4" rx="0.5" fill="#a16207" opacity="0.4" />
        <rect x="23" y="104" width="24" height="16" rx="1" fill="#8B5CF6" opacity="0.3" stroke="#8B5CF6" strokeWidth="0.5" strokeOpacity="0.3" />

        <rect x="60" y="120" width="30" height="4" rx="0.5" fill="#a16207" opacity="0.4" />
        <rect x="63" y="104" width="24" height="16" rx="1" fill="#10B981" opacity="0.3" stroke="#10B981" strokeWidth="0.5" strokeOpacity="0.3" />

        {/* Step indicator */}
        <g>
          <text x="20" y="165" fill="#64748b" fontSize="7" fontFamily="monospace">STEP 4 OF 12</text>
          <rect x="20" y="168" width="80" height="3" rx="1.5" fill="#e2e8f0" />
          <rect x="20" y="168" width="27" height="3" rx="1.5" fill="#06B6D4" opacity="0.7">
            <animate attributeName="width" values="20;27;35;27" dur="3s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Safety notice */}
        <text x="380" y="165" textAnchor="middle" fill="#f59e0b" fontSize="6" fontFamily="monospace" opacity="0.6">
          ⚠ HEAVY LOAD
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
        </text>
      </svg>
    </div>
  );
}
