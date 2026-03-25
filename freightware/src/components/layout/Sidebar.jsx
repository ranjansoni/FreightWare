'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Zap,
  Box,
  RefreshCw,
  BarChart3,
  Tablet,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/shared/ToastProvider';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/shipments', label: 'Shipments', icon: Package },
  { href: '/optimizer', label: 'Optimizer', icon: Zap },
  { href: '/loadplan', label: 'Load Plan', icon: Box },
  { href: '/replan', label: 'Replan', icon: RefreshCw },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const { addToast } = useToast();

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-fw-surface border-r border-fw-border flex flex-col z-40 transition-all duration-200 ${
        sidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-fw-border">
        <div className="w-8 h-8 rounded-lg bg-fw-cyan/20 flex items-center justify-center flex-shrink-0">
          <Box size={18} className="text-fw-cyan" />
        </div>
        {!sidebarCollapsed && (
          <span className="font-display font-bold text-fw-text text-lg tracking-tight">
            FreightWare
          </span>
        )}
      </div>

      <button
        onClick={toggleSidebar}
        className="mx-3 mt-3 mb-1 p-2 rounded-md hover:bg-fw-surface-2 text-fw-text-muted hover:text-fw-text transition-colors"
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? (
          <PanelLeftOpen size={18} />
        ) : (
          <PanelLeftClose size={18} />
        )}
      </button>

      <nav className="flex-1 px-3 py-2 space-y-1" data-tour="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-150 group ${
                active
                  ? 'bg-fw-cyan/10 text-fw-cyan shadow-[0_0_20px_rgba(6,182,212,0.08)]'
                  : 'text-fw-text-dim hover:bg-fw-surface-2 hover:text-fw-text'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon size={20} className={active ? 'text-fw-cyan' : ''} />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}

        <div className="pt-2 border-t border-fw-border mt-2">
          <Link
            href="/tablet"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-fw-text-dim hover:bg-fw-surface-2 hover:text-fw-text transition-colors"
            title={sidebarCollapsed ? 'Tablet View' : undefined}
          >
            <Tablet size={20} />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">Tablet View</span>
            )}
          </Link>
        </div>
      </nav>

      <div className="px-3 pb-4 space-y-1">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full ${
            isActive('/settings')
              ? 'bg-fw-cyan/10 text-fw-cyan'
              : 'text-fw-text-muted hover:bg-fw-surface-2 hover:text-fw-text-dim'
          }`}
          title={sidebarCollapsed ? 'Settings' : undefined}
        >
          <Settings size={20} />
          {!sidebarCollapsed && (
            <span className="text-sm font-medium">Settings</span>
          )}
        </Link>

        {!sidebarCollapsed && (
          <p className="px-3 text-[10px] font-mono text-fw-text-muted uppercase tracking-wider">
            Prototype v0.1
          </p>
        )}
      </div>
    </aside>
  );
}
