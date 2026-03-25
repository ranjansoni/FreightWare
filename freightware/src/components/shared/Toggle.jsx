'use client';

export default function Toggle({ checked, onChange, label, subtitle, icon: Icon }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full flex-shrink-0 mt-0.5 transition-colors ${
          checked ? 'bg-fw-cyan' : 'bg-fw-border'
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4.5' : 'translate-x-0.5'
          }`}
        />
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className="text-fw-text-dim" />}
          <span className="text-sm text-fw-text">{label}</span>
        </div>
        {subtitle && (
          <p className="text-xs text-fw-text-muted mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
