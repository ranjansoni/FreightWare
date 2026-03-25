export const tourSteps = [
  // ── Welcome ──
  {
    id: 'welcome',
    route: '/',
    target: null,
    title: 'Welcome to FreightWare',
    body: 'This quick tour will walk you through the platform. FreightWare optimizes LCL container load planning — reducing costs, saving time, and improving utilization. Click Next to begin.',
    placement: 'center',
  },

  // ── Dashboard ──
  {
    id: 'sidebar-nav',
    route: '/',
    target: '[data-tour="sidebar-nav"]',
    title: 'Navigation',
    body: 'Use the sidebar to move between screens. The workflow flows top-to-bottom: Dashboard → Shipments → Optimizer → Load Plan → Replan → Reports.',
    placement: 'right',
  },
  {
    id: 'kpi-row',
    route: '/',
    target: '[data-tour="kpi-row"]',
    title: 'Key Performance Indicators',
    body: 'These four cards show your real-time operations snapshot — active shipments, containers planned, average utilization, and weekly savings compared to manual planning.',
    placement: 'bottom',
  },
  {
    id: 'utilization-chart',
    route: '/',
    target: '[data-tour="utilization-chart"]',
    title: 'Utilization Trend',
    body: 'This chart compares container utilization before and after FreightWare over a rolling 4-week period. The gap shows the efficiency gains from AI-driven consolidation.',
    placement: 'bottom',
  },
  {
    id: 'ai-insights',
    route: '/',
    target: '[data-tour="ai-insights"]',
    title: 'AI Recommendations',
    body: 'FreightWare AI continuously analyzes your shipment data to detect anomalies, suggest consolidation opportunities, and flag issues before they become costly. Click any recommendation to navigate to the relevant screen.',
    placement: 'left',
  },

  // ── Shipments ──
  {
    id: 'shipments-intro',
    route: '/shipments',
    target: '[data-tour="shipment-table"]',
    title: 'Shipment Management',
    body: 'View, filter, and manage all active shipments. Colored status dots indicate data quality: green = confirmed, amber = auto-corrected, red = flagged for review. Click any row for details.',
    placement: 'top',
  },
  {
    id: 'csv-import',
    route: '/shipments',
    target: '[data-tour="csv-import"]',
    title: 'CSV Import & AI Cleaning',
    body: 'Import shipment data from your TMS or spreadsheet. FreightWare\'s AI automatically detects and corrects common data issues like typos, missing weights, and dimension mismatches.',
    placement: 'bottom-left',
  },

  // ── Optimizer ──
  {
    id: 'constraints',
    route: '/optimizer',
    target: '[data-tour="constraint-panel"]',
    title: 'Optimization Constraints',
    body: 'Configure which rules the solver must respect — weight limits, HAZMAT isolation, temperature compatibility, stacking rules, and more. Toggle constraints on/off to control solver flexibility.',
    placement: 'right',
  },
  {
    id: 'run-optimizer',
    route: '/optimizer',
    target: '[data-tour="run-optimizer"]',
    title: 'Run the Optimizer',
    body: 'When ready, hit Run Optimization. The CP-SAT solver will find the best container assignments in seconds, minimizing cost while respecting all active constraints.',
    placement: 'left',
  },

  // ── Load Plan ──
  {
    id: 'container-3d',
    route: '/loadplan',
    target: '[data-tour="container-3d"]',
    title: '3D Container View',
    body: 'Explore the optimized load plan in 3D. Rotate, zoom, and click on individual cargo blocks to see details. Use the camera presets (Iso, Front, Top, Side) for quick perspectives.',
    placement: 'right',
  },
  {
    id: 'load-sequence',
    route: '/loadplan',
    target: '[data-tour="load-details"]',
    title: 'Loading Sequence',
    body: 'The right panel shows the step-by-step loading order for warehouse workers. Press Play to animate the loading sequence in the 3D view. Hover on shipments to highlight them.',
    placement: 'left',
  },
  {
    id: 'drag-drop-editor',
    route: '/loadplan',
    target: null,
    title: 'Drag-and-Drop Editor',
    body: 'Click "Edit Plan" to switch to drag-and-drop mode. Drag shipments between containers to manually adjust assignments. The 3D preview updates in real-time. Color-coded feedback shows constraint violations — red for errors (HAZMAT, weight), amber for warnings (route mismatch). Undo/redo and reset are always available.',
    placement: 'center',
  },

  // ── Replan ──
  {
    id: 'replan-intro',
    route: '/replan',
    target: '[data-tour="deviation-alert"]',
    title: 'Real-time Replanning',
    body: 'When a dock scanner detects dimension differences from the manifest, FreightWare instantly assesses impact and replans in under a second — no manual re-calculation needed.',
    placement: 'bottom',
  },

  // ── Reports ──
  {
    id: 'reports-intro',
    route: '/reports',
    target: '[data-tour="reports-nav"]',
    title: 'Analytics & Reports',
    body: 'Scroll through five analytical reports: Cost Savings Waterfall, Client Volume Treemap, Cargo Density Analysis, Container Breakdown, and Destination Mix. Use the jump-nav to skip between sections.',
    placement: 'bottom',
  },

  // ── Settings ──
  {
    id: 'settings-intro',
    route: '/settings',
    target: '[data-tour="settings-tabs"]',
    title: 'Settings',
    body: 'Configure your organization, team, container fleet, integrations, notifications, billing, and appearance. All changes save instantly.',
    placement: 'bottom',
  },

  // ── Finish ──
  {
    id: 'tour-complete',
    route: null,
    target: null,
    title: 'You\'re All Set!',
    body: 'That\'s the full workflow. You can restart this tour anytime by clicking the help icon in the header. Use the AI chatbot in the bottom-right for questions on any screen.',
    placement: 'center',
  },
];
