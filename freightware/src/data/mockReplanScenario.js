export const replanScenario = {
  trigger:
    'Dock scan received — SHP-2026-0003 (Cascade Electronics) actual dimensions differ from manifest',

  originalShipment: {
    id: 'SHP-2026-0003',
    manifestDimensions: { length: 0.8, width: 0.6, height: 1.0 },
    pieces: 6,
  },

  actualScan: {
    dimensions: { length: 0.9, width: 0.7, height: 1.2 },
    pieces: 6,
    note: 'Pallets re-wrapped with additional protective packaging',
  },

  volumeIncrease: 2.16,
  volumePercentIncrease: 45,

  manifestVolume: 2.88,
  actualVolume: 4.536,

  replanResult: {
    solveTime: 0.8,
    containersUsed: 3,
    changes: [
      {
        containerId: 'CTR-001',
        action: 'resequenced',
        details:
          'Moved SHP-2026-0012 to CTR-002 to accommodate larger SHP-2026-0003',
      },
      {
        containerId: 'CTR-002',
        action: 'added',
        details: 'Received SHP-2026-0012 from CTR-001',
      },
    ],
    newUtilization: {
      'CTR-001': 96.1,
      'CTR-002': 93.4,
      'CTR-003': 88.5,
    },

    updatedContainers: [
      {
        id: 'CTR-001',
        type: '40ftHC',
        shipments: [
          'SHP-2026-0001', 'SHP-2026-0003', 'SHP-2026-0004',
          'SHP-2026-0006', 'SHP-2026-0007',
          'SHP-2026-0016', 'SHP-2026-0022', 'SHP-2026-0024',
        ],
      },
      {
        id: 'CTR-002',
        type: '40ft',
        shipments: [
          'SHP-2026-0002', 'SHP-2026-0009', 'SHP-2026-0011',
          'SHP-2026-0012', 'SHP-2026-0013', 'SHP-2026-0018',
          'SHP-2026-0023', 'SHP-2026-0025',
        ],
      },
    ],

    status:
      'Replanned without additional container — $2,200 overflow charge avoided',
    overflowChargeAvoided: 2200,
  },
};
