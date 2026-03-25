export const chatResponses = [
  // ── Dashboard ──
  {
    id: 'dash-utilization',
    triggers: ['utilization', 'average', '91', 'percent', 'kpi'],
    answer:
      'Average utilization measures the percentage of available container volume actually filled with cargo. The industry average for LCL consolidation is ~65%. FreightWare\'s AI optimization pushes this to 91.5% by intelligently grouping compatible shipments and maximizing 3D space usage.',
  },
  {
    id: 'dash-savings',
    triggers: ['savings', 'saved', 'money', 'cost', 'dollar', '5400'],
    answer:
      'This week, FreightWare saved $5,400 by reducing the number of containers needed from 5 to 3. Each 40ft container costs approximately $2,700 CAD for the Vancouver–Shanghai route. That\'s a 40% reduction in container costs with no change in cargo volume.',
  },
  {
    id: 'dash-flagged',
    triggers: ['flagged', 'flag', 'alert', 'warning', 'issue'],
    answer:
      'Flagged shipments have potential data issues detected by AI — like dimensions that don\'t match typical ranges for the declared commodity, missing weight data, or HAZMAT classification gaps. Review these before running the optimizer to ensure accurate packing.',
  },
  {
    id: 'dash-ai-detect',
    triggers: ['ai detect', 'how does ai', 'machine learning', 'anomaly'],
    answer:
      'FreightWare AI uses pattern matching on historical shipment data to detect anomalies. For example, if a "server rack crate" is declared at 0.8×0.6×1.0m but historical data shows they\'re typically 1.2×0.8×2.0m, the system flags it for dock verification. It also cross-references HAZMAT codes, checks for duplicate bookings, and validates unit consistency.',
  },

  // ── Shipments ──
  {
    id: 'ship-cleaning',
    triggers: ['cleaning', 'clean', 'import', 'csv', 'data quality'],
    answer:
      'When you import a CSV, FreightWare AI runs 8 automated checks: client name normalization, unit conversion (imperial→metric), duplicate detection, missing weight estimation (using commodity type), dimension validation against commodity norms, HAZMAT code completeness, piece count vs volume consistency, and booking reference deduplication.',
  },
  {
    id: 'ship-status',
    triggers: ['status', 'dot', 'color dot', 'green dot', 'amber dot', 'red dot'],
    answer:
      'Status indicators: 🟢 Ready — all data verified, cleared for optimization. 🟡 Pending Review — AI flagged potential issues that need human confirmation. 🔴 Blocked — critical data missing (e.g., no weight and unable to estimate). Gray — not yet processed.',
  },
  {
    id: 'ship-fix-flags',
    triggers: ['fix flag', 'resolve', 'correct flag'],
    answer:
      'To resolve a flagged shipment: click the row to open details, review the AI suggestion (shown in amber), then either accept the AI correction or manually update the field. Once all flags on a shipment are resolved, it automatically moves to "Ready" status.',
  },
  {
    id: 'ship-dimensions',
    triggers: ['dimension', 'mismatch', 'size', 'measurement'],
    answer:
      'Dimension mismatches occur when the declared measurements don\'t match historical patterns for that commodity type. For example, SHP-0003 declares server rack crates at 0.8×0.6×1.0m, but typical server racks are 30% larger. This could mean undersized dimensions on the manifest — dock verification recommended.',
  },
  {
    id: 'ship-hazmat',
    triggers: ['hazmat', 'dangerous', 'imdg', 'un number', 'un code'],
    answer:
      'HAZMAT shipments require a UN number, proper shipping name, and IMDG class. FreightWare validates these and flags incomplete records. The optimizer enforces HAZMAT isolation rules — Class 3 flammables won\'t be placed adjacent to oxidizers, and all DG cargo gets floor-level placement near the container door for emergency access.',
  },

  // ── Optimizer ──
  {
    id: 'opt-constraints',
    triggers: ['constraint', 'rule', 'limit', 'toggle'],
    answer:
      'Constraints are hard rules the optimizer must obey. Weight limits prevent overloading, HAZMAT isolation follows IMDG code, temperature compatibility keeps frozen cargo grouped, stackability prevents fragile items from being crushed, client priority ensures premium clients get preferred placement, and sailing date grouping prevents mixed-voyage containers.',
  },
  {
    id: 'opt-ortools',
    triggers: ['or-tools', 'ortools', 'solver', 'cp-sat', 'algorithm', 'how it works'],
    answer:
      'FreightWare uses Google OR-Tools CP-SAT solver — a constraint programming engine that models container packing as a 3D bin-packing problem with side constraints. It explores millions of valid configurations to find near-optimal solutions. For 25 shipments across 5 containers, it typically solves in 2-4 seconds.',
  },
  {
    id: 'opt-quantum',
    triggers: ['quantum', 'd-wave', 'dwave', 'annealing', 'qubit'],
    answer:
      'The quantum roadmap targets 2027 via a D-Wave partnership. Quantum annealing can explore combinatorial spaces exponentially faster than classical solvers. Benefits emerge at scale — 50+ shipments across 8+ containers — where classical solvers hit diminishing returns. For current load sizes, the classical CP-SAT solver is actually optimal.',
  },
  {
    id: 'opt-time',
    triggers: ['solve time', 'how long', 'speed', 'fast', '2.4 seconds'],
    answer:
      'Optimization runs typically complete in 2-4 seconds for current load sizes (25 shipments, 5 containers). This compares to 3+ hours of manual planning per load. The solver first finds a feasible solution quickly, then iteratively improves it within the time budget.',
  },

  // ── Load Plan ──
  {
    id: 'load-3d',
    triggers: ['3d', 'rotate', 'zoom', 'pan', 'camera', 'view', 'controls'],
    answer:
      'The 3D viewer supports: drag to rotate around the container, scroll wheel to zoom in/out, right-click drag to pan. Use the camera preset buttons (Iso, Front, Top, Side) for standard views. Click any cargo block to highlight it and see its details in the side panel.',
  },
  {
    id: 'load-colors',
    triggers: ['color', 'colour', 'client color', 'block color'],
    answer:
      'Each client is assigned a unique color for their cargo blocks. This makes it easy to visually identify which shipments belong to which customer. The color legend is shown when you hover over any block — it displays the client name, shipment ID, and key dimensions.',
  },
  {
    id: 'load-sequence',
    triggers: ['sequence', 'loading order', 'load order', 'step by step'],
    answer:
      'The loading sequence shows the optimal order for physically placing cargo. Items are numbered from 1 (loaded first, placed at the back) to N (loaded last, nearest the door). This ensures the unloading order at destination matches the delivery schedule. Heavy items go on the floor first for stability.',
  },
  {
    id: 'load-placement',
    triggers: ['placement', 'position', 'where', 'stacking'],
    answer:
      'The optimizer considers weight distribution (heavy items on floor), fragility (fragile items on top, not stacked upon), HAZMAT placement (near door for access), and destination grouping. The 3D view shows exact x/y/z coordinates for each piece — these translate to forklift instructions on the tablet view.',
  },
  {
    id: 'load-drag-drop',
    triggers: ['drag', 'drop', 'edit plan', 'move shipment', 'manual adjust', 'rearrange'],
    answer:
      'Click "Edit Plan" on the Load Plan page to enter drag-and-drop mode. You can drag shipments between containers or to/from the unassigned pool. The system validates every move in real-time — red means blocked (HAZMAT conflict, weight overload), amber means allowed but with a warning (route mismatch, fragile risk). The 3D preview updates automatically as you rearrange.',
  },
  {
    id: 'load-constraints',
    triggers: ['constraint rule', 'validation rule', 'what rules', 'why blocked', 'cannot place'],
    answer:
      'The drag-and-drop editor enforces 6 constraint rules: (1) Weight limit — cannot exceed container max weight, (2) Volume limit — cannot exceed container capacity, (3) HAZMAT segregation — max one HAZMAT shipment per container per IMDG code, (4) Temperature conflict — temp-controlled cargo warns when mixed with ambient, (5) Fragile risk — fragile items warn in heavily-loaded containers, (6) Route mismatch — warns when mixing different destinations.',
  },

  // ── Replan ──
  {
    id: 'replan-deviation',
    triggers: ['deviation', 'dock scan', 'actual scan', 'different', 'changed'],
    answer:
      'A deviation occurs when a dock scan reveals that actual cargo dimensions or weight differ from the manifest. FreightWare immediately assesses the impact — can the cargo still fit? Does it displace other shipments? The AI determines the minimum number of moves needed to accommodate the change.',
  },
  {
    id: 'replan-speed',
    triggers: ['0.8', 'replan speed', 'how fast', 'seconds', 'replan time'],
    answer:
      'Replanning completed in 0.8 seconds because FreightWare uses warm-starting — instead of solving from scratch, it uses the existing plan as a seed and only recalculates affected positions. This means only the cargo that needs to move gets repositioned, keeping the disruption minimal.',
  },
  {
    id: 'replan-warm',
    triggers: ['warm start', 'warm-start', 'seed', 'incremental'],
    answer:
      'Warm-starting means the solver begins with the current valid plan rather than a blank slate. It then makes the minimum changes necessary to accommodate the deviation. This is dramatically faster than cold-starting (full re-solve) and preserves most of the original loading sequence, reducing warehouse disruption.',
  },
  {
    id: 'replan-overflow',
    triggers: ['overflow', 'charge', 'extra container', 'spill'],
    answer:
      'Overflow occurs when cargo can\'t fit in the planned containers and an additional container must be booked — typically costing $2,200+ for a last-minute booking. FreightWare\'s replanner avoids this by intelligently redistributing cargo across existing containers, absorbing dimensional changes without needing extra capacity.',
  },

  // ── Business / Investor ──
  {
    id: 'biz-roi',
    triggers: ['roi', 'return on investment', 'business case', 'value'],
    answer:
      'FreightWare delivers ROI through three channels: (1) Container reduction — 40% fewer containers needed ($5,400/week for a mid-size consolidator), (2) Time savings — 14+ hours/week freed from manual planning, and (3) Error prevention — eliminating overflow charges ($2,200+ per incident) and compliance fines. Typical payback period: 6-8 weeks.',
  },
  {
    id: 'biz-manual',
    triggers: ['manual', 'compare', 'spreadsheet', 'traditional', 'before freightware'],
    answer:
      'Manual planning takes 3+ hours per optimization run using spreadsheets and tribal knowledge. FreightWare solves in 2.4 seconds. Error rates drop from ~12% (manual data entry) to <1% (AI validation). Replanning that takes 45+ minutes manually happens in <1 second. And the 3D load plan eliminates "best guess" placement on the warehouse floor.',
  },
  {
    id: 'biz-pricing',
    triggers: ['pricing', 'price', 'cost', 'subscription', 'license', 'how much'],
    answer:
      'Contact sales for enterprise pricing. Typical ROI is 30-40% container cost reduction, with most customers seeing positive ROI within 8 weeks. We offer volume-based tiers for small consolidators (1-5 containers/week) through large CFS operations (50+ containers/week).',
  },
  {
    id: 'biz-market',
    triggers: ['market', 'who', 'customer', 'target', 'serve', 'industry'],
    answer:
      'FreightWare serves LCL consolidators, Container Freight Station (CFS) operators, and freight forwarders who manage multi-client container loads. Our sweet spot is operations handling 5-50 containers per week with 3+ clients per container — where manual planning becomes a significant bottleneck.',
  },
  {
    id: 'biz-quantum-road',
    triggers: ['quantum roadmap', 'future', '2027', 'partnership'],
    answer:
      'Our D-Wave partnership targets production quantum optimization by 2027. Phase 1 (current): classical OR-Tools solver. Phase 2 (2026): hybrid quantum-classical prototyping on D-Wave Advantage. Phase 3 (2027): production quantum for loads exceeding 50 shipments. Benefits: 10x speed improvement and ability to solve previously intractable multi-constraint problems.',
  },
  {
    id: 'biz-security',
    triggers: ['security', 'secure', 'soc2', 'encrypt', 'data privacy', 'gdpr', 'tenant'],
    answer:
      'FreightWare is built with enterprise security: SOC2 compliance planned for Q3 2026, all data encrypted at rest (AES-256) and in transit (TLS 1.3), strict tenant isolation (no data leakage between customers), role-based access control, and full audit logging. We do not share or sell customer data.',
  },

  // ── Reports ──
  {
    id: 'report-waterfall',
    triggers: ['waterfall', 'cost breakdown', 'savings chart', 'report', 'analytics'],
    answer:
      'The Cost Savings Waterfall shows how FreightWare reduces your weekly container costs step by step — from the $13,500 baseline (5 containers at 72% utilization) through container reduction savings, overflow charge avoidance, and CO₂ credit value, down to $5,420 optimized cost. That\'s a 40% reduction.',
  },
  {
    id: 'report-density',
    triggers: ['density', 'bubble', 'weight volume', 'scatter', 'heavy bulky'],
    answer:
      'The Cargo Density chart plots each shipment by weight vs. volume. Shipments above the 250 kg/m³ density line are weight-constrained (heavy but compact, like machinery). Below the line are volume-constrained (bulky but light, like textiles). The optimizer mixes both types in each container to maximize both weight and volume utilization simultaneously.',
  },
  // ── Settings ──
  {
    id: 'settings-overview',
    triggers: ['settings', 'configure', 'preferences', 'setup', 'company', 'profile'],
    answer:
      'The Settings page lets you manage 7 areas: Company Profile (name, logo, address), User Management (team roles and invites), Container Yard (fleet and rates), Integrations (TMS, ERP, dock scanner), Notifications (alert preferences), Billing & Plan (subscription and usage), and Appearance (theme, language, currency).',
  },
  {
    id: 'settings-roles',
    triggers: ['role', 'permission', 'admin', 'user management', 'invite', 'team'],
    answer:
      'FreightWare has 4 roles: Admin (full access), Operations Manager (run optimizations, manage shipments), Warehouse Lead (tablet view and loading sequences), and Viewer (read-only dashboards and reports). Admins can invite new team members and change roles from Settings → User Management.',
  },
];

