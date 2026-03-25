import { containerTypes } from './containerSpecs';

const SEVERITY = { ERROR: 'error', WARNING: 'warning' };

function weightLimitRule(shipment, targetContainerId, assignments, allShipments, containers) {
  const container = containers.find((c) => c.id === targetContainerId);
  if (!container) return null;
  const spec = containerTypes[container.type];
  if (!spec) return null;

  const currentShipmentIds = assignments[targetContainerId] || [];
  const currentWeight = currentShipmentIds.reduce((sum, id) => {
    const s = allShipments.find((sh) => sh.id === id);
    return sum + (s?.weight || 0);
  }, 0);

  const newWeight = currentWeight + (shipment.weight || 0);
  if (newWeight > spec.maxWeight) {
    const over = newWeight - spec.maxWeight;
    return {
      ruleId: 'weight-limit',
      severity: SEVERITY.ERROR,
      message: `Exceeds max weight by ${over.toLocaleString()}kg (${newWeight.toLocaleString()}/${spec.maxWeight.toLocaleString()}kg)`,
      type: 'Weight Overload',
    };
  }
  return null;
}

function volumeLimitRule(shipment, targetContainerId, assignments, allShipments, containers) {
  const container = containers.find((c) => c.id === targetContainerId);
  if (!container) return null;
  const spec = containerTypes[container.type];
  if (!spec) return null;

  const currentShipmentIds = assignments[targetContainerId] || [];
  const currentVolume = currentShipmentIds.reduce((sum, id) => {
    const s = allShipments.find((sh) => sh.id === id);
    return sum + (s?.volume || 0);
  }, 0);

  const newVolume = currentVolume + (shipment.volume || 0);
  if (newVolume > spec.volume) {
    const over = (newVolume - spec.volume).toFixed(1);
    return {
      ruleId: 'volume-limit',
      severity: SEVERITY.ERROR,
      message: `Exceeds volume capacity by ${over}m³ (${newVolume.toFixed(1)}/${spec.volume}m³)`,
      type: 'Volume Overload',
    };
  }
  if (newVolume > spec.volume * 0.95) {
    return {
      ruleId: 'volume-warning',
      severity: SEVERITY.WARNING,
      message: `Container will be ${((newVolume / spec.volume) * 100).toFixed(0)}% full — very tight fit`,
      type: 'Near Capacity',
    };
  }
  return null;
}

function hazmatSegregationRule(shipment, targetContainerId, assignments, allShipments) {
  if (!shipment.hazmat) return null;

  const currentShipmentIds = assignments[targetContainerId] || [];
  const existingHazmat = currentShipmentIds.find((id) => {
    const s = allShipments.find((sh) => sh.id === id);
    return s?.hazmat;
  });

  if (existingHazmat) {
    const existing = allShipments.find((s) => s.id === existingHazmat);
    return {
      ruleId: 'hazmat-segregation',
      severity: SEVERITY.ERROR,
      message: `HAZMAT conflict — ${existing?.id} (${existing?.description}) already in this container. IMDG segregation requires separate containers.`,
      type: 'HAZMAT Segregation',
    };
  }
  return null;
}

function temperatureConflictRule(shipment, targetContainerId, assignments, allShipments) {
  if (!shipment.tempRange) return null;

  const currentShipmentIds = assignments[targetContainerId] || [];
  const hasAmbient = currentShipmentIds.some((id) => {
    const s = allShipments.find((sh) => sh.id === id);
    return s && !s.tempRange;
  });

  if (hasAmbient) {
    return {
      ruleId: 'temp-conflict',
      severity: SEVERITY.WARNING,
      message: `Temperature-controlled cargo (${shipment.tempRange.min}°C to ${shipment.tempRange.max}°C) mixed with ambient cargo. Requires reefer container or separate loading.`,
      type: 'Temperature Conflict',
    };
  }

  const conflictingTemp = currentShipmentIds.find((id) => {
    const s = allShipments.find((sh) => sh.id === id);
    if (!s?.tempRange) return false;
    return s.tempRange.min !== shipment.tempRange.min || s.tempRange.max !== shipment.tempRange.max;
  });

  if (conflictingTemp) {
    const other = allShipments.find((s) => s.id === conflictingTemp);
    return {
      ruleId: 'temp-range-mismatch',
      severity: SEVERITY.WARNING,
      message: `Temperature range (${shipment.tempRange.min}°C to ${shipment.tempRange.max}°C) differs from ${other?.id} (${other?.tempRange?.min}°C to ${other?.tempRange?.max}°C).`,
      type: 'Temperature Mismatch',
    };
  }

  return null;
}

