'use client';

import { useState } from 'react';
import {
  Building2,
  Users,
  Box,
  Plug,
  Bell,
  CreditCard,
  Palette,
} from 'lucide-react';
import PageLoader from '@/components/shared/PageLoader';
import CompanyProfile from '@/components/settings/CompanyProfile';
import UserManagement from '@/components/settings/UserManagement';
import ContainerYard from '@/components/settings/ContainerYard';
import Integrations from '@/components/settings/Integrations';
import NotificationPrefs from '@/components/settings/NotificationPrefs';
import BillingPlan from '@/components/settings/BillingPlan';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import usePageTitle from '@/utils/usePageTitle';

const TABS = [
  { id: 'company', label: 'Company Profile', icon: Building2 },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'containers', label: 'Container Yard', icon: Box },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

const TAB_COMPONENTS = {
  company: CompanyProfile,
  users: UserManagement,
  containers: ContainerYard,
  integrations: Integrations,
  notifications: NotificationPrefs,
  billing: BillingPlan,
  appearance: AppearanceSettings,
};

export default function SettingsPage() {
  usePageTitle('Settings');
  const [activeTab, setActiveTab] = useState('company');

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <PageLoader theme="dashboard">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-fw-text">
            Settings
          </h2>
          <p className="text-sm text-fw-text-dim mt-1">
            Manage your organization, team, fleet, integrations, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" data-tour="settings-tabs">
          <div className="lg:col-span-1">
            <nav className="space-y-1 sticky top-4">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-fw-cyan/10 text-fw-cyan'
                        : 'text-fw-text-dim hover:bg-fw-surface-2 hover:text-fw-text'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="lg:col-span-4">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </PageLoader>
  );
}
