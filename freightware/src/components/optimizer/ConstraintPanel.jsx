'use client';

import { useState } from 'react';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import HelpIcon from '@/components/shared/HelpIcon';
import Toggle from '@/components/shared/Toggle';
import { availableContainers } from '@/data/mockContainers';
import {
  Shield,
  Thermometer,
  Layers,
  Users,
  Calendar,
  Weight,
} from 'lucide-react';

export default function ConstraintPanel() {
  const [selectedContainers, setSelectedContainers] = useState(
    availableContainers.filter((c) => c.status === 'assigned').map((c) => c.id)
  );
  const [constraints, setConstraints] = useState({
    weightLimit: true,
    hazmatIsolation: true,
    tempCompat: true,
    stackability: true,
    priorityWeight: true,
    sailingGroup: true,
  });

  const toggleContainer = (id) => {
    setSelectedContainers((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const updateConstraint = (key, val) => {
    setConstraints((prev) => ({ ...prev, [key]: val }));
  };

  const activeCount = Object.values(constraints).filter(Boolean).length;

  return (
    <div className="space-y-6" data-tour="constraint-panel">
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-display font-semibold text-fw-text uppercase tracking-wider">
            Container Selection
          </h3>
          <HelpIcon
            text="Select which containers from your yard are available for this optimization run. 'Assigned' containers are pre-allocated to this load; 'available' ones can be used if needed."
            position="bottom-right"
          />
        </div>
        <div className="space-y-2">
          {availableContainers.map((c) => (
            <label
              key={c.id}
              className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                selectedContainers.includes(c.id)
                  ? 'border-fw-cyan/40 bg-fw-cyan/5'
                  : 'border-fw-border hover:border-fw-border/80'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedContainers.includes(c.id)}
                onChange={() => toggleContainer(c.id)}
                className="accent-[#06B6D4]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-fw-text">{c.id}</span>
                  <span className="text-xs text-fw-text-dim">{c.name}</span>
                </div>
                <p className="text-xs text-fw-text-muted">
                  {c.volume} m³ · {(c.maxWeight / 1000).toFixed(1)}t max
                </p>
              </div>
              <Badge
                color={c.status === 'assigned' ? 'cyan' : 'gray'}
              >
                {c.status}
              </Badge>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-display font-semibold text-fw-text uppercase tracking-wider">
            Constraints ({activeCount} active)
          </h3>
          <HelpIcon
            text="Toggle constraints on/off to control how the optimizer packs cargo. Active constraints are hard limits — the solver will never violate them. Disabling a constraint gives the solver more flexibility but may not meet regulatory requirements."
            position="bottom-right"
          />
        </div>
        <div className="space-y-1">
          <Toggle
            checked={constraints.weightLimit}
            onChange={(v) => updateConstraint('weightLimit', v)}
            label="Weight limit per container"
            icon={Weight}
          />
          <Toggle
            checked={constraints.hazmatIsolation}
            onChange={(v) => updateConstraint('hazmatIsolation', v)}
            label="HAZMAT isolation"
            subtitle="Per IMDG code"
            icon={Shield}
          />
          <Toggle
            checked={constraints.tempCompat}
            onChange={(v) => updateConstraint('tempCompat', v)}
            label="Temperature compatibility"
            subtitle="Frozen cargo grouped"
            icon={Thermometer}
          />
          <Toggle
            checked={constraints.stackability}
            onChange={(v) => updateConstraint('stackability', v)}
            label="Stackability rules"
            icon={Layers}
          />
          <Toggle
            checked={constraints.priorityWeight}
            onChange={(v) => updateConstraint('priorityWeight', v)}
            label="Client priority weighting"
            icon={Users}
          />
          <Toggle
            checked={constraints.sailingGroup}
            onChange={(v) => updateConstraint('sailingGroup', v)}
            label="Sailing date grouping"
            icon={Calendar}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-display font-semibold text-fw-text mb-3 uppercase tracking-wider">
          Optimization Mode
        </h3>
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3 rounded-md border border-fw-cyan/40 bg-fw-cyan/5 cursor-pointer">
            <input
              type="radio"
              name="mode"
              defaultChecked
              className="mt-1 accent-[#06B6D4]"
            />
            <div>
              <p className="text-sm font-medium text-fw-text">
                Classical (OR-Tools CP-SAT)
              </p>
              <p className="text-xs text-fw-text-dim">
                Constraint programming, exact solver
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 p-3 rounded-md border border-fw-border opacity-50 cursor-not-allowed">
            <input type="radio" name="mode" disabled className="mt-1" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-fw-text-dim">
                  Quantum-Enhanced (D-Wave Hybrid)
                </p>
                <Badge color="purple">Coming 2027</Badge>
                <HelpIcon
                  text="D-Wave quantum annealing explores millions of packing configurations simultaneously. Benefits emerge at scale (50+ shipments, 8+ containers) where classical solvers hit time limits. Currently in partnership development."
                  position="bottom-left"
                />
              </div>
              <p className="text-xs text-fw-text-muted">
                Quantum annealing + classical
              </p>
            </div>
          </label>
          <p className="text-xs text-fw-text-muted px-1">
            Quantum acceleration benefits loads &gt;50 shipments across &gt;8
            containers. Current load: 25 shipments, 5 containers — classical
            solver is optimal.
          </p>
        </div>
      </Card>
    </div>
  );
}
