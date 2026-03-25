'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/shared/PageTransition';
import { useApp } from '@/context/AppContext';

export default function AppShell({ children }) {
  const { sidebarCollapsed } = useApp();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-fw-bg">
      <Sidebar />
      <div
        className={`transition-all duration-200 ${
          sidebarCollapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        <Header />
        <main className="p-6">
          <PageTransition key={pathname}>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
