# FreightWare — React SPA Prototype: Cursor Build Instructions

**Product:** FreightWare — Real-time 3D container load planning and replanning SaaS for export LCL consolidators  
**Purpose:** Clickable prototype for (1) internal alignment between founders, (2) client demos with CFS operations managers  
**Tech:** React SPA (Vite + React), no backend, all mock data, fully interactive  
**Audience:** CFS Operations Managers at mid-tier export LCL consolidators, Port of Vancouver  

---

## 1. PROJECT SETUP

```bash
npm create vite@latest freightware-prototype -- --template react
cd freightware-prototype
npm install
npm install react-router-dom three @react-three/fiber @react-three/drei lucide-react framer-motion recharts
npm install -D tailwindcss @tailwindcss/vite
```

### Tailwind Config (tailwind.config.js)
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'fw-bg': '#0B0F1A',
        'fw-surface': '#111827',
        'fw-surface-2': '#1A2035',
        'fw-border': '#2A3450',
        'fw-cyan': '#06B6D4',
        'fw-cyan-dim': '#0E7490',
        'fw-amber': '#F59E0B',
        'fw-amber-dim': '#D97706',
        'fw-green': '#10B981',
        'fw-green-dim': '#059669',
        'fw-red': '#EF4444',
        'fw-red-dim': '#DC2626',
        'fw-purple': '#8B5CF6',
        'fw-text': '#E5E7EB',
        'fw-text-dim': '#9CA3AF',
        'fw-text-muted': '#6B7280',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'sans': ['DM Sans', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

### CSS Variables (src/index.css)
```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap');

:root {
  --fw-bg: #0B0F1A;
  --fw-surface: #111827;
  --fw-cyan: #06B6D4;
  --fw-amber: #F59E0B;
  --fw-green: #10B981;
  --fw-red: #EF4444;
}

body {
  background: #0B0F1A;
  color: #E5E7EB;
  font-family: 'DM Sans', system-ui, sans-serif;
}

/* Scrollbar styling for dark theme */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #111827; }
::-webkit-scrollbar-thumb { background: #2A3450; border-radius: 3px; }
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

---

## 3. FILE STRUCTURE

```
src/
├── App.jsx                    # Router setup
├── main.jsx                   # Entry point
├── index.css                  # Global styles + Tailwind
├── data/
│   ├── mockShipments.js       # 25 shipment records (see Section 4)
│   ├── mockContainers.js      # Container types (20ft, 40ft, 40ftHC)
│   ├── mockClients.js         # 8 client companies
│   ├── mockOptimizationResult.js  # Pre-computed optimization output
│   └── mockReplanScenario.js  # Deviation scenario + replan result
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx        # Left nav (always visible)
│   │   ├── Header.jsx         # Top bar: logo, quantum toggle, notifications
│   │   └── Layout.jsx         # Shell: sidebar + header + content area
│   ├── shared/
│   │   ├── Badge.jsx          # Status/AI badges
│   │   ├── Button.jsx         # Primary/ghost/danger variants
│   │   ├── Card.jsx           # Standard card wrapper
│   │   ├── DataTable.jsx      # Sortable, filterable table
│   │   ├── Modal.jsx          # Overlay modal
│   │   ├── Toast.jsx          # Notification toasts
│   │   ├── ProgressBar.jsx    # For optimization progress simulation
│   │   └── MetricCard.jsx     # KPI display card
│   ├── dashboard/
│   │   ├── DashboardPage.jsx  # Main dashboard view
│   │   ├── KPIRow.jsx         # Top metrics row
│   │   ├── UtilizationChart.jsx # Container utilization over time
│   │   ├── ActiveShipmentsWidget.jsx
│   │   └── AIInsightsPanel.jsx # AI-generated suggestions
│   ├── shipments/
│   │   ├── ShipmentListPage.jsx    # All shipments view
│   │   ├── ShipmentRow.jsx         # Single row in table
│   │   ├── ShipmentDetailModal.jsx # Click to expand details
│   │   ├── ImportCSVModal.jsx      # CSV upload simulation
│   │   └── AICleaningPanel.jsx     # Shows AI data cleaning suggestions
│   ├── optimizer/
│   │   ├── OptimizerPage.jsx       # Optimization control panel
│   │   ├── OptimizationProgress.jsx # Animated progress during "solve"
│   │   ├── ConstraintPanel.jsx     # Configure constraints before run
│   │   └── ResultsSummary.jsx      # Post-optimization summary
│   ├── loadplan/
│   │   ├── LoadPlanPage.jsx        # Full load plan view
│   │   ├── ContainerCard.jsx       # Per-container summary card
│   │   ├── Container3DView.jsx     # THREE.JS 3D visualization
│   │   ├── Container3DScene.jsx    # Three.js scene setup
│   │   ├── CargoBlock.jsx          # Individual cargo piece in 3D
│   │   ├── LoadSequence.jsx        # Step-by-step loading order
│   │   └── SavingsReport.jsx       # Cost savings breakdown
│   ├── replan/
│   │   ├── ReplanPage.jsx          # Deviation + replan flow
│   │   ├── DeviationInput.jsx      # Edit shipment dimensions
│   │   ├── BeforeAfterView.jsx     # Side-by-side comparison
│   │   └── ReplanTimeline.jsx      # Shows replan speed
│   └── tablet/
│       ├── TabletView.jsx          # Floor worker tablet UI
│       ├── StepByStepLoader.jsx    # Sequential loading instructions
│       └── TabletHeader.jsx        # Simplified header for tablet
└── utils/
    ├── formatters.js          # Currency, weight, dimension formatting
    └── containerSpecs.js      # Container dimension constants
```

---

## 4. MOCK DATA SPECIFICATION

### Container Types (mockContainers.js)
```js
export const containerTypes = {
  '20ft': {
    name: '20\' Standard',
    internal: { length: 5.898, width: 2.352, height: 2.393 }, // meters
    maxWeight: 28180, // kg (payload)
    volume: 33.2, // m³
    teu: 1
  },
  '40ft': {
    name: '40\' Standard',
    internal: { length: 12.032, width: 2.352, height: 2.393 },
    maxWeight: 26680,
    volume: 67.7,
    teu: 2
  },
  '40ftHC': {
    name: '40\' High Cube',
    internal: { length: 12.032, width: 2.352, height: 2.698 },
    maxWeight: 26460,
    volume: 76.3,
    teu: 2
  }
};
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

### Shipments (mockShipments.js)
25 shipments. Each shipment object:
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
        // ...
      ]
    },
    {
      id: 'CTR-002',
      type: '40ft',
      utilization: 91.8,
      // ...
    },
    {
      id: 'CTR-003',
      type: '20ft',
      utilization: 88.5,
      // ...
    }
  ],
  
  // Before optimization (what Dave would have done)
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
    co2Reduced: 2.4        // tonnes (nice-to-have metric)
  }
}
```

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
    status: 'Replanned without additional container — $2,200 overflow charge avoided'
  }
}
```

