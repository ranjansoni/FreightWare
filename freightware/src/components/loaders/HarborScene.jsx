'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getTimeGreeting, getTimeOfDay } from '@/data/loaderContent';

const SKY_COLORS = {
  dawn: { from: '#1a1a2e', to: '#e94560' },
  day:  { from: '#0a1628', to: '#1a3a5c' },
  dusk: { from: '#1a1a2e', to: '#c84b31' },
  night:{ from: '#0B0F1A', to: '#111827' },
};

export default function HarborScene() {
  const greeting = useMemo(() => getTimeGreeting(), []);
  const timeOfDay = useMemo(() => getTimeOfDay(), []);
  const sky = SKY_COLORS[timeOfDay];

  return (
    <div className="w-full h-full flex flex-col items-center justify-end relative overflow-hidden">
      {/* Personalized greeting */}
      <motion.div
        className="absolute top-0 left-0 right-0 text-center z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 className="text-xl font-display font-bold text-fw-text">
          {greeting}, Operations.
        </h2>
        <p className="text-sm text-fw-cyan font-mono mt-1">
          Pacific Coast Logistics — Vancouver Export Hub
        </p>
        <motion.p
          className="text-xs text-fw-text-muted mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          25 shipments across 8 clients &middot; $5,400 saved this week &middot; 91.5% utilization
        </motion.p>
      </motion.div>

      {/* Harbor SVG scene */}
      <svg viewBox="0 0 500 140" className="w-full" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sky.from} />
            <stop offset="100%" stopColor={sky.to} stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="500" height="90" fill="url(#sky-grad)" />

        {/* Stars (night/dawn/dusk) */}
        {timeOfDay !== 'day' && (
          <g opacity="0.5">
            <circle cx="50" cy="15" r="1" fill="white"><animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" /></circle>
            <circle cx="150" cy="25" r="0.8" fill="white"><animate attributeName="opacity" values="0.5;1;0.5" dur="1.7s" repeatCount="indefinite" /></circle>
            <circle cx="320" cy="10" r="1" fill="white"><animate attributeName="opacity" values="0.4;1;0.4" dur="2.3s" repeatCount="indefinite" /></circle>
            <circle cx="430" cy="20" r="0.7" fill="white"><animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" /></circle>
          </g>
        )}

        {/* Cranes on dock (right side) */}
        <g>
          {/* Crane 1 */}
          <rect x="350" y="40" width="4" height="50" fill="#2A3450" />
          <rect x="340" y="38" width="30" height="4" fill="#2A3450">
            <animateTransform attributeName="transform" type="rotate" values="-2,354,42;2,354,42;-2,354,42" dur="4s" repeatCount="indefinite" />
          </rect>
          <line x1="355" y1="42" x2="345" y2="70" stroke="#2A3450" strokeWidth="1">
            <animate attributeName="y2" values="65;75;65" dur="3s" repeatCount="indefinite" />
          </line>

          {/* Crane 2 */}
          <rect x="400" y="35" width="4" height="55" fill="#2A3450" />
          <rect x="388" y="33" width="35" height="4" fill="#2A3450">
            <animateTransform attributeName="transform" type="rotate" values="1,402,37;-2,402,37;1,402,37" dur="5s" repeatCount="indefinite" />
          </rect>
          <line x1="405" y1="37" x2="395" y2="65" stroke="#2A3450" strokeWidth="1">
            <animate attributeName="y2" values="60;72;60" dur="3.5s" repeatCount="indefinite" />
          </line>

          {/* Crane 3 */}
          <rect x="450" y="42" width="3" height="48" fill="#2A3450" />
          <rect x="442" y="40" width="25" height="3" fill="#2A3450">
            <animateTransform attributeName="transform" type="rotate" values="0,451,43;-3,451,43;0,451,43" dur="4.5s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Dock / land */}
        <rect x="330" y="88" width="170" height="52" fill="#1A2035" />
        {/* Stacked containers on dock */}
        <rect x="340" y="78" width="18" height="10" fill="#06B6D4" opacity="0.6" rx="1" />
        <rect x="360" y="78" width="18" height="10" fill="#8B5CF6" opacity="0.6" rx="1" />
        <rect x="380" y="78" width="18" height="10" fill="#10B981" opacity="0.6" rx="1" />
        <rect x="340" y="68" width="18" height="10" fill="#F59E0B" opacity="0.6" rx="1" />
        <rect x="360" y="68" width="18" height="10" fill="#06B6D4" opacity="0.4" rx="1" />

        {/* Ship sailing in from left */}
        <g className="loader-ship-sail">
          {/* Hull */}
          <polygon points="20,82 120,82 130,92 10,92" fill="#1A2035" />
          <rect x="30" y="72" width="80" height="10" fill="#111827" rx="1" />
          {/* Containers on ship */}
          <rect x="35" y="62" width="14" height="10" fill="#EF4444" opacity="0.7" rx="1" />
          <rect x="51" y="62" width="14" height="10" fill="#06B6D4" opacity="0.7" rx="1" />
          <rect x="67" y="62" width="14" height="10" fill="#10B981" opacity="0.7" rx="1" />
          <rect x="83" y="62" width="14" height="10" fill="#F59E0B" opacity="0.7" rx="1" />
          <rect x="43" y="52" width="14" height="10" fill="#8B5CF6" opacity="0.6" rx="1" />
          <rect x="59" y="52" width="14" height="10" fill="#06B6D4" opacity="0.5" rx="1" />
          {/* Bridge */}
          <rect x="90" y="48" width="12" height="24" fill="#1A2035" rx="1" />
          <rect x="92" y="50" width="8" height="4" fill="#06B6D4" opacity="0.3" rx="0.5" />
        </g>

        {/* Water */}
        <rect x="0" y="90" width="330" height="50" fill="url(#water-grad)" />
        {/* Waves */}
        <g opacity="0.4">
          <path d="M0,95 Q30,90 60,95 Q90,100 120,95 Q150,90 180,95 Q210,100 240,95 Q270,90 300,95 Q330,100 330,95" fill="none" stroke="#06B6D4" strokeWidth="0.8">
            <animate attributeName="d" values="M0,95 Q30,90 60,95 Q90,100 120,95 Q150,90 180,95 Q210,100 240,95 Q270,90 300,95 Q330,100 330,95;M0,95 Q30,100 60,95 Q90,90 120,95 Q150,100 180,95 Q210,90 240,95 Q270,100 300,95 Q330,90 330,95;M0,95 Q30,90 60,95 Q90,100 120,95 Q150,90 180,95 Q210,100 240,95 Q270,90 300,95 Q330,100 330,95" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M0,100 Q40,96 80,100 Q120,104 160,100 Q200,96 240,100 Q280,104 320,100" fill="none" stroke="#06B6D4" strokeWidth="0.5">
            <animate attributeName="d" values="M0,100 Q40,96 80,100 Q120,104 160,100 Q200,96 240,100 Q280,104 320,100;M0,100 Q40,104 80,100 Q120,96 160,100 Q200,104 240,100 Q280,96 320,100;M0,100 Q40,96 80,100 Q120,104 160,100 Q200,96 240,100 Q280,104 320,100" dur="4s" repeatCount="indefinite" />
          </path>
        </g>
      </svg>
    </div>
  );
}
