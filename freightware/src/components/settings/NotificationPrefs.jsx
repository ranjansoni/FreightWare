'use client';

import { useState } from 'react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import Toggle from '@/components/shared/Toggle';
import HelpIcon from '@/components/shared/HelpIcon';
import { useToast } from '@/components/shared/ToastProvider';
import { notificationDefaults } from '@/data/mockSettings';
import {
  Zap,
  ScanLine,
  FileBarChart,
  AlertTriangle,
  Gauge,
  Save,
} from 'lucide-react';

const inputCls =
  'w-full bg-fw-bg border border-fw-border rounded-md px-3 py-2 text-sm text-fw-text placeholder:text-fw-text-muted focus:outline-none focus:border-fw-cyan/50';

export default function NotificationPrefs() {
  const { addToast } = useToast();
  const [prefs, setPrefs] = useState({ ...notificationDefaults });

  const update = (key, value) => setPrefs((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-base font-display font-semibold text-fw-text">
            Alert Preferences
          </h3>
          <HelpIcon
            text="Control which events trigger notifications. Alerts are sent via email and in-app notifications. Enable Slack for real-time team notifications."
            position="bottom-right"
          />
        </div>

        <div className="space-y-1 mb-6">
          <Toggle
            checked={prefs.optimizationComplete}
            onChange={(v) => update('optimizationComplete', v)}
            label="Optimization complete"
            subtitle="Notify when a load optimization run finishes"
            icon={Zap}
          />
          <Toggle
            checked={prefs.dockDeviation}
            onChange={(v) => update('dockDeviation', v)}
            label="Dock scanner deviation"
            subtitle="Alert when scanned dimensions differ from manifest"
            icon={ScanLine}
          />
          <Toggle
            checked={prefs.weeklyReport}
            onChange={(v) => update('weeklyReport', v)}
            label="Weekly savings report"
            subtitle="Email summary of cost savings and utilization metrics"
            icon={FileBarChart}
          />
          <Toggle
            checked={prefs.shipmentFlagged}
            onChange={(v) => update('shipmentFlagged', v)}
            label="Shipment flagged"
            subtitle="Alert when AI detects data quality issues in new shipments"
            icon={AlertTriangle}
          />
          <Toggle
            checked={prefs.utilizationWarning}
            onChange={(v) => update('utilizationWarning', v)}
            label="Utilization warning"
            subtitle="Notify when container utilization drops below threshold"
            icon={Gauge}
          />
        </div>

        {prefs.utilizationWarning && (
          <div className="bg-fw-bg border border-fw-border rounded-lg p-4 mb-6">
            <label className="block text-xs text-fw-text-muted mb-2 font-medium uppercase tracking-wider">
              Utilization Warning Threshold
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={50}
                max={95}
                value={prefs.utilizationThreshold}
                onChange={(e) => update('utilizationThreshold', Number(e.target.value))}
                className="flex-1 accent-[#06B6D4]"
              />
              <span className="text-sm font-mono text-fw-text w-12 text-center">
                {prefs.utilizationThreshold}%
              </span>
            </div>
            <p className="text-xs text-fw-text-muted mt-1">
              Alert when any planned container falls below {prefs.utilizationThreshold}% volume utilization
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={() => addToast('Notification preferences saved', 'success')}>
            <Save size={16} />
            Save Changes
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-display font-semibold text-fw-text uppercase tracking-wider">
            Slack Integration
          </h3>
          <HelpIcon
            text="Add a Slack webhook URL to receive FreightWare alerts directly in your team's Slack channel. Create a webhook at api.slack.com/messaging/webhooks."
            position="bottom-right"
          />
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs text-fw-text-muted mb-1.5 font-medium uppercase tracking-wider">
              Webhook URL
            </label>
            <input
              type="text"
              value={prefs.slackWebhook}
              onChange={(e) => update('slackWebhook', e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className={inputCls}
            />
          </div>
          <Button
            variant="ghost"
            onClick={() => addToast('Test message sent to Slack', 'success')}
          >
            Test
          </Button>
        </div>
      </Card>
    </div>
  );
}
