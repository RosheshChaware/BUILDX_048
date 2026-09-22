'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { SimulationBanner } from './SimulationBanner';
import { SimulationStarter } from '../common/SimulationStarter';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Provide full width canvas for the Master Board, Citizen Mobile view, and full Map
  const isFullWidth = pathname === '/' || pathname === '/citizen' || pathname === '/map';

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans">
      <SimulationStarter />
      <Navbar />
      <SimulationBanner />

      <div className="flex flex-1 overflow-hidden">
        {!isFullWidth && <Sidebar />}
        <main className="flex-1 overflow-y-auto min-w-0 bg-[#F1F5F9]">
          {children}
        </main>
      </div>
    </div>
  );
}
