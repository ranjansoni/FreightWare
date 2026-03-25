'use client';

import ProgressBar from '@/components/shared/ProgressBar';
import HelpIcon from '@/components/shared/HelpIcon';
import { containerTypes } from '@/utils/containerSpecs';

export default function ContainerTabs({ containers, activeId, onSelect }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-fw-text-muted font-medium">Select a container to inspect:</span>
        <HelpIcon
          text="Each tab represents a container assigned by the optimizer. The bar shows volume utilization — green is good (>85%), below that means there's room for more cargo. Click a tab to view its 3D load plan and loading sequence."
          position="bottom-right"
        />
      </div>
      <div className="flex gap-2">
      {containers.map((c) => {
        const spec = containerTypes[c.type];
        const active = c.id === activeId;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`flex-1 p-3 rounded-lg border transition-all ${
              active
                ? 'border-fw-cyan bg-fw-cyan/5 shadow-[0_0_20px_rgba(6,182,212,0.08)]'
                : 'border-fw-border bg-fw-surface hover:border-fw-border/80'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-mono font-medium ${active ? 'text-fw-cyan' : 'text-fw-text'}`}>
                {c.id}
              </span>
              <span className="text-xs text-fw-text-dim">
                {spec?.name}
              </span>
            </div>
            <ProgressBar
              value={c.utilization}
              max={100}
              color={active ? 'cyan' : 'green'}
              size="sm"
              showPercent={false}
            />
            <p className="text-right text-xs font-mono text-fw-text-dim mt-1">
              {c.utilization}%
            </p>
          </button>
        );
      })}
      </div>
    </div>
  );
}
