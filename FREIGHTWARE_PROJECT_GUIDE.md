# FreightWare — Complete Project Guide

> **Purpose**: This document captures the full context of the FreightWare prototype so development can continue on any machine without losing context from prior conversations.
>
> **Last updated**: March 25, 2026
> **Status**: Clickable SaaS prototype — all features functional, zero build errors

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started](#3-getting-started)
4. [Architecture](#4-architecture)
5. [File Structure](#5-file-structure)
6. [Routes & Pages](#6-routes--pages)
7. [Core Features — Detailed](#7-core-features--detailed)
8. [Data Model & Mock Data](#8-data-model--mock-data)
9. [Shared Components Library](#9-shared-components-library)
10. [State Management](#10-state-management)
11. [Design System](#11-design-system)
12. [Demo Script — Happy Path](#12-demo-script--happy-path)
13. [Known Issues & Workarounds](#13-known-issues--workarounds)
14. [Bugs Fixed During Development](#14-bugs-fixed-during-development)
15. [MVP Roadmap — What to Build Next](#15-mvp-roadmap--what-to-build-next)
16. [Coding Standards](#16-coding-standards)

---

## 1. Project Overview

**FreightWare** is an AI-powered LCL (Less-than-Container Load) container load planning platform for freight consolidators and CFS operators. The prototype demonstrates the full workflow:

1. **Import & AI Clean** shipment data (CSV with AI anomaly detection)
2. **Optimize** container assignments using a constraint solver (simulated OR-Tools CP-SAT)
3. **Visualize** in 3D — interactive container load plans
4. **Drag-and-Drop Edit** — manually adjust assignments with real-time validation
5. **AI Suggest Plan** — one-click re-optimization with animated 6-phase solver
6. **Replan** in real-time when dock scanner detects deviations
7. **Report** on cost savings, utilization, and cargo analytics
8. **Tablet View** — warehouse worker loading instructions

**Target users**: LCL consolidators, CFS operators, freight forwarders managing 5-50 containers/week.

**Key value proposition**: Reduces containers needed by 40% (from 5 to 3 in demo), saves $5,400/week, replaces 3+ hours of manual planning with a 2.4-second optimization.

---

## 2. Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Next.js (App Router) | 16.2.1 | Turbopack for dev |
| React | React | 19.2.4 | Latest with Server Components |
| Styling | Tailwind CSS | 4.2.2 | CSS-based `@theme` config, NOT v3 JS config |
| 3D | Three.js + React Three Fiber + Drei | 0.183 / 9.5 / 10.7 | Container visualization |
| Charts | Recharts | 3.8.0 | All 5 reports + dashboard chart |
| Animation | Framer Motion | 12.38.0 | Page transitions, loaders, guided tour |
| DnD | @dnd-kit/core + sortable + utilities | 6.3.1 / 10.0 / 3.2 | Load plan drag-and-drop editor |
| Icons | Lucide React | 1.6.0 | Consistent icon set |
| Fonts | Google Fonts (Inter + JetBrains Mono) | — | `<link>` in root layout |

**No backend** — all data is mock. No database, no API calls. Designed to be converted to real APIs during MVP phase.

---

## 3. Getting Started

```bash
# Clone
git clone https://github.com/ranjansoni/FreightWare.git
cd FreightWare/freightware

# Install
npm install

# Dev server
npm run dev        # → http://localhost:3000

# Production build
npm run build
npm start
```

**Prerequisites**: Node.js 18+, npm 9+

---

## 4. Architecture

### App Router Structure

```
src/app/
├── layout.jsx              # Root layout (fonts, providers, metadata)
├── globals.css             # Tailwind imports + @theme tokens + keyframes
├── (main)/                 # Route group — main app with sidebar/header
│   ├── layout.jsx          # AppShell + ChatBot + GuidedTour
│   ├── page.jsx            # Dashboard (/)
│   ├── shipments/page.jsx  # Shipment management
│   ├── optimizer/page.jsx  # Constraint config + run optimization
│   ├── loadplan/page.jsx   # 3D view + drag-and-drop editor
│   ├── replan/page.jsx     # Real-time replanning
│   ├── reports/page.jsx    # 5 analytical reports
│   └── settings/page.jsx   # 7-tab settings page
└── tablet/                 # Separate route — NO sidebar/header
    ├── layout.jsx          # Light-mode standalone layout
    └── page.jsx            # Warehouse worker tablet view
```

### Why Route Groups?

The `(main)` route group exists so `/tablet` can have a completely different layout (light mode, no sidebar, touch-optimized) while sharing the same root layout providers. This was a deliberate architectural decision.

### Data Flow

```
Mock Data Files (src/data/)
    ↓
AppContext (global state)
    ↓
Page Components (smart, manage local state)
    ↓
Feature Components (receive props, render UI)
    ↓
Shared Components (reusable, style-only)
```

### Client vs Server Components

- **All page components** are `'use client'` because they use hooks, animations, or browser APIs
- **Shared components** without interactivity (Badge, ProgressBar) are server components
- **Root layout** is a server component
- **`(main)/layout.jsx`** is a client component (needs `useApp` for guided tour)

---

## 5. File Structure

### Pages (10 routes)

| Route | File | Description |
|-------|------|-------------|
| `/` | `(main)/page.jsx` | Dashboard with KPIs, chart, AI insights |
| `/shipments` | `(main)/shipments/page.jsx` | Data table + CSV import modal |
| `/optimizer` | `(main)/optimizer/page.jsx` | Constraint panel + run optimization |
| `/loadplan` | `(main)/loadplan/page.jsx` | 3D view + drag-and-drop editor |
| `/replan` | `(main)/replan/page.jsx` | Deviation alert + before/after |
| `/reports` | `(main)/reports/page.jsx` | 5 scrollable report cards |
| `/settings` | `(main)/settings/page.jsx` | 7-tab settings page |
| `/tablet` | `tablet/page.jsx` | Warehouse worker loading view |

### Components (by domain)

```
src/components/
├── dashboard/           # KPIRow, UtilizationChart, AIInsightsPanel, etc.
├── shipments/           # ShipmentTable, ImportCSVModal, ShipmentDetailModal
├── optimizer/           # ConstraintPanel, OptimizationProgress, ResultsSummary
├── loadplan/            # Container3DScene, CargoBlock, ContainerTabs,
│                        # LoadDetailsPanel, DraggableShipmentCard,
│                        # ContainerColumn, UnassignedPool, DragOverlayCard,
│                        # ConstraintFeedback, SuggestPlanOverlay,
│                        # ContainerSummaryTable
├── replan/              # DeviationAlert, ImpactAssessment, BeforeAfterView,
│                        # ReplanAnimation
├── reports/             # CostWaterfall, ClientTreemap, CargoDensity,
│                        # ContainerBreakdown, DestinationMix
├── settings/            # CompanyProfile, UserManagement, ContainerYard,
│                        # Integrations, NotificationPrefs, BillingPlan,
│                        # AppearanceSettings
├── layout/              # AppShell, Header, Sidebar, SavingsTicker
├── loaders/             # HarborScene, ContainerScan, TetrisPack, CraneLoad,
│                        # ShipReroute, ForkliftScene, ChartPrint
└── shared/              # Button, Card, Badge, Modal, ProgressBar, MetricCard,
                         # DataTable, Toggle, HelpIcon, ChatBot, GuidedTour,
                         # PageLoader, PageTransition, Skeleton, ReportCard,
                         # ChartTooltip, ToastProvider
```

### Data Files

| File | Content |
|------|---------|
| `mockShipments.js` | 28 shipments (25 assigned + 3 unassigned/pending) |
| `mockOptimizationResult.js` | 3 containers, baseline vs optimized stats |
| `mockReplanScenario.js` | Dock scan deviation + replan result |
| `mockContainers.js` | 5-container yard (two 40ftHC, two 40ft, one 20ft) |
| `mockClients.js` | 8 clients with contact details |
| `mockNotifications.js` | 3 notification items for the bell dropdown |
| `mockSettings.js` | Company profile, team, billing, integrations, appearance |
| `chatResponses.js` | ~30 Q/A pairs + per-page suggested prompts |
| `loaderContent.js` | Industry facts, quotes, per-page loader config |
| `tourSteps.js` | 16 guided tour steps across all routes |

### Utilities

| File | Purpose |
|------|---------|
| `mockBinPacker.js` | Shelf-based greedy 3D bin packing algorithm |
| `containerSpecs.js` | Container type dimensions (20ft, 40ft, 40ftHC) |
| `clientColors.js` | Color map per client ID for 3D blocks |
| `loadPlanValidation.js` | 6 constraint validation rules for drag-and-drop |
| `suggestOptimalPlan.js` | Greedy multi-pass solver (HAZMAT → temp → dest → weight/vol) |
| `reportUtils.js` | Data aggregation functions for report charts |
| `formatters.js` | Number/currency/date formatting helpers |
| `usePageTitle.js` | Custom hook for setting document.title |

### Custom Hooks

| File | Purpose |
|------|---------|
| `hooks/useLoadPlanEditor.js` | Drag-and-drop editor state, undo/redo, re-packing, applyPlan |

---

## 6. Routes & Pages

### Dashboard (`/`)

- 4 KPI cards: Active Shipments (25), Containers Planned (3/5), Avg Utilization (91.5%), Weekly Savings ($5,400)
- Utilization trend chart (Recharts area chart, before vs after over 4 weeks)
- AI Recommendations panel (3 insights with severity badges)
- Active shipments widget (flagged shipments with quick links)
- "Demo Flow" hint card showing the recommended navigation path

### Shipments (`/shipments`)

- Full data table with 25+ shipments, sortable/filterable
- Status color legend (green=confirmed, amber=auto-corrected, red=flagged)
- "Import CSV" button opens modal with AI data cleaning simulation
- AI cleaning detects: missing weight, dimension mismatch, client name typos, duplicate bookings, unit inconsistencies, missing HAZMAT codes
- Click any row for detail modal

### Optimizer (`/optimizer`)

- Left panel: 10 constraint toggles (weight, volume, HAZMAT, temperature, stacking, fragile, client priority, sailing date, route grouping)
- Mode selector: Standard / Quantum-Enhanced (with explanation)
- Container selection with checkboxes
- "Run Optimization" button triggers 4.5-second simulated solve
- Progress animation with solver metrics
- Results summary: before/after comparison, savings breakdown

### Load Plan (`/loadplan`) — THE KILLER FEATURE

**View Mode** (default):
- Container tabs showing all 3 assigned containers with utilization bars
- Interactive 3D scene (rotate, zoom, pan, click blocks)
- Camera presets: Iso, Front, Top, Side
- Load details panel with shipment list and loading sequence
- Play button to animate loading sequence step-by-step
- "Simulate Deviation" link to replan page

**Edit Mode** (toggle "Edit Plan"):
- Unassigned shipment pool at top (3 new bookings: HAZMAT methanol, frozen salmon, oversized generator)
- Three container columns side-by-side with capacity bars (weight + volume)
- Drag shipment cards between containers or to/from unassigned pool
- Real-time constraint validation during drag:
  - **Green glow** = safe to drop
  - **Amber glow** = allowed with warnings (route mismatch, fragile risk)
  - **Red glow** = blocked (HAZMAT conflict, weight/volume overload)
- 3D preview syncs automatically on the right
- Undo / Redo (20-step history)
- Reset to optimized state
- Filter unassigned by destination, HAZMAT, temperature
- **Suggest Plan** button runs a multi-pass greedy solver with a theatrical 6-phase animated overlay:
  1. Analyzing cargo weights
  2. Grouping by destination
  3. Segregating hazardous materials
  4. Optimizing temperature compatibility
  5. Maximizing space utilization
  6. Final safety & compliance check
  - Shows real computed stats (reassigned count, avg utilization, overflow)
  - Apply or Dismiss the suggested plan (Apply pushes to undo history)
- **Container Summary Table** below the DnD editor:
  - Columns: Container ID, Type, Shipments, Weight, Volume, Vol %, Wt %, Destinations, Flags (HAZ/TEMP/FRAG badges), Status (error/warning/green)
  - Footer row with totals and unassigned count
  - **Export CSV** button generates a downloadable `.csv` file
  - Reactively updates on drag-and-drop or after applying a suggested plan

**Validation Rules** (in `loadPlanValidation.js`):
1. Weight limit — cannot exceed container maxWeight
2. Volume limit — cannot exceed container capacity
3. HAZMAT segregation — max 1 HAZMAT shipment per container (IMDG)
4. Temperature conflict — temp-controlled cargo warns with ambient
5. Fragile risk — fragile in heavily-loaded containers
6. Route mismatch — mixing different destinations

### Replan (`/replan`)

- Dock scanner deviation alert (SHP-0003 actual dimensions differ from manifest)
- Impact assessment panel showing affected containers
- "Trigger Replan" button starts 0.8-second warm-start re-optimization
- Before/after comparison with animated transitions
- Shows exactly which cargo moved and why

### Reports (`/reports`)

5 scroll-triggered animated report cards:

1. **Cost Savings Waterfall** — Stacked bar showing cost reduction steps ($13,500 → $5,420)
2. **Client Volume Treemap** — Proportional rectangles by client volume
3. **Cargo Density Bubble Chart** — Weight vs volume scatter with 250 kg/m³ density line
4. **Container Composition Stacked Bars** — Per-container breakdown by client
5. **Destination & Cargo Mix Doughnut** — Route distribution pie chart

Jump-nav at top for quick scroll-to-section.

### Settings (`/settings`)

7 vertical tabs:

1. **Company Profile** — Name, logo upload zone, industry, port, address, tax ID
2. **User Management** — Team table (4 members), role dropdowns, invite form, permissions card
3. **Container Yard** — Editable fleet table (5 containers), optimization defaults (max containers, target utilization)
4. **Integrations** — 4 cards: CargoWise TMS, SAP ERP, Dock Scanner IoT, Email SMTP
5. **Notifications** — Toggle rows for 5 alert types, Slack webhook, utilization threshold slider
6. **Billing & Plan** — Current plan card (Professional), 3-tier comparison, usage progress bar
7. **Appearance** — Theme (Dark/Light/System), density, language, date format, currency

All fields are editable. Save buttons toast "Settings saved" — no real persistence.

### Tablet (`/tablet`)

- Light-mode standalone view (no sidebar/header)
- Large touch targets for warehouse workers
- Loading sequence with step-by-step instructions
- Container selection
- Separate loader animation (forklift theme)

---

## 7. Core Features — Detailed

### Immersive Page Loaders

Every page has a themed SVG-animated loader with industry facts/quotes:

| Page | Theme | Animation | Duration |
|------|-------|-----------|----------|
| Dashboard | Harbor scene | Ship docking at port | 3000ms |
| Shipments | Container scan | Scanning beam over container | 2000ms |
| Optimizer | Tetris pack | Cargo blocks falling into place | 2000ms |
| Load Plan | Crane load | Crane lifting container | 2000ms |
| Replan | Ship reroute | Ship changing course | 2000ms |
| Reports | Chart print | Charts drawing themselves | 2000ms |
| Tablet | Forklift | Forklift moving pallets | 2000ms |

Facts are randomly selected client-side (via `useEffect`, not `useMemo`) to avoid hydration mismatches.

### AI Chatbot

- Floating button in bottom-right corner on all main routes
- ~30 pre-scripted Q/A pairs covering all features
- Per-page suggested prompts (4 per page)
- Keyword matching against trigger arrays
- Fallback response for unrecognized queries
- Minimizable panel with chat-like UI

### Guided Tour

- 16-step interactive tour across all routes
- Spotlight effect on target elements via `data-tour` attributes
- Step navigation with progress indicator
- Auto-routes to the correct page for each step
- First-time users see it automatically (persisted via `localStorage` key `fw-tour-seen`)
- Re-triggerable from the `?` help icon in the header

### Cumulative Savings Ticker

- Animated counter in the header showing: Hours Saved (14.2h), Cost Saved ($5,400), Space Saved (2 containers)
- Uses Framer Motion for counting animation on mount

### HelpIcon System

- Reusable `?` circle component appearing throughout the app
- Click to show contextual help popover
- Uses `<span>` root (not `<div>`) to be valid inside `<p>` tags
- Positioned with `position` prop: top, bottom, left, right, bottom-right, etc.

---

## 8. Data Model & Mock Data

### Shipment Shape

```javascript
{
  id: 'SHP-2026-0001',           // Unique ID
  clientId: 'CLT-001',           // Links to mockClients
  clientName: 'Pacific Timber Co.',
  description: 'Kiln-dried cedar planks, bundled',
  pieces: 4,                     // Number of identical pieces
  manifestDimensions: { length: 1.2, width: 1.0, height: 1.5 }, // Meters
  actualDimensions: null,        // Filled by dock scanner
  weight: 2800,                  // Total weight in kg
  weightPerPiece: 700,           // Weight per piece in kg
  volume: 7.2,                   // Total volume in m³
  priority: 'standard',          // standard | high | critical | low
  deliveryWindow: '2026-03-28',
  destination: 'Shanghai',       // Shanghai | Tokyo | Busan
  bookingRef: 'BK-PCL-44921',
  status: 'confirmed',           // confirmed | flagged | auto-corrected | pending
  hazmat: false,                 // IMDG dangerous goods flag
  stackable: true,
  fragile: false,
  tempRange: null,               // { min: -18, max: -15 } for temp-controlled
  notes: '',
  aiFlags: [],                   // ['missing_weight', 'dimension_mismatch', etc.]
  aiSuggestions: [],              // Human-readable AI recommendations
  cleaningStatus: 'clean',       // clean | needs-review | auto-corrected
}
```

### Container Types

| Type | Internal L×W×H (m) | Max Weight (kg) | Volume (m³) | TEU |
|------|-------------------|-----------------|-------------|-----|
| 20ft | 5.898 × 2.352 × 2.393 | 28,180 | 33.2 | 1 |
| 40ft | 12.032 × 2.352 × 2.393 | 26,680 | 67.7 | 2 |
| 40ftHC | 12.032 × 2.352 × 2.698 | 26,460 | 76.3 | 2 |

### Optimization Result Shape

```javascript
{
  runId: 'OPT-20260324-001',
  solver: 'OR-Tools CP-SAT',
  solveTime: 2.4,              // seconds
  status: 'optimal',
  containersUsed: [
    {
      id: 'CTR-001',
      type: '40ftHC',
      utilization: 94.2,       // volume %
      weightUtilization: 87.5, // weight %
      totalWeight: 23153,
      totalVolume: 71.9,
      shipments: ['SHP-2026-0001', ...], // IDs assigned to this container
    },
    // ... CTR-002 (40ft), CTR-003 (20ft)
  ],
  baseline: { containersNeeded: 5, avgUtilization: 72.3, estimatedCost: 13500 },
  optimized: { containersNeeded: 3, avgUtilization: 91.5, estimatedCost: 8100 },
  savings: { containersReduced: 2, costSaved: 5400, utilizationGain: 19.2, co2Reduced: 2.4 },
}
```

### Container Assignments (Drag-and-Drop)

- **CTR-001 (40ftHC)**: SHP-0001, 0003, 0004, 0006, 0007 (HAZMAT), 0012, 0016, 0022, 0024
- **CTR-002 (40ft)**: SHP-0002 (temp), 0009, 0011, 0013, 0018 (temp), 0023 (temp), 0025
- **CTR-003 (20ft)**: SHP-0005, 0008, 0010, 0014, 0015, 0017 (HAZMAT), 0019, 0020, 0021
- **Unassigned**: SHP-0026 (HAZMAT methanol), 0027 (frozen salmon), 0028 (oversized generator)

### Key Shipments for Demo Scenarios

| ID | Client | Special | Notes |
|----|--------|---------|-------|
| SHP-0007 | Harbour Chemicals | HAZMAT Class 3 | In CTR-001 |
| SHP-0017 | Harbour Chemicals | HAZMAT Class 3 | In CTR-003 — drag to CTR-001 to trigger HAZMAT error |
| SHP-0002 | BC Seafood | Temp (-18 to -15°C) | In CTR-002 |
| SHP-0003 | Cascade Electronics | Fragile | Flagged for dimension mismatch |
| SHP-0026 | Harbour Chemicals | HAZMAT (unassigned) | Late booking — demo "add new cargo" |
| SHP-0027 | BC Seafood | Temp + Critical (unassigned) | Last-minute premium client addition |
| SHP-0028 | West Coast Machinery | Oversized 8.5t (unassigned) | Heavy cargo — weight limit demo |

### Client Colors (for 3D blocks)

| Client ID | Color | Hex |
|-----------|-------|-----|
| CLT-001 (Pacific Timber) | Blue | #3B82F6 |
| CLT-002 (BC Seafood) | Cyan | #06B6D4 |
| CLT-003 (Cascade Electronics) | Purple | #8B5CF6 |
| CLT-004 (Fraser Valley Agriculture) | Amber | #F59E0B |
| CLT-005 (West Coast Machinery) | Red | #EF4444 |
| CLT-006 (Lotus Textiles) | Pink | #EC4899 |
| CLT-007 (Harbour Chemicals) | Orange | #F97316 |
| CLT-008 (Artisan Furniture) | Green | #10B981 |

---

## 9. Shared Components Library

These are reusable across the app and designed for MVP transition:

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `variant`, `size`, `disabled`, `children` | Primary/ghost/outline button styles |
| `Card` | `className`, `children`, `...props` | Dark surface card with border |
| `Badge` | `variant`, `size`, `children` | Status badges (green/amber/red/cyan) |
| `Modal` | `isOpen`, `onClose`, `title`, `children` | Overlay modal with backdrop |
| `ProgressBar` | `value`, `max`, `color`, `label`, `showPercent`, `size` | Animated progress bar |
| `MetricCard` | `label`, `value`, `trend`, `trendLabel`, `icon` | KPI metric display |
| `DataTable` | `columns`, `data`, `onRowClick` | Sortable/filterable data table |
| `Toggle` | `enabled`, `onToggle`, `size` | Toggle switch (extracted from ConstraintPanel) |
| `HelpIcon` | `text`, `position` | Contextual help popover (uses `<span>` root) |
| `ChatBot` | — | Floating AI chatbot panel |
| `GuidedTour` | `active`, `onDismiss` | Interactive step-by-step tour |
| `PageLoader` | `theme`, `children` | Immersive themed loading screen |
| `PageTransition` | `children` | Fade+slide animation wrapper |
| `Skeleton` | `lines`, `className` | Loading skeleton placeholder |
| `ReportCard` | `id`, `title`, `helpText`, `children` | Scroll-animated report wrapper |
| `ChartTooltip` | `active`, `payload`, `label` | Styled Recharts tooltip |
| `ToastProvider` | wraps app | Toast notification system |

---

## 10. State Management

### Global State (AppContext)

```javascript
{
  // Data
  shipments: Shipment[],              // All 28 shipments
  optimizationResult: OptResult|null,  // Set after running optimizer
  replanResult: ReplanResult|null,     // Set after replanning
  replanScenario: ReplanScenario,      // Static mock data

  // UI State
  optimizationState: 'idle'|'running'|'complete',
  replanState: 'idle'|'deviation-received'|'replanning'|'complete',
  sidebarCollapsed: boolean,
  tourActive: boolean,

  // Actions
  runOptimization(),     // 4.5s simulated solve
  triggerReplan(),       // Sets deviation state
  executeReplan(),       // 2s simulated replan
  updateShipment(id, updates),
  importCSV(),           // Resets to initial data
  toggleSidebar(),
  startTour(),
  dismissTour(),
}
```

### Local State (per page)

- **Load Plan**: `editMode`, `activeContainer`, `highlightedShipment`, `selectedShipment`, `isPlaying`, `currentStep`, `activeDragId`, `overContainerId`, `suggestResult`, `showSuggestOverlay`
- **Load Plan Editor** (`useLoadPlanEditor` hook): `assignments`, `unassigned`, `containerStats`, `loadSequences`, `history` (undo/redo), `applyPlan()`
- **Settings**: `activeTab` (which settings section is shown)
- **Optimizer**: `constraints` (toggle states), `selectedContainers`

### LocalStorage Keys

| Key | Purpose |
|-----|---------|
| `fw-tour-seen` | `'1'` once tour is dismissed — prevents auto-show on repeat visits |

---

## 11. Design System

### Tailwind v4 Custom Tokens

Defined in `globals.css` via `@theme`:

```css
@theme {
  --color-fw-bg: #0B1120;
  --color-fw-surface: #111827;
  --color-fw-surface-2: #1E293B;
  --color-fw-border: #1E293B;
  --color-fw-text: #F1F5F9;
  --color-fw-text-dim: #94A3B8;
  --color-fw-text-muted: #64748B;
  --color-fw-cyan: #06B6D4;
  --color-fw-green: #10B981;
  --color-fw-amber: #F59E0B;
  --color-fw-red: #EF4444;
  --color-fw-purple: #8B5CF6;
  --font-display: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Usage Pattern

```jsx
<div className="bg-fw-surface border border-fw-border rounded-lg p-4">
  <h3 className="text-fw-text font-display">Title</h3>
  <p className="text-fw-text-dim">Subtitle</p>
  <span className="text-fw-cyan font-mono">CTR-001</span>
</div>
```

### Dark Theme

The entire app is dark by default. The `/tablet` route uses a separate light-mode color scheme (Tailwind standard colors like `bg-slate-50`, `text-slate-800`).

---

## 12. Demo Script — Happy Path

This is the recommended flow for presenting FreightWare to investors/clients:

### Step 1: Dashboard (/)
> "This is your operations command center. Notice the 91.5% average utilization — that's vs. 72% industry average. We're saving $5,400 this week by using 3 containers instead of 5."

### Step 2: Shipments (/shipments)
> "Here's where data comes in. Watch what happens when we import a CSV..."
> Click **Import CSV** → Show AI cleaning catching 6 data issues
> "The AI detected a dimension mismatch, missing weights, a likely duplicate, and even a units error — inches vs meters."

### Step 3: Optimizer (/optimizer)
> "Now we configure constraints — HAZMAT isolation, temperature compatibility, weight limits..."
> Click **Run Optimization** → Watch progress animation (4.5s)
> "Solved in 2.4 seconds. From 5 containers down to 3."
> Click **View Load Plan →**

### Step 4: Load Plan — View Mode (/loadplan)
> "Here's the 3D load plan. Each color is a different client."
> Click blocks, rotate view, show camera presets
> Click **Play** to animate loading sequence
> "This is exactly what the warehouse worker sees on their tablet."

### Step 5: Load Plan — Edit Mode
> Switch to **Edit Plan**
> "But what if you disagree? What if a last-minute booking comes in?"
> Drag SHP-0026 (HAZMAT methanol) into CTR-001 → **RED: HAZMAT segregation error**
> "The system knows CTR-001 already has flammable solvents. IMDG code says no."
> Drag SHP-0028 (8.5t generator) into CTR-003 (20ft) → **RED: Weight overload**
> Drag SHP-0027 (frozen salmon) into CTR-001 → **AMBER: Temperature conflict + route mismatch**
> "Every constraint is validated in real-time. The 3D preview updates automatically."
> Click **Undo** → "Full undo/redo history."

### Step 5b: Suggest Plan
> Click **Suggest Plan** → Watch the 6-phase animated optimization
> "The AI re-optimizes across all constraints: HAZMAT isolation, temperature grouping, destination clustering, space maximization."
> See the summary: reassigned count, utilization %, overflow
> Click **Apply Plan** → "The entire load plan updates — 3D preview, summary table, everything."
> Scroll down to the **Container Summary Table**
> "Every container at a glance — fill percentage, weight, flags, warnings. And you can export this as a CSV for your operations team."
> Click **Export CSV** → file downloads

### Step 6: Replan (/replan)
> "Now imagine dock day. The scanner measures SHP-0003 and finds it's larger than declared."
> Click **Trigger Replan** → Watch 0.8-second warm-start replan
> "Replanned in 0.8 seconds. The system moved just 2 blocks to accommodate the larger crate. Zero overflow charges."

### Step 7: Reports (/reports)
> Scroll through the 5 reports
> "Cost waterfall shows exactly where savings come from. The density chart reveals which clients ship heavy-but-compact vs. bulky-but-light cargo — and how we mix them optimally."

### Step 8: Tablet (/tablet)
> "And this is what the forklift driver sees on a ruggedized tablet. Step-by-step loading instructions. Large touch targets. No ambiguity."

---

## 13. Known Issues & Workarounds

### Recharts SSR Width/Height Warning
**Symptom**: `The width(-1) and height(-1) of chart should be greater than 0` during build
**Cause**: Recharts `ResponsiveContainer` can't determine dimensions during SSR
**Impact**: Cosmetic warning only — charts render correctly in browser
**Fix**: None needed — this is a known Recharts SSR issue

### PageLoader Hydration
**Cause**: `Math.random()` in `getRandomFact()` produces different values on server vs client
**Fix Applied**: Fact state initialized as `null`, populated via `useEffect` on client mount only. Uses `fact?.text` with optional chaining.

### HelpIcon HTML Nesting
**Cause**: `HelpIcon` renders a `<button>` — cannot be inside another `<button>` or `<p>`
**Fix Applied**: Root element changed to `<span>` with `inline-flex`. Internal elements use `<span>` with `block` display. Must be careful when placing inside interactive elements.

### UnassignedPool Button Nesting
**Cause**: `HelpIcon` was inside the expand/collapse `<button>`
**Fix Applied**: Restructured header — outer element is now a `<div>`, expand/collapse chevron has its own `<button>`

---

## 14. Bugs Fixed During Development

| # | Bug | Root Cause | Fix |
|---|-----|-----------|-----|
| 1 | `create-next-app` hanging on prompts | Interactive prompts in CI-like env | Manual project scaffold |
| 2 | `curl` alias in PowerShell | PowerShell aliases `curl` to `Invoke-WebRequest` | Used explicit `Invoke-WebRequest` |
| 3 | Tablet route inheriting main layout | Next.js layout inheritance | Route group `(main)` |
| 4 | `<div>` inside `<p>` hydration error | HelpIcon used `<div>` root inside MetricCard `<p>` | Changed to `<span>` elements |
| 5 | PageLoader hydration mismatch | `Math.random()` in SSR vs client | Moved to `useEffect` |
| 6 | `<button>` inside `<button>` | HelpIcon inside UnassignedPool expand button | Restructured to separate elements |
| 7 | PowerShell `&&` syntax error | PowerShell doesn't support `&&` in older versions | Separate commands |

---

## 15. MVP Roadmap — What to Build Next

### Phase 1: Backend Foundation
- [ ] Set up Node.js/Express or Next.js API routes
- [ ] PostgreSQL database with Prisma ORM
- [ ] Authentication (NextAuth.js or Clerk)
- [ ] Replace all mock data files with API calls
- [ ] Implement real CRUD for shipments, containers, clients

### Phase 2: Real Optimization
- [ ] Integrate Google OR-Tools (Python microservice or WASM)
- [ ] Real bin-packing algorithm replacing `mockBinPacker.js`
- [ ] Persist optimization results to database
- [ ] Job queue for async optimization runs

### Phase 3: Integrations
- [ ] CSV import with real file parsing (Papa Parse)
- [ ] CargoWise TMS API integration
- [ ] Dock scanner IoT webhook receiver
- [ ] Email/Slack notification system
- [ ] PDF export for load plans

### Phase 4: Multi-Tenancy
- [ ] Tenant isolation (row-level security)
- [ ] Role-based access control
- [ ] Audit logging
- [ ] Subscription/billing (Stripe)

### Phase 5: Advanced Features
- [ ] Real-time collaboration (WebSocket)
- [ ] Historical analytics with real data
- [ ] D-Wave quantum optimization pilot
- [ ] Mobile-native tablet app

### Reusable Components Ready for MVP
All shared components in `src/components/shared/` are designed for reuse:
- `Button`, `Card`, `Badge`, `Modal`, `ProgressBar`, `Toggle`, `DataTable`
- `HelpIcon`, `ChartTooltip`, `ReportCard`, `MetricCard`
- `ToastProvider` (notification system)
- `loadPlanValidation.js` (constraint engine — pure functions, no UI dependency)
- `suggestOptimalPlan.js` (solver algorithm — swap with real OR-Tools for MVP)
- `useLoadPlanEditor.js` (editor state management — swap mock data for API calls)
- `ContainerSummaryTable` (stats table with CSV export — reusable for any tabular export)

---

## 16. Coding Standards

### File Organization
- One component per file, named to match the export
- Pages in `src/app/(main)/[route]/page.jsx`
- Domain components in `src/components/[domain]/`
- Shared/reusable components in `src/components/shared/`
- Data in `src/data/`, utilities in `src/utils/`, hooks in `src/hooks/`

### Component Patterns
- Use `'use client'` only when the component needs hooks, event handlers, or browser APIs
- Props destructuring at the function signature
- `useCallback` for handlers passed to children
- `useMemo` for expensive derivations
- Spread `...props` on root elements of shared components for extensibility (`data-tour`, etc.)

### Styling
- Tailwind utility classes — no CSS modules or styled-components
- Custom tokens via `@theme` in `globals.css` — always prefer `text-fw-text` over `text-slate-100`
- Responsive with Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Dark theme by default — light only for `/tablet`

### Naming
- Components: PascalCase (`DraggableShipmentCard.jsx`)
- Utilities: camelCase (`loadPlanValidation.js`)
- Data files: camelCase with `mock` prefix (`mockShipments.js`)
- CSS classes: Tailwind utilities, never custom class names
- IDs: Kebab-case with prefix (`SHP-2026-0001`, `CTR-001`, `CLT-001`)

### Avoid
- Comments that just narrate what code does
- `console.log` in committed code
- Inline styles (except for dynamic values like `transform`, `width`)
- `any` types (if migrating to TypeScript)
- Large monolithic components — extract when > 150 lines

---

## Appendix: Key File Quick Reference

When resuming development, these are the files you'll most likely need to read first:

| What you're doing | Read these files |
|-------------------|-----------------|
| Understanding the app | This guide + `src/context/AppContext.jsx` |
| Adding a new page | `src/app/(main)/page.jsx` (example) + `src/app/(main)/layout.jsx` |
| Adding a feature component | `src/components/shared/Button.jsx` (pattern) |
| Modifying shipment data | `src/data/mockShipments.js` |
| Changing optimization logic | `src/utils/mockBinPacker.js` + `src/data/mockOptimizationResult.js` |
| Updating drag-and-drop | `src/hooks/useLoadPlanEditor.js` + `src/utils/loadPlanValidation.js` |
| Changing solver logic | `src/utils/suggestOptimalPlan.js` |
| Adding a report | `src/components/reports/CostWaterfall.jsx` (pattern) + `src/utils/reportUtils.js` |
| Adding a settings section | `src/components/settings/CompanyProfile.jsx` (pattern) |
| Adding chatbot Q/A | `src/data/chatResponses.js` |
| Adding tour step | `src/data/tourSteps.js` |
| Adding loader animation | `src/components/loaders/HarborScene.jsx` (pattern) + `src/data/loaderContent.js` |
| Fixing hydration errors | Check for `Math.random()` in SSR, `<button>` nesting, `<div>` in `<p>` |

---

*This document was generated from the full development conversation history. All architecture decisions, bug fixes, and feature implementations are captured above.*
