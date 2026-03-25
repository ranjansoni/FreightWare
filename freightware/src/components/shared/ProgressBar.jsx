const colorMap = {
  cyan: 'bg-fw-cyan',
  green: 'bg-fw-green',
  amber: 'bg-fw-amber',
  red: 'bg-fw-red',
  purple: 'bg-fw-purple',
};

export default function ProgressBar({
  value,
  max = 100,
  color = 'cyan',
  label,
  showPercent = true,
  className = '',
  size = 'md',
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = colorMap[color] || colorMap.cyan;
  const h = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-xs text-fw-text-dim">{label}</span>
          )}
          {showPercent && (
            <span className="text-xs font-mono text-fw-text-dim">
              {pct.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-fw-bg rounded-full ${h} overflow-hidden`}>
        <div
          className={`${barColor} ${h} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
