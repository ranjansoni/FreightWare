'use client';

export default function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-fw-surface-2 border border-fw-border rounded-lg px-3 py-2 text-xs shadow-lg">
      {label && <p className="font-medium text-fw-text mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color || entry.fill }}>
          {entry.name}: {formatter ? formatter(entry.value, entry) : entry.value}
        </p>
      ))}
    </div>
  );
}
