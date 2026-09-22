'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { SimulationStarter } from '../common/SimulationStarter';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#090E1A] text-slate-100 flex flex-col font-sans">
      <SimulationStarter />
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto min-w-0 bg-[#090E1A]">
          {children}
        </main>
      </div>
    </div>
  );
}
