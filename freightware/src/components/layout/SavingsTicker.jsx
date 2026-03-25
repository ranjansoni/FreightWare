'use client';

import { useState, useEffect, useRef } from 'react';
import { DollarSign, Box, Clock, Leaf, ShieldCheck, TrendingUp } from 'lucide-react';

function useCountUp(target, duration = 1500, decimals = 0) {
  const [value, setValue] = useState(0);
  const startTime = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    startTime.current = performance.now();
    function tick(now) {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) {
        rafId.current = requestAnimationFrame(tick);
      }
    }
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [target, duration, decimals]);

  return value;
}

const BREAKDOWN = [
  { icon: DollarSign, label: 'Cost saved', value: '$5,400 CAD', color: 'text-fw-green' },
  { icon: Box, label: 'Containers reduced', value: '2 (5 → 3)', color: 'text-fw-cyan' },
  { icon: Clock, label: 'Time saved', value: '~14.2 hours', color: 'text-fw-amber' },
  { icon: Leaf, label: 'CO₂ avoided', value: '2.4 tonnes', color: 'text-fw-green' },
  { icon: ShieldCheck, label: 'Overflow charges prevented', value: '$2,200', color: 'text-fw-green' },
];

export default function SavingsTicker() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const dollars = useCountUp(5400, 1500, 0);
  const containers = useCountUp(2, 1200, 0);
  const hours = useCountUp(14.2, 1500, 1);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-fw-green/30 bg-fw-green/5 hover:bg-fw-green/10 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1 text-fw-green">
          <DollarSign size={13} />
          <span className="text-xs font-mono font-bold">
            ${dollars.toLocaleString()}
          </span>
        </span>
        <span className="w-px h-3 bg-fw-border" />
        <span className="flex items-center gap-1 text-fw-cyan">
          <Box size={13} />
          <span className="text-xs font-mono font-bold">{containers}</span>
        </span>
        <span className="w-px h-3 bg-fw-border" />
        <span className="flex items-center gap-1 text-fw-amber">
          <Clock size={13} />
          <span className="text-xs font-mono font-bold">{hours}h</span>
        </span>
        <TrendingUp size={12} className="text-fw-green ml-0.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-72 bg-fw-surface border border-fw-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-fw-border">
            <h3 className="text-sm font-display font-semibold text-fw-text">
              Weekly Savings Summary
            </h3>
            <p className="text-xs text-fw-text-muted mt-0.5">
              vs. manual planning baseline
            </p>
          </div>
          <div className="p-3 space-y-2.5">
            {BREAKDOWN.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <Icon size={15} className={`${item.color} flex-shrink-0`} />
                  <span className="text-xs text-fw-text-dim flex-1">
                    {item.label}
                  </span>
                  <span className={`text-xs font-mono font-semibold ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