function fragileWarningRule(shipment, targetContainerId, assignments, allShipments) {
  if (!shipment.fragile) return null;

  const currentShipmentIds = assignments[targetContainerId] || [];
  const totalWeight = currentShipmentIds.reduce((sum, id) => {
    const s = allShipments.find((sh) => sh.id === id);
    return sum + (s?.weight || 0);
  }, 0);

  if (totalWeight > 15000) {
    return {
      ruleId: 'fragile-heavy-container',
      severity: SEVERITY.WARNING,
      message: `Fragile cargo placed in a heavy container (${totalWeight.toLocaleString()}kg loaded). Risk of crushing during transit.`,
      type: 'Fragile Risk',
    };
  }

  const hasHazmat = currentShipmentIds.some((id) => {
    const s = allShipments.find((sh) => sh.id === id);
    return s?.hazmat;
  });
  if (hasHazmat) {
    return {
      ruleId: 'fragile-hazmat-mix',
      severity: SEVERITY.WARNING,
      message: 'Fragile cargo mixed with hazardous materials — not recommended.',
      type: 'Fragile + HAZMAT',
    };
  }

  return null;
}

function routeMismatchRule(shipment, targetContainerId, assignments, allShipments) {
  const currentShipmentIds = assignments[targetContainerId] || [];
  if (currentShipmentIds.length === 0) return null;

  const destinations = new Set();
  for (const id of currentShipmentIds) {
    const s = allShipments.find((sh) => sh.id === id);
    if (s?.destination) destinations.add(s.destination);
  }

  if (destinations.size === 0) return null;

  if (!destinations.has(shipment.destination)) {
    const existing = [...destinations].join(', ');
    return {
      ruleId: 'route-mismatch',
      severity: SEVERITY.WARNING,
      message: `Destination mismatch — this shipment goes to ${shipment.destination}, but container serves ${existing}. Multi-stop routing increases cost.`,
      type: 'Route Mismatch',
    };
  }

  return null;
}

const ALL_RULES = [
  weightLimitRule,
  volumeLimitRule,
  hazmatSegregationRule,
  temperatureConflictRule,
  fragileWarningRule,
  routeMismatchRule,
];

/**
 * Validate moving a shipment into a target container.
 * Returns { allowed, warnings, errors }
 */
export function validateMove(shipment, targetContainerId, assignments, allShipments, containers) {
  const errors = [];
  const warnings = [];

  for (const rule of ALL_RULES) {
    const result = rule(shipment, targetContainerId, assignments, allShipments, containers);
    if (!result) continue;
    if (result.severity === SEVERITY.ERROR) {
      errors.push(result);
    } else {
      warnings.push(result);
    }
  }

  return {
    allowed: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get a summary of all validation issues for every container in the current assignments.
 */
export function validateAllContainers(assignments, allShipments, containers) {
  const issues = {};
  for (const containerId of Object.keys(assignments)) {
    issues[containerId] = { errors: [], warnings: [] };
    const shipmentIds = assignments[containerId];
    for (const shipmentId of shipmentIds) {
      const shipment = allShipments.find((s) => s.id === shipmentId);
      if (!shipment) continue;
      const otherIds = shipmentIds.filter((id) => id !== shipmentId);
      const tempAssignments = { ...assignments, [containerId]: otherIds };
      const result = validateMove(shipment, containerId, tempAssignments, allShipments, containers);
      issues[containerId].errors.push(...result.errors);
      issues[containerId].warnings.push(...result.warnings);
    }
  }
  return issues;
}

export { SEVERITY };