---

## 5. SCREEN-BY-SCREEN SPECIFICATIONS

### 5.0 Layout Shell

**Sidebar (always visible, left, 240px collapsed to 64px):**
- FreightWare logo (icon: container/box with signal waves)
- Nav items with icons:
  - Dashboard (LayoutDashboard icon)
  - Shipments (Package icon)
  - Optimizer (Zap icon)
  - Load Plan (Container/Box icon)  
  - Replan (RefreshCw icon)
  - Tablet View (Tablet icon) — opens in separate "mode"
- Bottom: Settings gear, "FreightWare v0.1-alpha" text

**Header (top bar):**
- Left: Current page title + breadcrumb
- Center: Search bar (non-functional, placeholder)
- Right: Quantum toggle switch, notification bell (shows 3 badge), user avatar "PCL Ops" (Pacific Coast Logistics)

---

### 5.1 Dashboard (route: `/`)

The landing screen. Dense but scannable. Shows the operator's current state at a glance.

**Top row — 4 KPI cards:**
1. **Active Shipments:** 25 (with small sparkline of last 7 days)
2. **Containers Planned:** 3 of 5 available (circular progress)
3. **Avg Utilization:** 91.5% (green, with arrow up from 72.3% baseline)
4. **Weekly Savings:** $5,400 CAD (green, with "2 containers saved" subtitle)

