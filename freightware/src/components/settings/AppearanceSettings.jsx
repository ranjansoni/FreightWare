'use client';

import { useState } from 'react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import HelpIcon from '@/components/shared/HelpIcon';
import { useToast } from '@/components/shared/ToastProvider';
import { appearanceDefaults } from '@/data/mockSettings';
import { Save, Moon, Sun, Monitor } from 'lucide-react';

const THEMES = [
  { value: 'dark', label: 'Dark', icon: Moon, description: 'Optimized for low-light environments' },
  { value: 'light', label: 'Light', icon: Sun, description: 'High contrast for bright environments' },
  { value: 'system', label: 'System', icon: Monitor, description: 'Follow your OS preference' },
];

const DENSITIES = [
  { value: 'comfortable', label: 'Comfortable', description: 'More spacing, easier to read' },
  { value: 'compact', label: 'Compact', description: 'Denser layout, more content on screen' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Fran\u00e7ais (coming soon)', disabled: true },
  { value: 'zh', label: '\u4e2d\u6587 (coming soon)', disabled: true },
];

const DATE_FORMATS = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (International)' },
];

const CURRENCIES = [
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'CNY', label: 'CNY — Chinese Yuan' },
];

const selectCls =
  'w-full bg-fw-bg border border-fw-border rounded-md px-3 py-2 text-sm text-fw-text focus:outline-none focus:border-fw-cyan/50';

export default function AppearanceSettings() {
  const { addToast } = useToast();
  const [prefs, setPrefs] = useState({ ...appearanceDefaults });

  const update = (key, value) => setPrefs((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-base font-display font-semibold text-fw-text">
            Theme
          </h3>
          <HelpIcon
            text="Choose how FreightWare looks. Dark mode is optimized for operations rooms and low-light environments. Light mode coming in v1.0."
            position="bottom-right"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {THEMES.map((theme) => {
            const Icon = theme.icon;
            const isActive = prefs.theme === theme.value;
            return (
              <button
                key={theme.value}
                onClick={() => update('theme', theme.value)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  isActive
                    ? 'border-fw-cyan/40 bg-fw-cyan/5'
                    : 'border-fw-border hover:border-fw-border/80'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-fw-cyan' : 'text-fw-text-dim'} />
                <p className={`text-sm font-medium mt-2 ${isActive ? 'text-fw-cyan' : 'text-fw-text'}`}>
                  {theme.label}
                </p>
                <p className="text-xs text-fw-text-muted mt-0.5">{theme.description}</p>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-display font-semibold text-fw-text mb-4 uppercase tracking-wider">
          UI Density
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {DENSITIES.map((d) => {
            const isActive = prefs.density === d.value;
            return (
              <button
                key={d.value}
                onClick={() => update('density', d.value)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  isActive
                    ? 'border-fw-cyan/40 bg-fw-cyan/5'
                    : 'border-fw-border hover:border-fw-border/80'
                }`}
              >
                <p className={`text-sm font-medium ${isActive ? 'text-fw-cyan' : 'text-fw-text'}`}>
                  {d.label}
                </p>
                <p className="text-xs text-fw-text-muted mt-0.5">{d.description}</p>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-display font-semibold text-fw-text mb-4 uppercase tracking-wider">
          Regional
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-fw-text-muted mb-1.5 font-medium uppercase tracking-wider">
              Language
            </label>
            <select
              value={prefs.language}
              onChange={(e) => update('language', e.target.value)}
              className={selectCls}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value} disabled={l.disabled}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-fw-text-muted mb-1.5 font-medium uppercase tracking-wider">
              Date Format
            </label>
            <select
              value={prefs.dateFormat}
              onChange={(e) => update('dateFormat', e.target.value)}
              className={selectCls}
            >
              {DATE_FORMATS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-fw-text-muted mb-1.5 font-medium uppercase tracking-wider">
              Currency
            </label>
            <select
              value={prefs.currency}
              onChange={(e) => update('currency', e.target.value)}
              className={selectCls}
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={() => addToast('Appearance settings saved', 'success')}>
            <Save size={16} />
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
