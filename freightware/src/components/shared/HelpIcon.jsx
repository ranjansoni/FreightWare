'use client';

import { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

export default function HelpIcon({ text, position = 'bottom' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positionClasses = {
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    'bottom-left': 'top-full mt-2 right-0',
    'bottom-right': 'top-full mt-2 left-0',
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <span className="relative inline-flex" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
          open
            ? 'border-fw-cyan text-fw-cyan'
            : 'border-fw-border text-fw-text-muted hover:text-fw-cyan hover:border-fw-cyan/50'
        }`}
        aria-label="Help"
      >
        <HelpCircle size={10} />
      </button>
      {open && (
        <span
          className={`absolute z-50 w-64 bg-fw-surface-2 border border-fw-border rounded-lg shadow-xl p-3 block ${positionClasses[position] || positionClasses.bottom}`}
        >
          <span className="flex items-start justify-between gap-2 mb-1">
            <HelpCircle size={12} className="text-fw-cyan mt-0.5 flex-shrink-0" />
            <button
              onClick={() => setOpen(false)}
              className="text-fw-text-muted hover:text-fw-text p-0.5"
            >
              <X size={10} />
            </button>
          </span>
          <span className="text-xs text-fw-text-dim leading-relaxed block">{text}</span>
        </span>
      )}
    </span>
  );
}