**Middle row — 2 panels side by side:**

Left panel — **Utilization Trend Chart** (Recharts AreaChart):
- X-axis: Last 4 weeks (mock data)
- Y-axis: Utilization %
- Two lines: "Before FreightWare" (dashed, ~72-78%) and "With FreightWare" (~89-95%)
- Caption: "Rolling 4-week container utilization — Vancouver export operations"

Right panel — **AI Insights** (purple-accented card):
- Header: "AI Recommendations" with AI badge
- 3-4 bullet items with icons:
  - ⚠️ "SHP-0003 dimensions likely understated — recommend dock verification before loading" 
  - 💡 "CLT-002 and CLT-006 shipments share destination (Shanghai) — consolidation opportunity"
  - 📊 "Historical pattern: Friday bookings from Pacific Timber typically +15% volume vs manifest"
  - 🔄 "2 shipments flagged for data cleaning — review before optimization run"
- Each item clickable (navigates to relevant shipment)

**Bottom row — Shipments Requiring Attention (mini table):**
- Shows only the ~8 flagged shipments
- Columns: ID, Client, Issue, AI Suggestion, Action button
- Color-coded rows: amber for warnings, red for errors
- "View All Shipments →" link

---

### 5.2 Shipments Page (route: `/shipments`)

Full shipment management view. This is where the "messy CSV → clean data" story is told.

**Top bar:**
- "Import CSV" button (opens ImportCSVModal)
- Filter dropdowns: Client, Status, Priority, Destination
- Search box
- Toggle: "Show AI flags only" (filters to flagged items)

**CSV Import Flow (ImportCSVModal):**
1. User clicks "Import CSV"
2. Modal shows drag-drop area (simulate — clicking anywhere triggers)
3. Brief animation: "Processing pacific_coast_shipments_raw.csv..."
4. **AI Cleaning Summary Panel** appears:
   - "FreightWare AI analyzed 25 records"
   - "8 issues detected, 3 auto-corrected, 5 need review"
   - Show each issue with before → after:
     - `"Pacifc Timbr Co" → "Pacific Timber Co."` (auto-corrected ✓)
     - `Weight: "" → "~680kg (estimated from commodity: cedar lumber)"` (needs confirmation)
     - `Dimensions: 48" x 40" x 60" → 1.22m x 1.02m x 1.52m` (unit conversion, auto-corrected ✓)
   - "Accept All Corrections" button + "Review Individually" button
5. Accepting loads the data into the shipment table

**Shipment Table:**
- Columns: Status indicator (dot), Shipment ID, Client, Description, Pieces, Dimensions (L×W×H), Weight, Volume, Priority, Destination, Sailing Date, Actions
- Status dots: 🟢 clean, 🟡 AI-corrected, 🔴 needs review, 🔵 loaded
- Sortable by any column
- Row click → ShipmentDetailModal

**Shipment Detail Modal:**
- Full details of selected shipment
- If AI flags exist, show them prominently in an amber box
- Edit button (simulates manual correction)
- "Mark as Verified" button
- History log: "Imported from CSV → AI cleaned → Verified by operator"

---

### 5.3 Optimizer Page (route: `/optimizer`)

Where the operator configures and runs the optimization. This is where "AI + future quantum" is showcased.

**Left panel — Configuration:**
- **Container Selection:**
  - Available containers checklist with type and specs
  - "Add Container" button (from pool)
  
