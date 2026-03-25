# FreightWare Demo Script

> **Duration**: 5–6 minutes
> **Format**: Screen recording of live app with voiceover
> **Tool**: Loom (free), OBS Studio, or any screen recorder
> **Tip**: Record at 1920×1080, speak slowly, pause 1–2s on each screen transition to let the loader play

---

## Pre-Recording Setup

1. Run `npm run dev` in `freightware/`
2. Open Chrome at `http://localhost:3000`
3. Clear localStorage (`localStorage.clear()` in console) so the guided tour triggers
4. Dismiss the tour immediately (we'll do our own walkthrough)
5. Start screen recording with mic

---

## Scene 1: Dashboard (0:00–0:45)

**[Screen: Dashboard loads with harbor scene loader]**

> *"This is FreightWare — an AI-powered platform for LCL container load planning. Let me show you what a dispatcher sees when they log in."*

**[Loader finishes, dashboard appears]**

> *"Right away, you see the four numbers that matter: 25 active shipments from 8 clients, 3 containers planned out of 5 in our yard — that means 2 containers saved — 91.5% average utilization versus the industry average of about 72%, and $5,400 in weekly savings."*

**[Point mouse at utilization chart]**

> *"This trend chart shows our utilization climbing over 4 weeks as the AI learns the cargo patterns."*

**[Point at AI Recommendations panel]**

> *"And here, the AI is already telling us: consider combining these two Tokyo-bound shipments, flag a weight anomaly on SHP-0003, and suggest booking a reefer slot for next week's salmon shipment."*

**[Click "Go to Shipments" or navigate via sidebar]**

---

## Scene 2: Shipments & AI Data Cleaning (0:45–1:30)

**[Screen: Shipments page loads with container scan loader]**

> *"Here's where data comes in. We have 25 shipments across 8 clients — timber, seafood, electronics, chemicals, machinery, textiles, furniture, and agriculture. Real-world diversity."*

**[Click the Import CSV button]**

> *"Watch what happens when we import a messy CSV — the kind dispatchers actually get from their TMS."*

**[Modal opens, AI cleaning animation plays]**

> *"The AI found 6 issues: a dimension mismatch on SHP-0003 — the height was declared as 1.5 meters but the pattern suggests 2.1. A missing weight entry, auto-filled from the client's historical average. A client name typo — 'Pacfic Timber' corrected to 'Pacific Timber'. A duplicate booking caught and flagged. A unit error — someone entered dimensions in inches instead of meters. And a missing HAZMAT code on a chemical shipment."*

> *"That's 45 minutes of manual data wrangling, done in 2 seconds."*

**[Close modal, click sidebar → Optimizer]**

---

## Scene 3: Optimization (1:30–2:30)

**[Screen: Optimizer page loads with Tetris loader]**

> *"Now we configure the optimization constraints. Weight limits per container type, HAZMAT segregation per IMDG code, temperature compatibility, stacking rules, fragile cargo protection, delivery window grouping, and route clustering."*

**[Toggle a couple of constraints on/off to show interactivity]**

> *"Every constraint that breaks a spreadsheet, we handle natively."*

**[Click Run Optimization]**

> *"And now we solve."*

**[Watch the 4.5-second animation with solver metrics]**

> *"Solved in 2.4 seconds. The result: we went from a baseline of 5 containers at 72% utilization — $13,500 in freight cost — down to 3 containers at 91.5% utilization, $8,100 in cost. That's a 40% reduction in containers and $5,400 saved. Every single week."*

**[Click "View Load Plan" button]**

---

## Scene 4: 3D Load Plan (2:30–3:15)

**[Screen: Load Plan page loads with crane loader]**

> *"This is the load plan. Each container is shown in full 3D. Every colored block is a shipment — color-coded by client."*

**[Click camera presets: Iso, Front, Top, Side]**

> *"You can view from any angle. Click a block to see the shipment details."*

**[Click a cargo block]**

> *"This is Pacific Timber's cedar planks — 4 pieces, 2,800 kg, heading to Shanghai."*

**[Click Play button for loading sequence]**

> *"And here's the loading sequence — step by step, exactly how the warehouse loads this container. This is what the forklift driver sees on their tablet."*

**[Let a few steps play, then pause]**

---

## Scene 5: Drag-and-Drop Editor (3:15–4:30)

**[Click "Edit Plan" toggle]**

> *"But what if the planner disagrees? What if a last-minute booking comes in? Switch to Edit Mode."*

**[Point at Unassigned Pool]**

> *"Three new shipments just arrived: HAZMAT methanol, frozen salmon, and an oversized generator. Let me try to place them."*

**[Drag HAZMAT methanol (SHP-0026) toward CTR-001]**

> *"Watch — I'm dragging this HAZMAT methanol into Container 1. Red glow. Blocked. Container 1 already has flammable solvents. IMDG code says you cannot co-load."*

**[Drag the 8.5-ton generator (SHP-0028) toward CTR-003 (20ft)]**

> *"Now the oversized generator into the 20-foot container. Red again — weight overload. 8,500 kg would exceed the container's maximum."*

**[Drag frozen salmon (SHP-0027) into CTR-002]**

> *"Frozen salmon into Container 2 — that works. Amber warning for route mismatch, but it's a valid placement."*

**[Click Undo]**

> *"Full undo/redo history. Nothing is permanent until you're ready."*

**[Click "Suggest Plan" button]**

> *"Or let the AI do it. Watch — Suggest Plan."*

**[Overlay animates through 6 phases]**

> *"It's analyzing weights... grouping by destination... isolating hazardous materials... optimizing temperature compatibility... maximizing space... final compliance check. Done."*

**[Summary appears — click Apply Plan]**

> *"Apply the plan, and the entire editor updates — containers, 3D preview, and the summary table below."*

**[Scroll down to Container Summary Table]**

> *"Here's the summary: every container at a glance — fill percentage, weight, volume, HAZMAT flags, warnings. And you can export this as a CSV for your operations team or client sign-off."*

---

## Scene 6: Real-Time Replanning (4:30–5:15)

**[Navigate to Replan via sidebar]**

> *"Now the moment of truth. It's dock day. The scanner measures SHP-0003 and finds the actual dimensions are larger than what was declared on the manifest."*

**[Point at the deviation alert and impact assessment]**

> *"FreightWare shows the impact instantly: Container 1 is at risk of overflow."*

**[Click Trigger Replan]**

> *"One click to replan."*

**[Watch 0.8-second animation]**

> *"Replanned in 0.8 seconds. A warm-start re-optimization that moved just 2 shipments to accommodate the larger crate. No overflow container needed. No delays. No phone calls."*

> *"This is the feature no competitor has. Excel can't do this. Legacy TMS can't do this. FreightWare does it in under a second."*

---

## Scene 7: Reports + Close (5:15–5:45)

**[Navigate to Reports]**

> *"Finally — the numbers your CFO wants. Cost savings waterfall showing exactly where money is saved. Client volume treemap. Cargo density analysis. Container composition. Destination mix."*

**[Scroll through reports quickly]**

> *"Every chart is interactive, every number is real, and it all exports for your monthly client reviews."*

---

## Scene 8: Closing (5:45–6:00)

**[Navigate back to Dashboard]**

> *"FreightWare: from 5 containers to 3. From 3 hours of planning to 2.4 seconds. From guesswork to certainty."*

> *"We're running a 90-day pilot on the Vancouver corridor. If you're a consolidator spending more than you should on containers, let's talk."*

**[Hold on dashboard for 3 seconds, end recording]**

---

## Optional Bonus Scenes (if recording separate short clips)

### Tablet View (30 seconds)
Navigate to `/tablet`, show the light-mode touch interface, step through a few loading instructions.

### Chatbot (20 seconds)
Open the chatbot, type "Which container has the most space?", show the contextual response.

### Settings (15 seconds)
Quick scroll through the 7 settings tabs to show enterprise readiness.

---

## Recording Tips

1. **Resolution**: 1920×1080, 30fps minimum
2. **Browser**: Chrome in full-screen (F11), no bookmarks bar
3. **Mouse movement**: Deliberate and slow — let the viewer follow
4. **Voice**: Conversational, confident, not salesy. Pretend you're showing a colleague.
5. **Pauses**: Let each page loader play fully — they're part of the experience
6. **Mistakes**: If you make one, just keep going. One continuous take feels more authentic than spliced clips.
7. **Background**: Close all other apps, notifications off, clean desktop
8. **Music**: Optional — a subtle lo-fi track underneath works well for SaaS demos
