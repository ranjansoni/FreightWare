import { containerTypes } from '@/utils/containerSpecs';

export const availableContainers = [
  { id: 'CTR-001', type: '40ftHC', status: 'assigned', ...containerTypes['40ftHC'] },
  { id: 'CTR-002', type: '40ft', status: 'assigned', ...containerTypes['40ft'] },
  { id: 'CTR-003', type: '20ft', status: 'assigned', ...containerTypes['20ft'] },
  { id: 'CTR-004', type: '40ftHC', status: 'available', ...containerTypes['40ftHC'] },
  { id: 'CTR-005', type: '40ft', status: 'available', ...containerTypes['40ft'] },
];

export function getContainerById(id) {
  return availableContainers.find((c) => c.id === id);
}
