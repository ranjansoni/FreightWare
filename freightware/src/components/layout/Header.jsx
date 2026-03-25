'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, Sparkles, HelpCircle, User } from 'lucide-react';
import { useToast } from '@/components/shared/ToastProvider';
import { useApp } from '@/context/AppContext';
import SavingsTicker from '@/components/layout/SavingsTicker';
import { notifications } from '@/data/mockNotifications';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/shipments': 'Shipments',
  '/optimizer': 'Optimizer',
  '/loadplan': 'Load Plan',
  '/replan': 'Replan',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

const NOTIF_ICONS = {
  warning: '⚠️',
  alert: '🔔',
  success: '✅',
};

export default function Header() {
  const pathname = usePathname();
  const { addToast } = useToast();
  const { startTour } = useApp();
  const [quantumOn, setQuantumOn] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const pageTitle = PAGE_TITLES[pathname] || 'FreightWare';
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuantumToggle = () => {
    if (!quantumOn) {
      addToast(
        'Quantum acceleration not yet available for your plan',
        'warning'
      );
    }
    setQuantumOn(false);
  };

  return (
    <header className="h-16 bg-fw-surface border-b border-fw-border flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-display font-semibold text-fw-text">
          {pageTitle}
        </h1>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-fw-text-muted"
          />
          <input
            type="text"
            placeholder="Search shipments, containers..."
            className="w-full bg-fw-bg border border-fw-border rounded-md pl-9 pr-4 py-2 text-sm text-fw-text placeholder:text-fw-text-muted focus:outline-none focus:border-fw-cyan/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.1)]"
            readOnly
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SavingsTicker />

        <button
          onClick={handleQuantumToggle}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-fw-border text-fw-text-muted hover:border-fw-purple/40 transition-colors"
          title="Coming 2027 — D-Wave quantum annealing for complex multi-container optimization"
        >
          <Sparkles size={14} className="text-fw-purple opacity-50" />
          <span className="text-xs font-mono">Quantum</span>
          <div className="w-8 h-4 bg-fw-bg rounded-full relative border border-fw-border">
            <div className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-fw-text-muted transition-transform" />
          </div>
        </button>

        <button
          onClick={startTour}
          className="p-2 rounded-md hover:bg-fw-surface-2 text-fw-text-dim hover:text-fw-cyan transition-colors"
          title="Take a guided tour"
        >
          <HelpCircle size={20} />
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-md hover:bg-fw-surface-2 text-fw-text-dim hover:text-fw-text transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-fw-red rounded-full text-[10px] font-mono font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-fw-surface border border-fw-border rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-fw-border">
                <h3 className="text-sm font-semibold text-fw-text">
                  Notifications
                </h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-fw-border/50 hover:bg-fw-surface-2 transition-colors ${
                      !notif.read ? 'bg-fw-bg/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sm mt-0.5">
                        {NOTIF_ICONS[notif.type]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-fw-text">
                          {notif.title}
                        </p>
                        <p className="text-xs text-fw-text-dim mt-0.5 truncate">
                          {notif.message}
                        </p>
                        <p className="text-xs text-fw-text-muted mt-1">
                          {notif.time}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-fw-cyan mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="w-9 h-9 rounded-full bg-fw-cyan-dim flex items-center justify-center cursor-default"
          title="Pacific Coast Logistics — Operations"
        >
          <span className="text-xs font-mono font-bold text-white">PCL</span>
        </div>
      </div>
    </header>
  );
}