- **Constraints Panel:**
  - Weight limit per container: ON (slider to adjust)
  - HAZMAT isolation: ON (toggle) — "HAZMAT shipments isolated per IMDG code"
  - Temperature compatibility: ON (toggle) — "Frozen cargo grouped"
  - Stackability rules: ON (toggle)
  - Client priority weighting: slider (1-10 for each priority level)
  - Sailing date grouping: ON (toggle)
  - Custom note: text field

- **Optimization Mode:**
  - Radio buttons:
    - ● **Classical (OR-Tools)** — "Constraint programming, exact solver" — ACTIVE
    - ○ **Quantum-Enhanced (D-Wave)** — "Hybrid quantum annealing" — GREYED OUT with "Coming 2027" badge
  - Below quantum option: small text "Quantum acceleration benefits loads >50 shipments across >8 containers"

**Right panel — Run area:**
- Big "Run Optimization" button (cyan, prominent)
- Clicking triggers **OptimizationProgress** animation:
  1. "Validating shipment data..." (0.5s) — checkmark
  2. "Building constraint model..." (1s) — shows constraint count
  3. "Solving with OR-Tools CP-SAT..." (2s) — animated progress bar with percentage
  4. "Solution found — Optimal" (0.5s) — green checkmark burst
  5. Total: "Solved in 2.4 seconds"
- This animation is the moment the operator sees value. Make it feel substantial but fast.

**Post-solve — Results Summary (replaces right panel):**
- **Before vs After comparison:**
  - Containers: 5 → 3 (with truck icons)
  - Utilization: 72.3% → 91.5%
  - Cost: $13,500 → $8,100
  - Savings: $5,400 / 2 containers / 2.4 tonnes CO₂
- "View Load Plan →" button (navigates to /loadplan)
- "Export Report (PDF)" button (non-functional, shows toast "Coming soon")

---

### 5.4 Load Plan Page (route: `/loadplan`)

The core visual output. Shows how cargo is packed into each container.

**Top section — Container selector tabs:**
- Tab per container: "CTR-001 (40' HC) — 94.2%" | "CTR-002 (40') — 91.8%" | "CTR-003 (20') — 88.5%"
- Active tab highlighted in cyan
- Each tab shows utilization as a small progress bar

**Main area — split view:**

**Left (60%) — 3D Container Visualization:**
This is the hero feature. Uses Three.js via @react-three/fiber.

- Container shown as wireframe box (cyan edges on dark background)
- Cargo pieces shown as solid colored blocks inside the container
- Each cargo block colored by client (consistent color per client across the app)
- Hovering a cargo block: tooltip with shipment ID, client, dimensions, weight
- Clicking a cargo block: highlights it, shows details in right panel
- Camera controls: orbit (drag), zoom (scroll), pan (right-drag)
- Preset camera angles: buttons for "Front", "Top", "Side", "Iso" views
- Loading animation: cargo blocks "fly in" one by one in load sequence order (Framer Motion)

