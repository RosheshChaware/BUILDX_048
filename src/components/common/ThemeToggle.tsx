'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ showLabel = false, className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-200 select-none ${
        isDark
          ? 'bg-[#0E172B] hover:bg-[#15223E] border-[#1C273E] text-amber-300 hover:text-amber-200 shadow-2xs'
          : 'bg-white hover:bg-slate-100 border-slate-300 text-indigo-700 hover:text-indigo-900 shadow-2xs'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle dark and light theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-indigo-600 transition-transform duration-300 -rotate-12 hover:rotate-0" />
        )}
      </div>

      {showLabel ? (
        <span className="font-mono text-[11px] font-semibold tracking-wide">
          {isDark ? 'LIGHT' : 'DARK'}
        </span>
      ) : (
        <span className="hidden sm:inline font-mono text-[11px] font-semibold tracking-wide">
          {isDark ? 'LIGHT' : 'DARK'}
        </span>
      )}
    </button>
  );
}
