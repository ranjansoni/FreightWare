export const companyProfile = {
  name: 'Pacific Coast Logistics',
  industry: 'Freight Forwarding',
  primaryPort: 'Vancouver',
  address: '1250 Waterfront Road',
  city: 'Vancouver',
  province: 'BC',
  postalCode: 'V6H 3Y2',
  country: 'Canada',
  taxId: 'BN 123456789',
  phone: '+1 (604) 555-0142',
  website: 'www.pacificcoastlogistics.ca',
};

export const teamMembers = [
  {
    id: 'USR-001',
    name: 'Sarah Chen',
    email: 'sarah.chen@pclogistics.ca',
    role: 'Admin',
    status: 'active',
    lastActive: '2 minutes ago',
  },
  {
    id: 'USR-002',
    name: 'Marcus Rivera',
    email: 'marcus.r@pclogistics.ca',
    role: 'Operations Manager',
    status: 'active',
    lastActive: '15 minutes ago',
  },
  {
    id: 'USR-003',
    name: 'James Park',
    email: 'james.park@pclogistics.ca',
    role: 'Warehouse Lead',
    status: 'active',
    lastActive: '1 hour ago',
  },
  {
    id: 'USR-004',
    name: 'Priya Sharma',
    email: 'priya.s@pclogistics.ca',
    role: 'Viewer',
    status: 'invited',
    lastActive: 'Pending',
  },
];

export const roles = [
  { value: 'Admin', description: 'Full access — manage users, billing, settings, and all operations' },
  { value: 'Operations Manager', description: 'Run optimizations, manage shipments, view reports' },
  { value: 'Warehouse Lead', description: 'Access tablet view, loading sequences, flag issues' },
  { value: 'Viewer', description: 'Read-only access to dashboards and reports' },
];

export const containerRates = {
  'CTR-001': 2700,
  'CTR-002': 2400,
  'CTR-003': 1800,
  'CTR-004': 2700,
  'CTR-005': 2400,
};

export const optimizationDefaults = {
  maxContainersPerRun: 5,
  targetUtilization: 85,
};

export const integrations = [
  {
    id: 'int-tms',
    name: 'CargoWise TMS',
    category: 'Transport Management',
    status: 'connected',
    lastSync: '2 minutes ago',
    description: 'Shipment bookings, manifests, and sailing schedules',
  },
  {
    id: 'int-erp',
    name: 'SAP S/4HANA',
    category: 'ERP',
    status: 'disconnected',
    lastSync: null,
    description: 'Financial data, invoicing, and cost center mapping',
  },
  {
    id: 'int-iot',
    name: 'Dock Scanner IoT',
    category: 'Hardware',
    status: 'connected',
    lastSync: '30 seconds ago',
    description: 'Real-time 3D dimension scanning at dock gates',
  },
  {
    id: 'int-email',
    name: 'Email (SMTP)',
    category: 'Communication',
    status: 'connected',
    lastSync: '5 minutes ago',
    description: 'Automated alerts, reports, and team notifications',
  },
];

export const notificationDefaults = {
  optimizationComplete: true,
  dockDeviation: true,
  weeklyReport: true,
  shipmentFlagged: true,
  utilizationWarning: false,
  slackWebhook: '',
  utilizationThreshold: 75,
};

export const billingPlan = {
  currentPlan: 'Professional',
  optimizationsUsed: 142,
  optimizationsLimit: 500,
  shipmentsProcessed: 1247,
  containersPlanned: 89,
  renewalDate: 'April 24, 2026',
  monthlyPrice: 499,
};

export const planTiers = [
  {
    name: 'Starter',
    price: 149,
    features: ['100 optimizations/mo', 'Up to 3 users', 'Email support', 'Basic reports'],
    current: false,
  },
  {
    name: 'Professional',
    price: 499,
    features: ['500 optimizations/mo', 'Up to 10 users', 'Priority support', 'Advanced reports', 'API access'],
    current: true,
  },
  {
    name: 'Enterprise',
    price: null,
    features: ['Unlimited optimizations', 'Unlimited users', 'Dedicated CSM', 'Custom integrations', 'SLA guarantee', 'Quantum access (2027)'],
    current: false,
  },
];

export const appearanceDefaults = {
  theme: 'dark',
  density: 'comfortable',
  language: 'en',
  dateFormat: 'YYYY-MM-DD',
  currency: 'CAD',
};
