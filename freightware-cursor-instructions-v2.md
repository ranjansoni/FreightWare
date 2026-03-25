# FreightWare — Next.js Prototype: Cursor Build Instructions
## v2 — Updated with Next.js architecture, Tailwind v4, and build clarifications

**Product:** FreightWare — Real-time 3D container load planning and replanning SaaS for export LCL consolidators  
**Purpose:** Clickable prototype that will evolve into the production application. Immediate use: (1) founder alignment, (2) client demos with CFS operations managers  
**Tech:** Next.js 15 (App Router), React 19, Tailwind v4, Three.js — no backend yet, all mock data, fully interactive  
**Audience:** CFS Operations Managers at mid-tier export LCL consolidators, Port of Vancouver  

---

## 1. PROJECT SETUP

```bash
npx create-next-app@latest freightware --typescript=no --tailwind --eslint --app --src-dir --import-alias="@/*"
cd freightware
npm install three @react-three/fiber @react-three/drei lucide-react framer-motion recharts
```

> **Note:** Using JavaScript (not TypeScript) to keep iteration speed high during prototype phase. TypeScript can be introduced when moving to production.

### Tailwind v4 Configuration (src/app/globals.css)

Tailwind v4 uses CSS-based configuration via `@theme` directives. No `tailwind.config.js` file needed.

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-fw-bg: #0B0F1A;
  --color-fw-surface: #111827;
  --color-fw-surface-2: #1A2035;
  --color-fw-border: #2A3450;
  --color-fw-cyan: #06B6D4;
  --color-fw-cyan-dim: #0E7490;
  --color-fw-amber: #F59E0B;
  --color-fw-amber-dim: #D97706;
  --color-fw-green: #10B981;
  --color-fw-green-dim: #059669;
  --color-fw-red: #EF4444;
  --color-fw-red-dim: #DC2626;
  --color-fw-purple: #8B5CF6;
  --color-fw-text: #E5E7EB;
  --color-fw-text-dim: #9CA3AF;
  --color-fw-text-muted: #6B7280;

  /* Fonts */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-display: 'Space Grotesk', system-ui, sans-serif;
}

body {
  background: var(--color-fw-bg);
  color: var(--color-fw-text);
  font-family: var(--font-sans);
}

