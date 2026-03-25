'use client';

import { useState } from 'react';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import ProgressBar from '@/components/shared/ProgressBar';
import HelpIcon from '@/components/shared/HelpIcon';
import { useToast } from '@/components/shared/ToastProvider';
import { availableContainers } from '@/data/mockContainers';
import { containerRates, optimizationDefaults } from '@/data/mockSettings';
import { containerTypes } from '@/utils/containerSpecs';
import { Plus, Save } from 'lucide-react';

const inputCls =
  'bg-fw-bg border border-fw-border rounded-md px-3 py-2 text-sm text-fw-text focus:outline-none focus:border-fw-cyan/50';

const TYPE_OPTIONS = Object.keys(containerTypes);
const STATUS_OPTIONS = ['assigned', 'available', 'maintenance'];

export default function ContainerYard() {
  const { addToast } = useToast();
  const [containers, setContainers] = useState(
    availableContainers.map((c) => ({
      ...c,
      rate: containerRates[c.id] || 2400,
    }))
  );
  const [optPrefs, setOptPrefs] = useState({ ...optimizationDefaults });

  const updateContainer = (id, key, value) => {
    setContainers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: value } : c))
    );
  };

  const addContainer = () => {
    const nextNum = containers.length + 1;
    const newId = `CTR-${String(nextNum).padStart(3, '0')}`;
    setContainers((prev) => [
      ...prev,
      {
        id: newId,
        type: '40ft',
        status: 'available',
        rate: 2400,
        ...containerTypes['40ft'],
      },
    ]);
    addToast(`Container ${newId} added`, 'success');
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-display font-semibold text-fw-text">
              Container Fleet
            </h3>
            <HelpIcon
              text="Manage your yard's container inventory. Set rates per trip for cost calculations, and status to control which containers are available for optimization."
              position="bottom-right"
            />
          </div>
          <Button variant="ghost" size="sm" onClick={addContainer}>
            <Plus size={14} />
            Add Container
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-fw-border">
                <th className="text-left py-2 px-3 text-xs font-medium text-fw-text-muted uppercase tracking-wider">ID</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-fw-text-muted uppercase tracking-wider">Type</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-fw-text-muted uppercase tracking-wider">Capacity</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-fw-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-fw-text-muted uppercase tracking-wider">Rate ($/trip)</th>
              </tr>
            </thead>
            <tbody>
              {containers.map((c, i) => {
                const spec = containerTypes[c.type];
                return (
                  <tr
                    key={c.id}
                    className={`border-b border-fw-border/50 ${i % 2 === 0 ? 'bg-fw-surface' : 'bg-fw-surface-2'}`}
                  >
                    <td className="py-3 px-3 font-mono text-xs text-fw-text">{c.id}</td>
                    <td className="py-3 px-3">
                      <select
                        value={c.type}
                        onChange={(e) => updateContainer(c.id, 'type', e.target.value)}
                        className="bg-fw-bg border border-fw-border rounded-md px-2 py-1 text-xs text-fw-text"
                      >
                        {TYPE_OPTIONS.map((t) => (
                          <option key={t} value={t}>{containerTypes[t].name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3 text-xs text-fw-text-dim font-mono">
                      {spec?.volume} m³ · {((spec?.maxWeight || 0) / 1000).toFixed(1)}t
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={c.status}
                        onChange={(e) => updateContainer(c.id, 'status', e.target.value)}
                        className="bg-fw-bg border border-fw-border rounded-md px-2 py-1 text-xs text-fw-text"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-fw-text-muted">$</span>
                        <input
                          type="number"
                          value={c.rate}
                          onChange={(e) => updateContainer(c.id, 'rate', Number(e.target.value))}
                          className={`${inputCls} w-24 !py-1 text-xs font-mono`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={() => addToast('Container fleet saved', 'success')}>
            <Save size={16} />
            Save Changes
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-display font-semibold text-fw-text uppercase tracking-wider">
            Default Optimization Preferences
          </h3>
          <HelpIcon
            text="These defaults are applied when you start a new optimization run. You can override them on the Optimizer page for individual runs."
            position="bottom-right"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs text-fw-text-muted mb-2 font-medium uppercase tracking-wider">
              Max Containers Per Run
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={10}
                value={optPrefs.maxContainersPerRun}
                onChange={(e) => setOptPrefs((p) => ({ ...p, maxContainersPerRun: Number(e.target.value) }))}
                className="flex-1 accent-[#06B6D4]"
              />
              <span className="text-sm font-mono text-fw-text w-8 text-center">
                {optPrefs.maxContainersPerRun}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-fw-text-muted mb-2 font-medium uppercase tracking-wider">
              Target Utilization (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={50}
                max={100}
                value={optPrefs.targetUtilization}
                onChange={(e) => setOptPrefs((p) => ({ ...p, targetUtilization: Number(e.target.value) }))}
                className={`${inputCls} w-20 text-center font-mono`}
              />
              <ProgressBar
                value={optPrefs.targetUtilization}
                max={100}
                color="cyan"
                showPercent={false}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={() => addToast('Optimization preferences saved', 'success')}>
            <Save size={16} />
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
}
