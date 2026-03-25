import { clientColors } from '@/utils/clientColors';

export function aggregateClientVolumes(shipments) {
  const map = {};
  for (const s of shipments) {
    if (!map[s.clientId]) {
      map[s.clientId] = {
        clientId: s.clientId,
        name: s.clientName,
        volume: 0,
        weight: 0,
        shipmentCount: 0,
        pieces: 0,
        color: clientColors[s.clientId] || '#6B7280',
      };
    }
    map[s.clientId].volume += s.volume;
    map[s.clientId].weight += s.weight;
    map[s.clientId].pieces += s.pieces;
    map[s.clientId].shipmentCount += 1;
  }
  return Object.values(map).sort((a, b) => b.volume - a.volume);
}

export function aggregateByCargo(shipments) {
  const categories = {
    'Temp-Controlled': { value: 0, color: '#06B6D4' },
    'HAZMAT': { value: 0, color: '#F97316' },
    'Fragile': { value: 0, color: '#8B5CF6' },
    'Heavy/Oversize': { value: 0, color: '#EF4444' },
    'Standard': { value: 0, color: '#10B981' },
  };

  for (const s of shipments) {
    if (s.tempRange) categories['Temp-Controlled'].value += s.volume;
    else if (s.hazmat) categories['HAZMAT'].value += s.volume;
    else if (s.fragile) categories['Fragile'].value += s.volume;
    else if (s.weightPerPiece > 800 || s.notes?.toLowerCase().includes('oversize'))
      categories['Heavy/Oversize'].value += s.volume;
    else categories['Standard'].value += s.volume;
  }

  return Object.entries(categories)
    .filter(([, v]) => v.value > 0)
    .map(([name, v]) => ({
      name,
      value: parseFloat(v.value.toFixed(2)),
      color: v.color,
    }));
}

export function aggregateByDestination(shipments) {
  const DEST_COLORS = {
    Shanghai: '#06B6D4',
    Tokyo: '#8B5CF6',
    Busan: '#F59E0B',
  };
  const map = {};
  for (const s of shipments) {
    if (!map[s.destination]) {
      map[s.destination] = { name: s.destination, value: 0, count: 0, color: DEST_COLORS[s.destination] || '#6B7280' };
    }
    map[s.destination].value += s.volume;
    map[s.destination].count += 1;
  }
  return Object.values(map)
    .map((d) => ({ ...d, value: parseFloat(d.value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);
}

export function buildWaterfallData(result) {
  const baseline = result.baseline.estimatedCost;
  const containerSavings = result.savings.costSaved;
  const overflowAvoided = 2200;
  const co2Value = 480;
  const finalCost = baseline - containerSavings - overflowAvoided - co2Value;

  return [
    {
      name: 'Baseline Cost',
      value: baseline,
      base: 0,
      fill: '#6B7280',
      label: `$${baseline.toLocaleString()}`,
    },
    {
      name: 'Container Reduction',
      value: containerSavings,
      base: baseline - containerSavings,
      fill: '#10B981',
      label: `-$${containerSavings.toLocaleString()}`,
    },
    {
      name: 'Overflow Avoided',
      value: overflowAvoided,
      base: baseline - containerSavings - overflowAvoided,
      fill: '#10B981',
      label: `-$${overflowAvoided.toLocaleString()}`,
    },
    {
      name: 'CO₂ Credit Value',
      value: co2Value,
      base: finalCost,
      fill: '#10B981',
      label: `-$${co2Value}`,
    },
    {
      name: 'Optimized Cost',
      value: finalCost,
      base: 0,
      fill: '#06B6D4',
      label: `$${finalCost.toLocaleString()}`,
    },
  ];
}

export function buildContainerComposition(containersUsed, shipments) {
  const shipMap = {};
  for (const s of shipments) shipMap[s.id] = s;

  return containersUsed.map((container) => {
    const row = { name: container.id, type: container.type, utilization: container.utilization, weightUtilization: container.weightUtilization };
    const clientVolumes = {};

    for (const sid of container.shipments) {
      const s = shipMap[sid];
      if (!s) continue;
      const key = s.clientId;
      if (!clientVolumes[key]) clientVolumes[key] = { name: s.clientName, volume: 0 };
      clientVolumes[key].volume += s.volume;
    }

    for (const [cid, data] of Object.entries(clientVolumes)) {
      row[cid] = parseFloat(data.volume.toFixed(2));
      row[`${cid}_name`] = data.name;
    }
    return row;
  });
}

export function buildDensityData(shipments) {
  return shipments.map((s) => ({
    id: s.id,
    clientId: s.clientId,
    clientName: s.clientName,
    description: s.description,
    weight: s.weight,
    volume: s.volume,
    pieces: s.pieces,
    density: s.volume > 0 ? Math.round(s.weight / s.volume) : 0,
    color: clientColors[s.clientId] || '#6B7280',
  }));
}
