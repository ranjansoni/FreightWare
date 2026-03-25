export const optimizationResult = {
  runId: 'OPT-20260324-001',
  timestamp: '2026-03-24T14:32:00Z',
  solver: 'OR-Tools CP-SAT',
  solveTime: 2.4,
  status: 'optimal',

  containersUsed: [
    {
      id: 'CTR-001',
      type: '40ftHC',
      utilization: 94.2,
      weightUtilization: 87.5,
      totalWeight: 23153,
      totalVolume: 71.9,
      shipments: [
        'SHP-2026-0001', 'SHP-2026-0003', 'SHP-2026-0004',
        'SHP-2026-0006', 'SHP-2026-0007', 'SHP-2026-0012',
        'SHP-2026-0016', 'SHP-2026-0022', 'SHP-2026-0024',
      ],
    },
    {
      id: 'CTR-002',
      type: '40ft',
      utilization: 91.8,
      weightUtilization: 82.1,
      totalWeight: 21900,
      totalVolume: 62.2,
      shipments: [
        'SHP-2026-0002', 'SHP-2026-0009', 'SHP-2026-0011',
        'SHP-2026-0013', 'SHP-2026-0018', 'SHP-2026-0023',
        'SHP-2026-0025',
      ],
    },
    {
      id: 'CTR-003',
      type: '20ft',
      utilization: 88.5,
      weightUtilization: 79.3,
      totalWeight: 22370,
      totalVolume: 29.4,
      shipments: [
        'SHP-2026-0005', 'SHP-2026-0008', 'SHP-2026-0010',
        'SHP-2026-0014', 'SHP-2026-0015', 'SHP-2026-0017',
        'SHP-2026-0019', 'SHP-2026-0020', 'SHP-2026-0021',
      ],
    },
  ],

  baseline: {
    containersNeeded: 5,
    avgUtilization: 72.3,
    estimatedCost: 13500,
  },

  optimized: {
    containersNeeded: 3,
    avgUtilization: 91.5,
    estimatedCost: 8100,
  },

  savings: {
    containersReduced: 2,
    costSaved: 5400,
    utilizationGain: 19.2,
    co2Reduced: 2.4,
  },
};

export const weeklyUtilizationData = [
  { week: 'Week 1', before: 74, after: 89 },
  { week: 'Week 2', before: 72, after: 92 },
  { week: 'Week 3', before: 78, after: 91 },
  { week: 'Week 4', before: 73, after: 95 },
];
