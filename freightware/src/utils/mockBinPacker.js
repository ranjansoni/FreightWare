import { containerTypes } from '@/utils/containerSpecs';

/**
 * Simple shelf-based bin packer for demo 3D visualization.
 * Places cargo in rows along the container length, then stacks vertically.
 *
 * Coordinate system (Three.js-friendly):
 *   x = width (left-right), y = height (floor-up), z = length (door-to-rear)
 *   Origin (0,0,0) = rear-left-floor corner of container interior
 */
export function packShipmentsIntoContainer(shipmentItems, containerType) {
  const container = containerTypes[containerType];
  if (!container) return [];

  const cW = container.internal.width;
  const cH = container.internal.height;
  const cL = container.internal.length;

  const sorted = [...shipmentItems].sort((a, b) => {
    const volA = a.dims.length * a.dims.width * a.dims.height;
    const volB = b.dims.length * b.dims.width * b.dims.height;
    return volB - volA;
  });

  const placed = [];

  let cursorZ = 0;
  let cursorX = 0;
  let cursorY = 0;
  let rowMaxDepth = 0;
  let layerMaxHeight = 0;

  for (const item of sorted) {
    const w = item.dims.width;
    const h = item.dims.height;
    const d = item.dims.length;

    if (cursorX + w > cW + 0.01) {
      cursorZ += rowMaxDepth + 0.02;
      cursorX = 0;
      rowMaxDepth = 0;
    }

    if (cursorZ + d > cL + 0.01) {
      cursorY += layerMaxHeight + 0.02;
      cursorZ = 0;
      cursorX = 0;
      rowMaxDepth = 0;
      layerMaxHeight = 0;
    }

    if (cursorY + h > cH + 0.01) {
      placed.push({
        shipmentId: item.shipmentId,
        position: { x: 0, y: 0, z: 0 },
        dimensions: { length: d, width: w, height: h },
        overflow: true,
      });
      continue;
    }

    placed.push({
      shipmentId: item.shipmentId,
      position: {
        x: Math.round(cursorX * 100) / 100,
        y: Math.round(cursorY * 100) / 100,
        z: Math.round(cursorZ * 100) / 100,
      },
      dimensions: { length: d, width: w, height: h },
    });

    cursorX += w + 0.02;
    if (d > rowMaxDepth) rowMaxDepth = d;
    if (h > layerMaxHeight) layerMaxHeight = h;
  }

  return placed;
}

/**
 * Pre-generates load sequences for all containers in the optimization result.
 * Each piece in a shipment gets its own block with per-piece dimensions.
 */
export function generateLoadSequences(containersUsed, shipmentsMap) {
  const result = {};

  for (const container of containersUsed) {
    const items = [];
    for (const shipmentId of container.shipments) {
      const shipment = shipmentsMap[shipmentId];
      if (!shipment) continue;

      for (let i = 0; i < shipment.pieces; i++) {
        items.push({
          shipmentId,
          pieceIndex: i,
          dims: {
            length: shipment.manifestDimensions.length,
            width: shipment.manifestDimensions.width,
            height: shipment.manifestDimensions.height,
          },
        });
      }
    }

    const packed = packShipmentsIntoContainer(items, container.type);

    result[container.id] = packed.map((p, idx) => ({
      ...p,
      loadOrder: idx + 1,
    }));
  }

  return result;
}
