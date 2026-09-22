'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { SimulationStarter } from '../common/SimulationStarter';
import { ThemeProvider } from '@/context/ThemeContext';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#090E1A] dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        <SimulationStarter />
        <Navbar />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto min-w-0 bg-slate-100/50 dark:bg-[#090E1A] transition-colors duration-200">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