/* Scrollbar styling for dark theme */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #111827; }
::-webkit-scrollbar-thumb { background: #2A3450; border-radius: 3px; }
```

### Font Loading (src/app/layout.jsx)

Load fonts via `<link>` in the root layout `<head>` for non-render-blocking performance:

```jsx
// In the <head> section of layout.jsx:
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
```

---

## 2. DESIGN SYSTEM

### Visual Identity
- **Theme:** Dark mode, industrial control room aesthetic
- **Philosophy:** This should feel like a port operations control tower — authoritative, data-dense, calm under pressure
- **Typography:** DM Sans for body, Space Grotesk for headings/numbers, JetBrains Mono for data/codes
- **Grid:** 12-column responsive, 16px base spacing
- **Border radius:** 8px for cards, 6px for buttons, 4px for inputs
- **Shadows:** Subtle cyan glow on active/focused elements (`box-shadow: 0 0 20px rgba(6, 182, 212, 0.15)`)

### Color Usage Rules
| Color | Hex | Usage |
|-------|-----|-------|
| Cyan (#06B6D4) | Primary | Actions, links, container wireframes, active states |
| Amber (#F59E0B) | Warning | AI suggestions, dimension mismatches, alerts |
| Green (#10B981) | Success | Confirmed shipments, optimized plans, savings |
| Red (#EF4444) | Error | Conflicts, overweight, failed validations |
| Purple (#8B5CF6) | AI/Quantum | AI feature badges, quantum optimization toggle |

### Component Patterns
- **Cards:** bg-fw-surface, border border-fw-border, p-6, rounded-lg
- **Buttons primary:** bg-fw-cyan text-fw-bg font-semibold px-4 py-2 rounded-md hover:brightness-110
- **Buttons ghost:** border border-fw-border text-fw-text-dim hover:border-fw-cyan hover:text-fw-cyan
- **Status badges:** rounded-full px-3 py-1 text-xs font-mono uppercase tracking-wide
- **Data tables:** Alternating rows with bg-fw-surface and bg-fw-surface-2, sticky headers
- **Tooltips:** bg-fw-surface-2 border-fw-border text-sm

### AI Feature Badge
Whenever an AI-powered feature appears, show a small badge:
```jsx
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono">
  <SparklesIcon size={12} /> AI
</span>
```

### Quantum Toggle (Global — appears in header)
A toggle switch labeled "Quantum-Enhanced" that is currently OFF (greyed out) with a tooltip: "Coming 2027 — D-Wave quantum annealing for complex multi-container optimization". When toggled, show a brief "Quantum acceleration not yet available for your plan" toast. This is purely visual — it signals the roadmap to investors/operators.

### Prototype Watermark
Show a small subtle badge in the sidebar footer: "PROTOTYPE v0.1" in fw-text-muted, 10px font-mono. This prevents anyone mistaking the demo for production software.

---

## 3. FILE STRUCTURE (Next.js App Router)

```
src/
├── app/
│   ├── layout.jsx                 # Root layout: fonts, metadata, AppProvider, shell
│   ├── globals.css                # Tailwind v4 @theme + global styles
│   ├── page.jsx                   # Dashboard (route: /)
│   ├── shipments/
│   │   └── page.jsx               # Shipments list (route: /shipments)
│   ├── optimizer/
│   │   └── page.jsx               # Optimization control (route: /optimizer)
│   ├── loadplan/
│   │   └── page.jsx               # Load plan + 3D view (route: /loadplan)
│   ├── replan/
│   │   └── page.jsx               # Replan flow (route: /replan)
│   └── tablet/
│       ├── layout.jsx             # Tablet layout (NO sidebar, light mode, full screen)
│       └── page.jsx               # Floor worker step-by-step (route: /tablet)
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx            # 'use client' — Left nav with collapse toggle
│   │   ├── Header.jsx             # 'use client' — Top bar: logo, quantum toggle, notifications
│   │   └── AppShell.jsx           # 'use client' — Sidebar + Header + content area wrapper
│   ├── shared/
│   │   ├── Badge.jsx              # Status/AI badges
│   │   ├── Button.jsx             # Primary/ghost/danger variants
│   │   ├── Card.jsx               # Standard card wrapper
│   │   ├── DataTable.jsx          # 'use client' — Sortable, filterable table
│   │   ├── Modal.jsx              # 'use client' — Overlay modal
│   │   ├── Toast.jsx              # 'use client' — Notification toasts
│   │   ├── ToastProvider.jsx      # 'use client' — Toast context provider
│   │   ├── ProgressBar.jsx        # For optimization progress simulation
│   │   └── MetricCard.jsx         # KPI display card
│   ├── dashboard/
│   │   ├── KPIRow.jsx             # Top metrics row
│   │   ├── UtilizationChart.jsx   # 'use client' — Recharts area chart
│   │   ├── ActiveShipmentsWidget.jsx
│   │   └── AIInsightsPanel.jsx    # AI-generated suggestions
│   ├── shipments/
│   │   ├── ShipmentTable.jsx      # 'use client' — Full shipment table with filters
│   │   ├── ShipmentRow.jsx        # Single row in table
│   │   ├── ShipmentDetailModal.jsx # 'use client' — Click to expand details
│   │   ├── ImportCSVModal.jsx     # 'use client' — CSV upload simulation
│   │   └── AICleaningPanel.jsx    # Shows AI data cleaning suggestions
│   ├── optimizer/
│   │   ├── OptimizerPanel.jsx     # 'use client' — Configuration + run panel
│   │   ├── OptimizationProgress.jsx # 'use client' — Animated progress
│   │   ├── ConstraintPanel.jsx    # 'use client' — Configure constraints
│   │   └── ResultsSummary.jsx     # Post-optimization summary
│   ├── loadplan/
│   │   ├── ContainerTabs.jsx      # 'use client' — Tab selector per container
│   │   ├── Container3DView.jsx    # 'use client' — THREE.JS wrapper
│   │   ├── Container3DScene.jsx   # 'use client' — Three.js canvas + scene
│   │   ├── CargoBlock.jsx         # 'use client' — Individual cargo piece in 3D
│   │   ├── LoadDetailsPanel.jsx   # 'use client' — Right panel: shipment list, sequence
│   │   └── SavingsReport.jsx     # Cost savings breakdown
│   ├── replan/
│   │   ├── DeviationAlert.jsx     # Dock scan deviation display
│   │   ├── ImpactAssessment.jsx   # Auto-generated impact analysis
│   │   ├── ReplanAnimation.jsx    # 'use client' — Replan progress animation
│   │   └── BeforeAfterView.jsx    # 'use client' — Side-by-side 3D comparison
│   └── tablet/
│       ├── TabletHeader.jsx       # Simplified header for tablet
│       ├── StepByStepLoader.jsx   # 'use client' — Sequential loading instructions
│       └── ContainerSelector.jsx  # 'use client' — Container dropdown
│
├── context/
│   └── AppContext.jsx             # 'use client' — Single context: shipments, optimization state, replan state
│
├── data/
│   ├── mockShipments.js           # 25 shipment records (pre-populated)
│   ├── mockContainers.js          # Container types + 5 available physical containers
│   ├── mockClients.js             # 8 client companies
│   ├── mockOptimizationResult.js  # Pre-computed optimization output
│   ├── mockReplanScenario.js      # Deviation scenario + replan result
│   └── mockNotifications.js       # 3 notification items for header bell
│
└── utils/
    ├── formatters.js              # Currency, weight, dimension formatting
    ├── containerSpecs.js          # Container dimension constants
    ├── clientColors.js            # Consistent color per client (8 colors)
    └── mockBinPacker.js           # Simple greedy bin-packing to generate 3D positions
```

### Key Next.js Architecture Notes

1. **`'use client'` directive:** Any component with state, effects, event handlers, Three.js, Recharts, or Framer Motion needs `'use client'` at the top. The page files (`page.jsx`) can be server components that compose client components.

2. **Root layout (`app/layout.jsx`):** Wraps everything in `<AppProvider>` (from context) and `<AppShell>` (sidebar + header). Sets metadata (title: "FreightWare").

3. **Tablet layout (`app/tablet/layout.jsx`):** Separate layout with NO sidebar, NO header. Light mode. Full-screen. This route should feel like a completely different app.

4. **No API routes yet.** All data is imported directly from `/data/` mock files. When production begins, these imports get replaced with API calls — the component structure stays the same.

5. **AppContext** holds:
   - `shipments` — array of 25 records (pre-populated from mockShipments)
   - `optimizationState` — 'idle' | 'running' | 'complete'
   - `optimizationResult` — the pre-computed result (loaded after "run" animation)
   - `replanState` — 'idle' | 'deviation-received' | 'replanning' | 'complete'
   - `replanResult` — the pre-computed replan output
   - Actions: `runOptimization()`, `triggerReplan()`, `importCSV()`, `updateShipment()`

---

## 4. MOCK DATA SPECIFICATION

### Container Types + Physical Pool (mockContainers.js)
```js
export const containerTypes = {
  '20ft': {
    name: "20' Standard",
    internal: { length: 5.898, width: 2.352, height: 2.393 }, // meters
    maxWeight: 28180, // kg (payload)
    volume: 33.2, // m³
    teu: 1
  },
  '40ft': {
    name: "40' Standard",
    internal: { length: 12.032, width: 2.352, height: 2.393 },
    maxWeight: 26680,
    volume: 67.7,
    teu: 2
  },
  '40ftHC': {
    name: "40' High Cube",
    internal: { length: 12.032, width: 2.352, height: 2.698 },
    maxWeight: 26460,
    volume: 76.3,
    teu: 2
  }
};

// 5 physical containers available in the yard
export const availableContainers = [
  { id: 'CTR-001', type: '40ftHC', status: 'assigned' },
  { id: 'CTR-002', type: '40ft', status: 'assigned' },
  { id: 'CTR-003', type: '20ft', status: 'assigned' },
  { id: 'CTR-004', type: '40ftHC', status: 'available' },
  { id: 'CTR-005', type: '40ft', status: 'available' },
];
```

### Clients (mockClients.js)
8 fictional companies representing typical LCL shippers on Asia-Pacific lanes:
```js
export const clients = [
  { id: 'CLT-001', name: 'Pacific Timber Co.', type: 'Lumber/Wood Products', priority: 'standard' },
  { id: 'CLT-002', name: 'BC Seafood Exports', type: 'Perishables (Frozen)', priority: 'high', tempControlled: true },
  { id: 'CLT-003', name: 'Cascade Electronics', type: 'Electronics', priority: 'standard', fragile: true },
  { id: 'CLT-004', name: 'Fraser Valley Agriculture', type: 'Dry Goods/Grain', priority: 'standard' },
  { id: 'CLT-005', name: 'West Coast Machinery', type: 'Heavy Equipment', priority: 'low', oversize: true },
  { id: 'CLT-006', name: 'Lotus Textiles', type: 'Garments/Textiles', priority: 'standard' },
  { id: 'CLT-007', name: 'Harbour Chemicals', type: 'HAZMAT (Class 3)', priority: 'high', hazmat: true },
  { id: 'CLT-008', name: 'Artisan Furniture YVR', type: 'Furniture', priority: 'standard', fragile: true }
];
```

### Client Color Map (utils/clientColors.js)
Consistent color per client across all views (tables, 3D blocks, badges):
```js
export const clientColors = {
  'CLT-001': '#3B82F6', // blue — Pacific Timber
  'CLT-002': '#06B6D4', // cyan — BC Seafood
  'CLT-003': '#8B5CF6', // purple — Cascade Electronics
  'CLT-004': '#F59E0B', // amber — Fraser Valley
  'CLT-005': '#EF4444', // red — West Coast Machinery
  'CLT-006': '#EC4899', // pink — Lotus Textiles
  'CLT-007': '#F97316', // orange — Harbour Chemicals
  'CLT-008': '#10B981', // green — Artisan Furniture
};
```

### Shipments (mockShipments.js)
25 shipments, pre-populated on load. Each shipment object:
```js
{
  id: 'SHP-2026-0001',
  clientId: 'CLT-001',
  clientName: 'Pacific Timber Co.',
  description: 'Kiln-dried cedar planks, bundled',
  pieces: 4,                        // number of pallets/packages
  manifestDimensions: {              // what the booking says
    length: 1.2, width: 1.0, height: 1.5  // meters, per piece
  },
  actualDimensions: null,            // null until scanned at dock (used in replan)
  weight: 2800,                      // kg total
  weightPerPiece: 700,
  volume: 7.2,                       // m³ total
  priority: 'standard',              // standard | high | critical
  deliveryWindow: '2026-03-28',      // sailing date
  destination: 'Shanghai',
  bookingRef: 'BK-PCL-44921',
  status: 'confirmed',               // confirmed | flagged | cleaning-required | loaded
  hazmat: false,
  stackable: true,
  fragile: false,
  tempRange: null,                   // { min: -18, max: -15 } for frozen
  notes: '',
  
  // AI cleaning metadata (populated for some records to show cleaning feature)
  aiFlags: [],                       // e.g., ['dimension_mismatch', 'missing_weight', 'duplicate_suspected']
  aiSuggestions: [],                  // e.g., ['Weight estimated from similar cedar shipments: ~680kg/pallet']
  cleaningStatus: 'clean'            // clean | needs-review | auto-corrected
}
```

**Important:** Make ~8 of the 25 shipments have AI flags/issues:
- 2 with dimension mismatches (manifest vs typical for that cargo type)
- 2 with missing weight data (AI suggests based on commodity)
- 1 suspected duplicate
- 1 with inconsistent units (imperial mixed with metric)
- 1 with typo in client name (AI auto-corrected)
- 1 with HAZMAT flag but no proper UN code

### Notifications (mockNotifications.js)
```js
export const notifications = [
  { id: 1, type: 'warning', title: 'Dock scan received', message: 'SHP-2026-0003 (Cascade Electronics) — dimensions differ from manifest', time: '2 min ago', read: false },
  { id: 2, type: 'alert', title: '2 shipments pending review', message: 'AI flagged data issues on SHP-2026-0009 and SHP-2026-0015', time: '15 min ago', read: false },
  { id: 3, type: 'success', title: 'Optimization complete', message: 'Run OPT-20260324-001 solved in 2.4s — 3 containers, 91.5% utilization', time: '1 hr ago', read: true },
];
```

### Optimization Result (mockOptimizationResult.js)
Pre-computed "result" of the optimization:
```js
{
  runId: 'OPT-20260324-001',
  timestamp: '2026-03-24T14:32:00Z',
  solver: 'OR-Tools CP-SAT',
  solveTime: 2.4,               // seconds (displayed in UI)
  status: 'optimal',
  
  containersUsed: [
    {
      id: 'CTR-001',
      type: '40ftHC',
      utilization: 94.2,         // volume %
      weightUtilization: 87.5,   // weight %
      shipments: ['SHP-2026-0001', 'SHP-2026-0003', 'SHP-2026-0007', ...],
      loadSequence: [             // order to load (for floor workers)
        { shipmentId: 'SHP-2026-0007', position: { x: 0, y: 0, z: 0 }, loadOrder: 1, note: 'Heavy — place first, rear wall' },
        { shipmentId: 'SHP-2026-0001', position: { x: 1.2, y: 0, z: 0 }, loadOrder: 2, note: 'Stack on top of SHP-0007' },
        // ... remaining generated by mockBinPacker.js utility
      ]
    },
    {
      id: 'CTR-002',
      type: '40ft',
      utilization: 91.8,
      weightUtilization: 82.1,
      // ...
    },
    {
      id: 'CTR-003',
      type: '20ft',
      utilization: 88.5,
      weightUtilization: 79.3,
      // ...
    }
  ],
  
  // Before optimization (what manual planning would produce)
  baseline: {
    containersNeeded: 5,
    avgUtilization: 72.3,
    estimatedCost: 13500  // CAD
  },
  
  // After optimization
  optimized: {
    containersNeeded: 3,
    avgUtilization: 91.5,
    estimatedCost: 8100   // CAD
  },
  
  savings: {
    containersReduced: 2,
    costSaved: 5400,       // CAD
    utilizationGain: 19.2, // percentage points
    co2Reduced: 2.4        // tonnes
  }
}
```

### Mock Bin Packer Utility (utils/mockBinPacker.js)
**Cursor should write this utility.** A simple greedy algorithm that:
1. Takes the list of shipments assigned to a container
2. Takes the container's internal dimensions
3. Places cargo blocks sequentially using a naive "next-fit decreasing height" approach
4. Returns an array of `{ shipmentId, position: {x, y, z}, dimensions: {l, w, h} }` with no overlaps
5. Does NOT need to be optimal — just plausible-looking for a demo

This utility is called once to generate the `loadSequence` positions in the mock optimization result. The positions can be hard-coded after initial generation if preferred.

### Replan Scenario (mockReplanScenario.js)
```js
{
  trigger: 'Dock scan received — SHP-2026-0003 (Cascade Electronics) actual dimensions differ from manifest',
  originalShipment: {
    id: 'SHP-2026-0003',
    manifestDimensions: { length: 0.8, width: 0.6, height: 1.0 },  // per piece
    pieces: 6
  },
  actualScan: {
    dimensions: { length: 0.9, width: 0.7, height: 1.2 },  // larger than expected
    pieces: 6,
    note: 'Pallets re-wrapped with additional protective packaging'
  },
  volumeIncrease: 2.16,  // m³ additional
  
  replanResult: {
    solveTime: 0.8,        // seconds — KEY DIFFERENTIATOR: fast replan
    containersUsed: 3,     // same count (optimizer found a way)
    changes: [
      { containerId: 'CTR-001', action: 'resequenced', details: 'Moved SHP-0012 to CTR-002 to accommodate larger SHP-0003' },
      { containerId: 'CTR-002', action: 'added', details: 'Received SHP-0012 from CTR-001' },
    ],
    newUtilization: { 'CTR-001': 96.1, 'CTR-002': 93.4, 'CTR-003': 88.5 },
    // Updated loadSequence positions for CTR-001 (different from original)
    updatedLoadSequences: {
      'CTR-001': [ /* new positions after replan — generated by mockBinPacker */ ],
      'CTR-002': [ /* updated */ ],
    },
    status: 'Replanned without additional container — $2,200 overflow charge avoided'
  }
}
```

---

## 5. SCREEN-BY-SCREEN SPECIFICATIONS

### 5.0 Layout Shell

**Sidebar (always visible, left, 240px; collapsible to 64px via toggle button + auto-collapse at <1280px):**
- FreightWare logo (icon: container/box with signal waves)
- Collapse/expand toggle button at top
- Nav items with icons (use lucide-react):
  - Dashboard (LayoutDashboard icon)
  - Shipments (Package icon)
  - Optimizer (Zap icon)
  - Load Plan (Box icon)  
  - Replan (RefreshCw icon)
  - Tablet View (Tablet icon) — opens `/tablet` route (separate layout)
- Bottom: Settings gear (dead link, shows "Coming soon" toast on click), "PROTOTYPE v0.1" text in fw-text-muted

**Header (top bar):**
- Left: Current page title (auto-derived from route) + breadcrumb
- Center: Search bar (styled input, non-functional placeholder: "Search shipments, containers...")
- Right: 
  - Quantum toggle switch (see Design System section)
  - Notification bell — clickable, opens dropdown with 3 items from mockNotifications.js. Unread count badge (2). Each item shows icon, title, message, time. Items are not interactive beyond display.
  - User avatar circle "PCL" with tooltip "Pacific Coast Logistics — Operations"

**Page Titles (document.title):**
- Dashboard: "Dashboard — FreightWare"
- Shipments: "Shipments — FreightWare"
- Optimizer: "Optimizer — FreightWare"
- Load Plan: "Load Plan — FreightWare"
- Replan: "Replan — FreightWare"
- Tablet: "Floor Assistant — FreightWare"

---

### 5.1 Dashboard (route: `/`)

The landing screen. Dense but scannable. Shows the operator's current state at a glance.

**Top row — 4 KPI cards (MetricCard component):**
1. **Active Shipments:** 25 (with small sparkline of last 7 days)
2. **Containers Planned:** 3 of 5 available (circular progress ring)
3. **Avg Utilization:** 91.5% (green, with arrow up from 72.3% baseline)
4. **Weekly Savings:** $5,400 CAD (green, with "2 containers saved" subtitle)

**Middle row — 2 panels side by side:**

Left panel (60%) — **Utilization Trend Chart** (Recharts AreaChart):
- X-axis: Last 4 weeks (mock data)
- Y-axis: Utilization %
- Two lines: "Before FreightWare" (dashed, ~72-78%) and "With FreightWare" (~89-95%)
- Caption: "Rolling 4-week container utilization — Vancouver export operations"

Right panel (40%) — **AI Insights** (purple-accented card):
- Header: "AI Recommendations" with AI badge
- 3-4 items with icons:
  - ⚠️ "SHP-0003 dimensions likely understated — recommend dock verification before loading" 
  - 💡 "CLT-002 and CLT-006 shipments share destination (Shanghai) — consolidation opportunity"
  - 📊 "Historical pattern: Friday bookings from Pacific Timber typically +15% volume vs manifest"
  - 🔄 "2 shipments flagged for data cleaning — review before optimization run"
- Each item clickable (navigates to relevant page/shipment)

**Bottom row — Shipments Requiring Attention (mini table):**
- Shows only the ~8 flagged shipments
- Columns: ID, Client, Issue, AI Suggestion, Action button
- Color-coded rows: amber for warnings, red for errors
- "View All Shipments →" link (navigates to /shipments)

**Demo flow affordance:** Subtle "next step" prompt at bottom: "Ready to import shipment data? → Go to Shipments" (only shown if optimization hasn't been "run" yet)

---

### 5.2 Shipments Page (route: `/shipments`)

Full shipment management view. This is where the "messy CSV → clean data" story is told.

**Data is pre-populated** with all 25 records on page load. The CSV import is a demo-able overlay that re-shows the AI cleaning process.

**Top bar:**
- "Import CSV" button (opens ImportCSVModal)
- Filter dropdowns: Client, Status, Priority, Destination
- Search box (filters the table in real-time)
- Toggle: "Show AI flags only" (filters to flagged items)

**CSV Import Flow (ImportCSVModal):**
1. User clicks "Import CSV"
2. Modal shows drag-drop area (clicking anywhere triggers the flow)
3. Brief animation: "Processing pacific_coast_shipments_raw.csv..." with file icon
4. **AI Cleaning Summary Panel** appears (staged over ~2 seconds):
   - "FreightWare AI analyzed 25 records" with AI badge
   - "8 issues detected, 3 auto-corrected, 5 need review"
   - Show each issue with before → after, appearing one by one:
     - `"Pacifc Timbr Co" → "Pacific Timber Co."` (auto-corrected ✓)
     - `Weight: "" → "~680kg (estimated from commodity: cedar lumber)"` (needs confirmation)
     - `Dimensions: 48" x 40" x 60" → 1.22m x 1.02m x 1.52m` (unit conversion, auto-corrected ✓)
     - `Duplicate detected: SHP-0009 ≈ SHP-0014 — flagged for review`
     - `HAZMAT Class 3 declared but UN number missing — flagged`
   - "Accept All Corrections" button + "Review Individually" button
5. Accepting closes modal, briefly flashes the affected rows in the table

**Shipment Table (DataTable component):**
- Columns: Status indicator (colored dot), Shipment ID (mono font), Client (with color dot), Description, Pieces, Dimensions (L×W×H m), Weight (kg), Volume (m³), Priority (badge), Destination, Sailing Date, Actions (eye icon)
- Status dots: 🟢 clean, 🟡 AI-corrected, 🔴 needs review, 🔵 loaded
- Sortable by any column (click header)
- Row click → ShipmentDetailModal

**Shipment Detail Modal:**
- Full details of selected shipment in a clean card layout
- If AI flags exist, show them in an amber box at top
- "Mark as Verified" button (changes status to clean, green flash)
- History log at bottom: "Imported from CSV → AI cleaned → Verified by operator"

**Demo flow affordance:** After reviewing shipments, show "All data verified → Run Optimization" button/link at top right, linking to /optimizer

---

### 5.3 Optimizer Page (route: `/optimizer`)

Where the operator configures and runs the optimization. This is where "AI + future quantum" is showcased.

**Left panel (40%) — Configuration:**

**Container Selection section:**
- Shows all 5 available containers as cards
- Each card: container ID, type, capacity specs
- Checkbox to include/exclude from optimization
- 3 are checked by default (the ones the optimizer "uses")

**Constraints Panel section:**
- Weight limit per container: ON (toggle with weight shown)
- HAZMAT isolation: ON (toggle) — subtitle: "Per IMDG code"
- Temperature compatibility: ON (toggle) — subtitle: "Frozen cargo grouped"
- Stackability rules: ON (toggle)
- Client priority weighting: slider (1-10) for each priority level
- Sailing date grouping: ON (toggle)

**Optimization Mode section:**
- Radio buttons:
  - ● **Classical (OR-Tools CP-SAT)** — "Constraint programming, exact solver" — ACTIVE, cyan highlight
  - ○ **Quantum-Enhanced (D-Wave Hybrid)** — "Quantum annealing + classical" — GREYED OUT with purple "Coming 2027" badge
- Below quantum option: small text in fw-text-muted: "Quantum acceleration benefits loads >50 shipments across >8 containers. Current load: 25 shipments, 5 containers — classical solver is optimal."

**Right panel (60%) — Run & Results:**

**Before run:**
- Summary card: "25 shipments ready, 5 containers available, 6 constraints active"
- Big "Run Optimization" button (cyan, prominent, centered)

**During run — OptimizationProgress (full panel takeover):**
Clicking "Run Optimization" triggers a staged animation sequence:
1. "Validating 25 shipment records..." (0.5s) → checkmark appears
2. "Building constraint model (6 constraints)..." (1s) → shows constraint count animating
3. "Solving with OR-Tools CP-SAT..." (2s) → animated progress bar filling 0% → 100%
4. "Solution found — Status: OPTIMAL" (0.5s) → green checkmark burst animation
5. Total elapsed timer counting up: "Solved in 2.4 seconds"

This is implemented as a series of setTimeout callbacks. No actual solver.

**After run — ResultsSummary (replaces run area):**
- **Before vs After comparison cards side by side:**
  - Left card "Manual Planning": 5 containers, 72.3% utilization, $13,500 CAD
  - Right card "FreightWare Optimized": 3 containers, 91.5% utilization, $8,100 CAD
  - Green delta callout between them: "−2 containers, +19.2% utilization, $5,400 saved"
- CO₂ reduction: "2.4 tonnes CO₂ avoided" with leaf icon
- **"View Load Plan →"** button (navigates to /loadplan) — this is the primary demo flow CTA
- "Export Report (PDF)" button — shows toast: "PDF export coming in v1.0"

---

### 5.4 Load Plan Page (route: `/loadplan`)

The core visual output. Shows how cargo is packed into each container.

**Top section — Container selector tabs:**
- Tab per container: "CTR-001 (40' HC) — 94.2%" | "CTR-002 (40') — 91.8%" | "CTR-003 (20') — 88.5%"
- Active tab highlighted with cyan bottom border and subtle glow
- Each tab shows a thin utilization bar beneath the label

**Main area — split view:**

**Left (60%) — 3D Container Visualization (Container3DView):**
This is the hero feature. Uses Three.js via @react-three/fiber and @react-three/drei.

Implementation:
- Container: wireframe box using EdgesGeometry on BoxGeometry, cyan colored edges (#06B6D4), slight transparency
- Floor grid inside container for spatial reference (drei's Grid component)
- Cargo blocks: BoxGeometry with MeshStandardMaterial per shipment
  - Color: from clientColors map (per client)
  - Opacity: 0.85 (slightly transparent to see overlaps if any)
  - Hover state: scale up 1.02x, increase emissive brightness
  - Click state: highlight with outline/glow, update right panel
- Lighting: soft ambient (intensity 0.4) + one directional light from top-front (intensity 0.8)
- Camera: OrbitControls from drei with damping (dampingFactor 0.1)
- Preset camera angle buttons (positioned over the 3D canvas): "Front", "Top", "Side", "Isometric"
- Dimension labels on container edges (use drei's Html component for overlaid text)
- Tooltip on cargo hover: shipment ID, client, dimensions, weight (use drei's Html)

Loading animation (triggered on tab switch or page load):
- Cargo blocks animate in one by one, in load sequence order
- Each block fades in (opacity 0→0.85) and slides to its position from above (y offset → final y) over 400ms
- Staggered: each block starts 200ms after the previous

**Right (40%) — Load Details Panel (LoadDetailsPanel):**

- **Container Summary card:**
  - Type + dimensions text
  - Volume utilization: horizontal progress bar with percentage (94.2%)
  - Weight utilization: horizontal progress bar with percentage (87.5%)
  - Shipment count: "8 shipments in this container"

- **Shipment List (in this container):**
  - Ordered by load sequence number
  - Each row: 
    - Load order # (circled number)
    - Client color dot
    - Shipment ID (mono)
    - Description (truncated)
    - Volume (m³)
    - Weight (kg)
  - Hover on a row → highlights corresponding 3D block (emissive glow)
  - Click on a row → camera smoothly orbits to focus on that block

- **"Show Loading Order" toggle button:**
  - When active: 3D view replays the load sequence animation step by step
  - A progress indicator shows "Step 3 of 8"
  - Floor worker instruction text appears below: "Step 3: Place SHP-0007 (West Coast Machinery) at rear wall, floor level. Weight: 4,200kg — USE FORKLIFT. ⚠️ Do not stack above."
  - Forward/back buttons to step through

**Demo flow affordance:** "Simulate a dock deviation → Replan" link at top-right, navigating to /replan

---

### 5.5 Replan Page (route: `/replan`)

The differentiator demo. Shows what happens when cargo arrives different from manifest.

**Initial state — Deviation Alert (top of page):**
- Full-width amber alert banner:
  - Icon: AlertTriangle
  - Title: "⚠️ DOCK SCANNER ALERT"
  - "SHP-2026-0003 (Cascade Electronics) — actual dimensions differ from manifest"
- Deviation detail card below:
  - Two columns: "Manifest" vs "Dock Scan"
  - Manifest: 0.8m × 0.6m × 1.0m per piece × 6 pieces = 2.88 m³
  - Actual: 0.9m × 0.7m × 1.2m per piece × 6 pieces = 4.54 m³
  - Delta: "+2.16 m³ (+45%)" in red
  - Reason tag: "Re-wrapped with additional protective packaging"

**Impact Assessment card (auto-generated, AI badge):**
- "This deviation affects Container CTR-001 (currently at 94.2% utilization)"
- "Increased volume cannot fit in current arrangement"
- Risk callout (red border): "Without replanning: overflow to 4th container at $2,200 CAD"
- Risk comparison: "Manual replanning: ~45 minutes. FreightWare: seconds."

**Action area:**
- Big button: "Replan Now" (cyan, with subtle pulsing animation)
- Below: "Replanning uses warm-start from current solution — only affected containers are re-solved"

**Replan animation (triggered on click):**
Simplified dramatic sequence:
1. Current 3D view of CTR-001 visible on screen
2. Cargo blocks rapidly scale down to 0 and fade out (200ms, staggered)
3. Brief cyan flash/pulse across the container wireframe (100ms)
4. New arrangement blocks fly in from outside the container and settle into new positions (500ms, staggered)
5. Changed/moved blocks pulse amber 3 times (300ms each)
6. Timer displayed prominently, counting up: "0.0s → 0.1s → ... → 0.8s"
Total animation: ~2 seconds

**Post-replan — Before/After Split View:**
- Side-by-side layout:
  - Left: "Original Plan" label — 3D view of CTR-001 in its original arrangement (static)
  - Right: "Replanned" label — 3D view of CTR-001 in new arrangement (moved blocks have amber border)
- Both views have orbit controls
- Change log below the 3D views:
  - "✦ SHP-2026-0012 moved from CTR-001 → CTR-002"
  - "✦ SHP-2026-0003 repositioned within CTR-001 (larger footprint)"
  - "✦ Loading sequence updated for CTR-001"
- Updated utilization: CTR-001: 94.2% → 96.1%, CTR-002: 91.8% → 93.4%
- **Hero callout (large, green background):**
  - "Replanned in 0.8 seconds"
  - "No additional container needed"
  - "Overflow charge avoided: $2,200 CAD"
  - This is THE demo moment. Make it visually prominent.

**Demo flow affordance:** "See how floor workers use this → Tablet View" link

---

### 5.6 Tablet View (route: `/tablet`)

Separate UI mode — uses its own `layout.jsx` with NO sidebar, NO header from the main app.

**CRITICAL: This route uses a completely different visual style:**
- **Light mode** (white/light gray background — warehouse lighting makes dark screens unreadable)
- **LARGE text** (min 20px body, 36px headings)
- **BIG touch targets** (min 56px buttons, generous padding)
- No sidebar, no complex navigation
- Full screen

**Tablet Header:**
- Left: "FreightWare" logo (small) + "Floor Assistant" text
- Center: Container selector dropdown (CTR-001 | CTR-002 | CTR-003)
- Right: "Back to Planning" link → returns to main UI (/)

**Flow:**
1. Select container from dropdown (defaults to CTR-001)
2. Shows step-by-step loading instructions as large cards, one at a time:

**Step Card (full width, large):**
- Top: Step number in huge text: "STEP 1 of 8"
- Progress bar across top (1/8 filled)
- Shipment ID + Client name (large, with client color accent)
- **Placement instruction:** "Place at: REAR WALL, FLOOR LEVEL" (bold, uppercase)
- Dimensions shown large: "1.2m × 1.0m × 1.5m"
- Weight: "2,800 kg" with icon — if >1000kg: "⚠️ USE FORKLIFT" warning badge
- Special instructions (if any): "⚠️ FRAGILE — Do not stack above" (red text)
- Simple 2D diagram showing placement in container:
  - Top-down rectangle of the container
  - Highlighted zone showing where this piece goes (colored rectangle)
  - Previously loaded pieces shown in gray
  - Arrow indicating loading direction
- Two large buttons at bottom:
  - "✓ Mark Complete" (green, full width) → advances to next step with slide animation
  - "⚑ Flag Issue" (amber, smaller) → opens mini-modal with options: "Wrong dimensions", "Damaged", "Missing", "Other" (each is a big tap target)

3. When all steps complete:
  - Full-screen success state: "Container CTR-001 Loading Complete ✓"
  - Summary: "8/8 pieces loaded, 0 issues flagged"
  - Utilization: "94.2% volume utilized"
  - "Select Next Container" button or "Done" button

---

## 6. INTERACTIONS & ANIMATIONS

### Page Transitions
- Use Framer Motion for transitions between views within pages (e.g., pre-optimization → post-optimization)
- Fade + slight slide (12px vertical) for content changes
- Duration: 200ms ease-out
- Note: Next.js App Router handles route transitions — don't fight it with full page animations

### Data Loading Simulations
- When navigating to any page, show a brief skeleton/shimmer loading state (200-300ms) before rendering content
- This simulates a real app fetching data and creates perceived quality

### 3D Container Interactions
- OrbitControls: smooth damping (dampingFactor 0.1), min/max distance to prevent clipping
- Cargo hover: scale 1.02x, increase emissive color to brighter version of client color
- Cargo click: increase emissive further, camera smoothly animates to focus on that block
- Load sequence animation: each block fades in (opacity 0→0.85) and slides from y+2 to final y over 400ms, staggered 200ms

### Toasts (ToastProvider)
- Appear bottom-right, stack upward
- Success: green left-border
- Warning: amber left-border  
- Error: red left-border
- Info: cyan left-border
- Auto-dismiss after 4 seconds
- Slide-in animation from right

### Replan Animation
Simplified dramatic sequence (no physics engine needed):
1. Existing cargo blocks scale to 0 and fade (200ms each, staggered 50ms)
2. Container wireframe pulses cyan (100ms)
3. New arrangement blocks fly in from y+5 and settle to position (400ms each, staggered 100ms)
4. Changed blocks pulse with amber emissive 3 times (300ms each)
5. Elapsed timer counts in real-time: "0.0s" → "0.8s" (displayed large, center-bottom overlay)
Total visual duration: ~2 seconds

### Skeleton Loading States
Use simple animated placeholder blocks (bg-fw-surface-2 with shimmer gradient) shaped like the content they replace. Apply to:
- KPI cards (4 rectangles)
- Charts (large rectangle)
- Table rows (stacked thin rectangles)
- 3D view (large rectangle with pulsing outline)

---

## 7. RESPONSIVE BEHAVIOR

- **Desktop (>1280px):** Full sidebar expanded (240px) + all panels visible side by side
- **Tablet landscape (768-1280px):** Sidebar auto-collapsed (64px icons only), panels stack vertically where needed, 3D view stacks above details
- **Tablet View route (/tablet):** Always full-width, no sidebar, own light-mode layout. Optimized for 10" tablet in landscape.

The prototype primarily targets desktop demo scenarios (laptop + projector in a CFS office). Tablet route should work on actual tablets.

---

## 8. BUILD SEQUENCE FOR CURSOR

Build in this exact order. Each step produces a testable, visually complete increment.

### Phase 1: Foundation (do this first, test that the app runs)
1. Next.js project setup with all dependencies
2. Tailwind v4 CSS configuration with @theme tokens
3. Root layout with font loading and metadata
4. AppContext provider with mock data loaded
5. AppShell component (Sidebar + Header wrapper)
6. All 6 route pages as empty shells with just the page title
7. Verify: app runs, all routes work, sidebar nav highlights active route

### Phase 2: Shared Components
8. Button, Badge, Card, MetricCard, ProgressBar components
9. DataTable component with sorting and filtering
10. Modal component
11. ToastProvider + Toast component
12. Verify: import and render each component on a test page

### Phase 3: Dashboard
13. KPIRow with 4 MetricCards (hardcoded mock data)
14. UtilizationChart with Recharts (mock weekly data)
15. AIInsightsPanel with clickable items
16. Bottom flagged shipments mini-table
17. Verify: dashboard looks complete and data-rich

### Phase 4: Shipments
18. ShipmentTable with all 25 records, sorting, filtering
19. Status dots and AI flag indicators
20. ShipmentDetailModal
21. ImportCSVModal with staged AI cleaning animation
22. Verify: can filter, sort, open details, run import demo

### Phase 5: Optimizer
23. Configuration panel (container selection, constraints, optimization mode radio)
24. Quantum toggle with "Coming 2027" badge
25. OptimizationProgress staged animation
26. ResultsSummary with before/after comparison
27. Verify: full flow from config → run → results works

### Phase 6: 3D Visualization (the complex phase)
28. Basic Three.js scene: container wireframe in a Canvas
29. Camera controls (OrbitControls) + preset angle buttons
30. CargoBlock component: colored box at a position
31. Render all cargo blocks for one container from mock data
32. Hover/click interactions (highlight, tooltip)
33. Load sequence animation (staggered fly-in)
34. ContainerTabs to switch between containers
35. LoadDetailsPanel (right side: summary, shipment list, load order)
36. Verify: can view all 3 containers in 3D, interact with blocks, see details

### Phase 7: Replan
37. DeviationAlert banner + detail card
38. ImpactAssessment card
39. ReplanAnimation (scale-down → flash → fly-in → amber pulse → timer)
40. BeforeAfterView with two 3D scenes side by side
41. Hero savings callout
42. Verify: full replan flow from alert → click → animation → results

### Phase 8: Tablet & Polish
43. Tablet layout.jsx (light mode, no sidebar)
44. TabletHeader with container selector
45. StepByStepLoader with large step cards + 2D placement diagram
46. "Mark Complete" + "Flag Issue" interactions
47. Completion screen
48. Verify: tablet flow works end-to-end, large touch targets

### Phase 9: Final Polish
49. Skeleton loading states on all pages
50. Page transition animations (Framer Motion)
51. Notification bell dropdown
52. Demo flow "next step" affordances on each page
53. Header search bar styling
54. Settings dead link with toast
55. Final review: navigate entire demo flow start to finish

---

## 9. CRITICAL DEMO MOMENTS

When building, prioritize these moments — they are what sells the product:

1. **CSV Import → AI Cleaning:** The moment messy data becomes clean data with AI explanations. The operator sees that the tool understands their messy real-world data. The staged reveal of issues (appearing one by one) creates a "wow, it caught that" reaction.

2. **Optimization Run → 2.4 seconds:** The animated solve that shows constraint programming working. The contrast: "Your dispatcher spends 3 hours in Excel. FreightWare: 2.4 seconds." The progress stages (validate → build model → solve → optimal) make it feel like real computation.

3. **3D Container View:** The visual that no competitor in this market has. Rotatable, clickable, color-coded by client. The operator can see exactly how their container is packed and why each piece is where it is. The load sequence animation shows it's not just a picture — it's a plan.

4. **Replan in 0.8 seconds:** THE demo moment. "Your cargo arrived 45% larger than the manifest said. In the old world, your planner spends 45 minutes reworking the plan or books an overflow container at $2,200. With FreightWare: click one button, 0.8 seconds, new plan, same number of containers." The before/after split view with the prominent timer and savings callout — this is the product insight made visible.

5. **Tablet Floor View:** Shows this isn't just planning software — it reaches the warehouse floor. The floor worker doesn't need to interpret a spreadsheet. Step 1, Step 2, Step 3. Big text, big buttons. Done. This answers the CFS manager's unspoken question: "But will my guys actually use it?"

---

## 10. NOTES FOR CURSOR

### Architecture
- This is a prototype evolving toward production. Use clean patterns, but don't over-engineer.
- AppContext is the single source of truth for all state. No prop drilling more than 2 levels — use context.
- All data comes from mock files today. Structure components so that swapping `import { shipments } from '@/data/mockShipments'` for a `fetch('/api/shipments')` call later is trivial.
- All interactive components need `'use client'` directive. Page files can be server components that compose client components.

### Styling
- Use Tailwind v4 utility classes directly. No CSS modules, no styled-components.
- Use the @theme tokens defined in globals.css (e.g., `bg-fw-surface`, `text-fw-cyan`).
- Dark mode is the default and only theme for the main app. Tablet view is light mode.

### 3D (Three.js)
- All Three.js components MUST have `'use client'`.
- Use @react-three/fiber's `<Canvas>` and @react-three/drei for helpers (OrbitControls, Html, Grid).
- The 3D view is the most complex component. Build it incrementally: wireframe first → blocks → interactions → animations.
- If performance is an issue, reduce cargo block polygon count (low-poly BoxGeometry is fine).

### Mock Data
- All 25 shipments are pre-populated on app load via AppContext.
- The CSV import is a demo overlay — it doesn't actually replace the data, just shows the cleaning process.
- The optimization "run" is a series of setTimeout callbacks that set `optimizationState` to 'complete' and load the pre-computed result.
- The mockBinPacker.js utility should generate plausible (not optimal) 3D positions. Write a simple greedy first-fit-decreasing algorithm.

### Demo Flow
- Each page should have a subtle "next step" affordance guiding the presenter through the linear demo path: Dashboard → Shipments → Optimizer → Load Plan → Replan → Tablet
- These affordances should be contextual (e.g., "All data verified → Run Optimization" only shows on Shipments page after data is reviewed) but not blocking (the user can navigate freely via sidebar).
