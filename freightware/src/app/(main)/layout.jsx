'use client';

import AppShell from '@/components/layout/AppShell';
import ChatBot from '@/components/shared/ChatBot';
import GuidedTour from '@/components/shared/GuidedTour';
import { useApp } from '@/context/AppContext';

export default function MainLayout({ children }) {
  const { tourActive, dismissTour } = useApp();

  return (
    <>
      <AppShell>{children}</AppShell>
      <ChatBot />
      <GuidedTour active={tourActive} onDismiss={dismissTour} />
    </>
  );
}