**3D Implementation Notes:**
- Container wireframe: use Three.js EdgesGeometry on a BoxGeometry
- Cargo blocks: BoxGeometry with MeshStandardMaterial, slight transparency (opacity 0.85)
- Use soft ambient light + one directional light for depth
- Grid floor inside container for spatial reference
- Show dimension labels on container edges (TextGeometry or HTML overlay via drei's Html)
- Color coding per client (use a consistent palette of 8 distinguishable colors)

**Right (40%) — Load Details Panel:**

- **Container Summary:**
  - Type, dimensions, weight capacity
  - Volume utilization: progress bar (94.2%)
  - Weight utilization: progress bar (87.5%)
  - Shipment count in this container

- **Shipment List (in this container):**
  - Ordered by load sequence
  - Each row: load order #, shipment ID, client color dot, description, volume, weight
  - Hover highlights the corresponding 3D block
  - Click scrolls to detail

- **Load Sequence Toggle:**
  - "Show Loading Order" button
  - When active: 3D view animates through load sequence step by step
  - Each step: cargo block appears at its position with a brief animation
  - Floor worker instruction text appears: "Step 1: Place SHP-0007 (Heavy Equipment) against rear wall, floor level"

---

### 5.5 Replan Page (route: `/replan`)

The differentiator demo. Shows what happens when cargo arrives different from manifest.

**Initial state — "Scan Received" alert:**
- Top banner (amber): "⚠️ Dock Scanner Alert: SHP-2026-0003 (Cascade Electronics) — dimensions differ from manifest"
- Shows the deviation:
  - Manifest: 0.8m × 0.6m × 1.0m per piece × 6 pieces
  - Actual scan: 0.9m × 0.7m × 1.2m per piece × 6 pieces
  - Volume increase: +2.16 m³ (+45%)
  - Reason: "Re-wrapped with additional protective packaging"

**Middle — Impact Assessment (auto-generated):**
- "This deviation affects Container CTR-001"
- "Current plan cannot accommodate increased volume"
- Risk: "Without replanning: overflow to 4th container at $2,200 CAD"

**Action area:**
- Big button: "Replan Now" (cyan, pulsing gently)
- Clicking triggers replan animation:
  1. "Analyzing deviation impact..." (0.3s)
  2. "Warm-starting from current solution..." (0.3s)
  3. "Replanning with updated constraints..." (0.5s)
  4. "New plan found — 0.8 seconds" (green flash)

**Post-replan — Before/After Split View:**
- Left: "Original Plan" — 3D view of CTR-001 before
- Right: "Replanned" — 3D view of CTR-001 after, with changes highlighted (amber glow on moved pieces)
- Change log:
  - "Moved SHP-0012 from CTR-001 → CTR-002"
  - "Resequenced loading order for CTR-001"
  - "No additional container needed"
- Savings callout: "Overflow charge avoided: $2,200 CAD"
- Replan time callout: "Replanned in 0.8 seconds" (big, prominent — this IS the demo moment)

---

### 5.6 Tablet View (route: `/tablet`)

Separate UI mode — simulates what a floor worker would see on a warehouse tablet.

**Design:**
- Light mode (reversed — warehouse lighting makes dark screens hard to read)
- LARGE text (min 18px body, 32px headings)
- BIG touch targets (min 48px buttons)
- No sidebar — full screen
- Top: "FreightWare Floor Assistant" + container selector
- Simple, sequential

**Flow:**
1. Select container from dropdown (CTR-001, CTR-002, CTR-003)
2. Shows step-by-step loading instructions:
   - Large card per step:
     - Step number (huge: "STEP 1 of 8")
     - Shipment ID + Client name
     - "Place at: REAR WALL, FLOOR LEVEL"
     - Dimensions shown large: "1.2m × 1.0m × 1.5m"
     - Weight: "2,800 kg — USE FORKLIFT"
     - Special instructions: "⚠️ FRAGILE — Do not stack above"
     - Simple 2D diagram showing placement position in container (top-down view with highlighted zone)
   - "Mark Complete" button → advances to next step
   - "Flag Issue" button → shows options: "Wrong dimensions", "Damaged", "Missing", "Other"
3. When all steps complete: "Container CTR-001 Loading Complete ✓" with utilization summary

**Exit:** "Back to Planning" link in top-right → returns to normal UI

---

## 6. INTERACTIONS & ANIMATIONS

### Page Transitions
- Use Framer Motion for route transitions
- Fade + slight slide (16px) for page changes
- Duration: 200ms

### Data Loading Simulations
- When navigating to any page, show a brief skeleton loading state (200ms) to simulate real app feel
- Optimization progress: use staged setTimeout callbacks to simulate solve steps

### 3D Container Interactions
- Orbit controls: smooth damping (dampingFactor 0.1)
- Cargo hover: scale up 1.02x, increase brightness
- Cargo click: outline effect (THREE.OutlinePass or simple border trick)
- Load sequence animation: each block fades in and slides to position over 500ms

### Toasts
- Success: green left-border
- Warning: amber left-border  
- Error: red left-border
- Auto-dismiss after 4 seconds
- Stack from bottom-right

### Replan Animation
The replan sequence should feel dramatic but fast:
1. Current 3D view "shatters" (cargo blocks briefly scatter with physics-like motion)
2. Quick flash (100ms)
3. New arrangement assembles (blocks fly to new positions)
4. Changed blocks pulse amber 3 times
5. Timer counts up in real-time: "0.0s → 0.8s"
Total animation: ~2 seconds

---

## 7. RESPONSIVE BEHAVIOR

- **Desktop (>1280px):** Full sidebar + all panels visible
- **Tablet (768-1280px):** Collapsed sidebar (icons only), 3D view stacks above details
- **Tablet View route:** Always full-width, optimized for 10" tablet in landscape

The prototype primarily targets desktop demo scenarios (laptop + projector in a CFS office), but tablet view should work on actual tablets.

---

## 8. BUILD SEQUENCE FOR CURSOR

Build in this exact order. Each step should be completeable and testable before moving to the next.

### Phase 1: Foundation
1. Project setup (Vite + React + all dependencies)
2. Tailwind config with custom theme
3. Layout shell (Sidebar, Header, Layout)
4. Router setup with all routes (empty pages)
5. All mock data files

### Phase 2: Core Pages
6. Dashboard page with KPI cards (use mock data)
7. Shipments page with data table
8. CSV Import modal with AI cleaning simulation
9. Shipment detail modal

### Phase 3: Optimization
10. Optimizer page — configuration panel
11. Optimization progress animation
12. Results summary view

### Phase 4: 3D Visualization (the hard part)
13. Basic Three.js container wireframe
14. Cargo blocks with positioning
15. Camera controls + preset angles
16. Hover/click interactions
17. Load sequence animation

### Phase 5: Replan
18. Replan page — deviation display
19. Replan animation sequence
20. Before/after split view with 3D

### Phase 6: Tablet & Polish
21. Tablet view — full screen, step-by-step
22. AI insights panel on dashboard
23. Quantum toggle in header
24. Final polish: animations, transitions, edge cases

---

## 9. CRITICAL DEMO MOMENTS

When building, prioritize these moments — they are what sells the product:

1. **CSV Import → AI Cleaning:** The moment messy data becomes clean data with AI explanations. The operator sees that the tool understands their world.

2. **Optimization Run → 2.4 seconds:** The animated solve that shows constraint programming working. The contrast: "Dave spends 3 hours in Excel. FreightWare: 2.4 seconds."

3. **3D Container View:** The visual that no competitor has in this market. The operator can see exactly how their container is packed, rotate it, understand why each piece is where it is.

4. **Replan in 0.8 seconds:** THE demo moment. Cargo arrived different? Click one button. New plan in under a second. No overflow container. $2,200 saved. This is the product insight — replanning speed when cargo ≠ manifest.

5. **Tablet Floor View:** Shows this isn't just planning software — it reaches the warehouse floor. The floor worker doesn't need to think. Step 1, Step 2, Step 3. Done.

---

## 10. NOTES FOR CURSOR

- This is a prototype. Do NOT over-engineer. No state management library (useState + context is fine). No API layer. No auth.
- All data comes from the mock files. Import directly.
- The 3D visualization is the most complex component. If Cursor struggles, start with a simpler 2D SVG representation and iterate to 3D.
- Keep all components in single files where possible. No premature abstraction.
- Use Tailwind classes directly. No CSS modules or styled-components.
- The optimization "run" is just a series of setTimeout callbacks that reveal pre-computed results. There is no actual solver running.
- For the replan, the "before" and "after" are two different pre-computed states in the mock data.
- Import Google Fonts via CDN link in index.html, not via npm.
