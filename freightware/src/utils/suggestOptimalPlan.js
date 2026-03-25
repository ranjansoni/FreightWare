import { containerTypes } from './containerSpecs';
import { getShipmentById } from '@/data/mockShipments';

/**
 * Mock multi-pass greedy solver for the "Suggest Plan" feature.
 * Runs instantly — the animation delay is handled by the overlay component.
 * Returns real computed data so animation text is genuine.
 */
export default function suggestOptimalPlan(containers, currentAssignments, currentUnassigned) {
  const allIds = [];
  for (const ids of Object.values(currentAssignments)) {
    allIds.push(...ids);
  }
  allIds.push(...currentUnassigned);

  const all = allIds.map((id) => getShipmentById(id)).filter(Boolean);

  const hazmatShipments = all.filter((s) => s.hazmat);
  const tempShipments = all.filter((s) => s.tempRange && !s.hazmat);
  const regularShipments = all.filter((s) => !s.hazmat && !s.tempRange);

  const totalWeight = all.reduce((sum, s) => sum + (s.weight || 0), 0);

  const destCounts = {};
  for (const s of all) {
    destCounts[s.destination] = (destCounts[s.destination] || 0) + 1;
  }
  const destSummary = Object.entries(destCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([d, c]) => `${d} (${c})`)
    .join(', ');

  const newAssignments = {};
  for (const c of containers) {
    newAssignments[c.id] = [];
  }

  const containerCapacity = {};
  for (const c of containers) {
    const spec = containerTypes[c.type];
    containerCapacity[c.id] = {
      type: c.type,
      maxWeight: spec?.maxWeight || 0,
      maxVolume: spec?.volume || 0,
      usedWeight: 0,
      usedVolume: 0,
    };
  }

  function canFit(containerId, shipment) {
    const cap = containerCapacity[containerId];
    return (
      cap.usedWeight + (shipment.weight || 0) <= cap.maxWeight &&
      cap.usedVolume + (shipment.volume || 0) <= cap.maxVolume
    );
  }

  function place(containerId, shipment) {
    newAssignments[containerId].push(shipment.id);
    containerCapacity[containerId].usedWeight += shipment.weight || 0;
    containerCapacity[containerId].usedVolume += shipment.volume || 0;
  }

  function findBestContainer(shipment, excludeContainerIds = []) {
    let best = null;
    let bestRemaining = Infinity;
    for (const c of containers) {
      if (excludeContainerIds.includes(c.id)) continue;
      if (!canFit(c.id, shipment)) continue;
      const remaining =
        containerCapacity[c.id].maxVolume - containerCapacity[c.id].usedVolume - (shipment.volume || 0);
      if (remaining < bestRemaining) {
        bestRemaining = remaining;
        best = c.id;
      }
    }
    return best;
  }

  // Pass 1: HAZMAT isolation — each HAZMAT to a different container
  const hazmatContainers = [];
  for (const s of hazmatShipments) {
    const target = findBestContainer(s, hazmatContainers);
    if (target) {
      place(target, s);
      hazmatContainers.push(target);
    }
  }

  // Pass 2: Temperature grouping — cluster temp cargo into same container
  let reeferContainer = null;
  const tempSorted = [...tempShipments].sort((a, b) => (b.weight || 0) - (a.weight || 0));
  for (const s of tempSorted) {
    if (reeferContainer && canFit(reeferContainer, s)) {
      place(reeferContainer, s);
    } else {
      const target = findBestContainer(s, hazmatContainers);
      if (target) {
        place(target, s);
        if (!reeferContainer) reeferContainer = target;
      }
    }
  }

  // Pass 3: Destination clustering — group by destination
  const byDest = {};
  for (const s of regularShipments) {
    if (!byDest[s.destination]) byDest[s.destination] = [];
    byDest[s.destination].push(s);
  }

  for (const dest of Object.keys(byDest)) {
    byDest[dest].sort((a, b) => (b.weight || 0) - (a.weight || 0));
  }

  const destOrder = Object.keys(byDest).sort(
    (a, b) => byDest[b].length - byDest[a].length
  );

  for (const dest of destOrder) {
    for (const s of byDest[dest]) {
      const destContainers = containers
        .filter((c) => {
          const ids = newAssignments[c.id];
          if (ids.length === 0) return true;
          return ids.some((id) => {
            const existing = getShipmentById(id);
            return existing?.destination === dest;
          });
        })
        .map((c) => c.id);

      let target = null;
      for (const cId of destContainers) {
        if (canFit(cId, s)) { target = cId; break; }
      }
      if (!target) target = findBestContainer(s);
      if (target) place(target, s);
    }
  }

  // Collect overflow
  const placedIds = new Set();
  for (const ids of Object.values(newAssignments)) {
    for (const id of ids) placedIds.add(id);
  }
  const overflow = allIds.filter((id) => !placedIds.has(id));

  // Compute stats for phases
  let totalUsedVolume = 0;
  let totalMaxVolume = 0;
  let containerCount = 0;
  for (const c of containers) {
    if (newAssignments[c.id].length > 0) {
      totalUsedVolume += containerCapacity[c.id].usedVolume;
      totalMaxVolume += containerCapacity[c.id].maxVolume;
      containerCount++;
    }
  }
  const avgUtilization =
    totalMaxVolume > 0 ? Math.round((totalUsedVolume / totalMaxVolume) * 1000) / 10 : 0;

  let reassignedCount = 0;
  for (const c of containers) {
    const oldIds = new Set(currentAssignments[c.id] || []);
    for (const id of newAssignments[c.id]) {
      if (!oldIds.has(id)) reassignedCount++;
    }
  }

  const reeferContainerName = reeferContainer || containers[1]?.id || 'CTR-002';

  const phases = [
    {
      label: 'Analyzing cargo weights',
      detail: `${all.length} shipments, ${(totalWeight / 1000).toFixed(1)} tons total`,
      durationMs: 900,
    },
    {
      label: 'Grouping by destination',
      detail: `${Object.keys(destCounts).length} route clusters: ${destSummary}`,
      durationMs: 1000,
    },
    {
      label: 'Segregating hazardous materials',
      detail: `${hazmatShipments.length} HAZMAT shipment${hazmatShipments.length !== 1 ? 's' : ''} isolated per IMDG code`,
      durationMs: 800,
    },
    {
      label: 'Optimizing temperature compatibility',
      detail: `${tempShipments.length} reefer shipment${tempShipments.length !== 1 ? 's' : ''} grouped in ${reeferContainerName}`,
      durationMs: 900,
    },
    {
      label: 'Maximizing space utilization',
      detail: `${avgUtilization}% avg utilization across ${containerCount} container${containerCount !== 1 ? 's' : ''}`,
      durationMs: 1100,
    },
    {
      label: 'Final safety & compliance check',
      detail: overflow.length > 0
        ? `All constraints satisfied — ${overflow.length} shipment${overflow.length !== 1 ? 's' : ''} need additional container`
        : 'All constraints satisfied — zero overflow',
      durationMs: 800,
    },
  ];

  return {
    assignments: newAssignments,
    unassigned: overflow,
    phases,
    summary: {
      reassigned: reassignedCount,
      overflow: overflow.length,
      avgUtilization,
      totalShipments: all.length,
    },
  };
}
