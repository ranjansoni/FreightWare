export const clients = [
  { id: 'CLT-001', name: 'Pacific Timber Co.', type: 'Lumber/Wood Products', priority: 'standard' },
  { id: 'CLT-002', name: 'BC Seafood Exports', type: 'Perishables (Frozen)', priority: 'high', tempControlled: true },
  { id: 'CLT-003', name: 'Cascade Electronics', type: 'Electronics', priority: 'standard', fragile: true },
  { id: 'CLT-004', name: 'Fraser Valley Agriculture', type: 'Dry Goods/Grain', priority: 'standard' },
  { id: 'CLT-005', name: 'West Coast Machinery', type: 'Heavy Equipment', priority: 'low', oversize: true },
  { id: 'CLT-006', name: 'Lotus Textiles', type: 'Garments/Textiles', priority: 'standard' },
  { id: 'CLT-007', name: 'Harbour Chemicals', type: 'HAZMAT (Class 3)', priority: 'high', hazmat: true },
  { id: 'CLT-008', name: 'Artisan Furniture YVR', type: 'Furniture', priority: 'standard', fragile: true },
];

export function getClientById(id) {
  return clients.find((c) => c.id === id);
}
