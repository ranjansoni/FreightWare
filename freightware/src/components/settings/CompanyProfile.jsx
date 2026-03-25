'use client';

import { useState } from 'react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import HelpIcon from '@/components/shared/HelpIcon';
import { useToast } from '@/components/shared/ToastProvider';
import { companyProfile } from '@/data/mockSettings';
import { Building2, Upload, Save } from 'lucide-react';

const INDUSTRIES = [
  'Freight Forwarding',
  'NVOCC',
  '3PL',
  'Customs Broker',
  'Shipping Line',
  'Logistics Provider',
];

const PORTS = [
  'Vancouver',
  'Seattle',
  'Long Beach',
  'Oakland',
  'Prince Rupert',
  'Montreal',
  'Halifax',
];

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs text-fw-text-muted mb-1.5 font-medium uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-fw-bg border border-fw-border rounded-md px-3 py-2 text-sm text-fw-text placeholder:text-fw-text-muted focus:outline-none focus:border-fw-cyan/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.1)]';

export default function CompanyProfile() {
  const { addToast } = useToast();
  const [form, setForm] = useState({ ...companyProfile });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-base font-display font-semibold text-fw-text">
            Company Profile
          </h3>
          <HelpIcon
            text="Your company details appear on reports, invoices, and team invitations. Keep them up to date for accurate documentation."
            position="bottom-right"
          />
        </div>

        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-fw-border flex flex-col items-center justify-center gap-2 hover:border-fw-cyan/40 transition-colors cursor-pointer group">
            <Building2 size={28} className="text-fw-text-muted group-hover:text-fw-cyan transition-colors" />
            <span className="text-[10px] text-fw-text-muted group-hover:text-fw-cyan transition-colors flex items-center gap-1">
              <Upload size={10} /> Logo
            </span>
          </div>
          <div className="flex-1 space-y-4">
            <Field label="Company Name">
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Industry">
                <select
                  value={form.industry}
                  onChange={(e) => update('industry', e.target.value)}
                  className={inputCls}
                >
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </Field>
              <Field label="Primary Port">
                <select
                  value={form.primaryPort}
                  onChange={(e) => update('primaryPort', e.target.value)}
                  className={inputCls}
                >
                  {PORTS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Street Address">
            <input
              type="text"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="City">
            <input
              type="text"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Province / State">
            <input
              type="text"
              value={form.province}
              onChange={(e) => update('province', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Postal Code">
            <input
              type="text"
              value={form.postalCode}
              onChange={(e) => update('postalCode', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Phone">
            <input
              type="text"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Tax ID / Business Number">
            <input
              type="text"
              value={form.taxId}
              onChange={(e) => update('taxId', e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Website" className="mb-6">
          <input
            type="text"
            value={form.website}
            onChange={(e) => update('website', e.target.value)}
            className={inputCls}
          />
        </Field>

        <div className="flex justify-end">
          <Button onClick={() => addToast('Company profile saved', 'success')}>
            <Save size={16} />
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
