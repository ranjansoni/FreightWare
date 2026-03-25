export function formatCurrency(amount, currency = 'CAD') {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatWeight(kg) {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)}t`;
  }
  return `${kg.toLocaleString()}kg`;
}

export function formatWeightFull(kg) {
  return `${kg.toLocaleString()} kg`;
}

export function formatVolume(m3) {
  return `${m3.toFixed(1)} m³`;
}

export function formatDimensions(dims) {
  return `${dims.length}m × ${dims.width}m × ${dims.height}m`;
}

export function formatDimensionsShort(dims) {
  return `${dims.length} × ${dims.width} × ${dims.height}`;
}

export function formatPercentage(value) {
  return `${value.toFixed(1)}%`;
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