export const pageSuggestions = {
  '/': [
    'What does average utilization mean?',
    'How are these savings calculated?',
    'What are flagged shipments?',
    'What\'s the ROI of FreightWare?',
  ],
  '/shipments': [
    'How does AI data cleaning work?',
    'What do the status colors mean?',
    'How do I fix a flagged shipment?',
    'What are HAZMAT requirements?',
  ],
  '/optimizer': [
    'How does the solver work?',
    'What are constraints?',
    'When is quantum useful?',
    'How fast is optimization?',
  ],
  '/loadplan': [
    'How do I use drag-and-drop?',
    'What constraint rules are enforced?',
    'How do I navigate the 3D view?',
    'How is loading order determined?',
  ],
  '/replan': [
    'What triggered this replan?',
    'How was it solved in 0.8 seconds?',
    'What is warm-starting?',
    'How is overflow avoided?',
  ],
  '/reports': [
    'Explain the cost savings waterfall',
    'What does cargo density tell us?',
    'What\'s the ROI of FreightWare?',
    'How does this compare to manual?',
  ],
  '/settings': [
    'What can I configure in Settings?',
    'How do user roles work?',
    'How do I connect my TMS?',
    'What plan am I on?',
  ],
};

export const fallbackResponse =
  "I can help with questions about optimization, container planning, shipment data, replanning, and business value. Try one of the suggestions below, or ask about ROI, pricing, or our quantum roadmap.";
