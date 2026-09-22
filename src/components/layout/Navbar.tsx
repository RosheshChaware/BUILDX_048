'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  MapPin,
  Search,
  Activity,
  Play,
  Pause,
  UserCheck,
  ChevronDown,
  RotateCcw,
  Bell,
  Menu,
  X,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import { UserRole } from '@/types';
import { NotificationDropdown } from '../common/NotificationDropdown';

const ROLES: { role: UserRole; label: string; icon: string }[] = [
  { role: 'CONTROL_ROOM', label: 'Control Room', icon: '🏛️' },
  { role: 'CITIZEN', label: 'Citizen View', icon: '📱' },
  { role: 'HELP_DESK', label: 'Help Desk', icon: '🟣' },
  { role: 'POLICE', label: 'Police Grid', icon: '👮' },
  { role: 'VOLUNTEER', label: 'Field Volunteer', icon: '🤝' },
  { role: 'ADMIN', label: 'Sys Admin', icon: '⚙️' },
];

const NAV_SHORTCUTS = [
  { name: 'Dashboard', href: '/' },
  { name: 'Control Room', href: '/control-room' },
  { name: 'Live Map', href: '/map' },
  { name: 'Missing Persons', href: '/missing-person' },
  { name: 'CCTV Feeds', href: '/cctv' },
  { name: 'Volunteers', href: '/volunteers' },
  { name: 'Citizen Portal', href: '/citizen' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, setRole, toggleSimulation, resetToDefaults } = useSuraksha();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentRoleObj = ROLES.find((r) => r.role === state.currentRole) || ROLES[0];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B1528] border-b border-slate-800 text-white shadow-md">
      <div className="max-w-[1720px] mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: SECUREMESH Brand + Tagline */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-inner group-hover:scale-105 transition">
              <Shield className="w-5 h-5 text-cyan-400 fill-cyan-400/30" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-wider text-white flex items-center">
                SECURE<span className="text-cyan-400">MESH</span>
              </span>
            </div>
          </Link>

          {/* Tagline as seen in image */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-300 font-medium pl-3 border-l border-slate-700/70">
            <span>Connected People</span>
            <span className="text-slate-600 font-normal">|</span>
            <span>Smarter Surveillance</span>
            <span className="text-slate-600 font-normal">|</span>
            <span>Safer Gatherings</span>
          </div>
        </div>

        {/* Center: Navigation shortcuts */}
        <nav className="hidden xl:flex items-center gap-1">
          {NAV_SHORTCUTS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Venue Indicator & Controls */}
        <div className="flex items-center gap-4">
          {/* Deekshabhoomi Location Pin */}
          <div className="flex items-center gap-2.5 pl-3 pr-4 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-right">
            <MapPin className="w-5 h-5 text-cyan-400 shrink-0 animate-bounce" />
            <div className="text-left">
              <div className="text-xs font-bold text-white leading-tight">Deekshabhoomi</div>
              <div className="text-[10px] text-slate-400 leading-tight">
                Large Event Security &amp; Coordination Platform
              </div>
            </div>
          </div>

          {/* Simulation Toggle */}
          <button
            onClick={() => toggleSimulation()}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
              state.simulationActive
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle Automated Security Simulation"
          >
            {state.simulationActive ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Sim Running</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Sim Paused</span>
              </>
            )}
          </button>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              <span>{currentRoleObj.icon}</span>
              <span className="hidden sm:inline">{currentRoleObj.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Switch Active Role
                </div>
                {ROLES.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setRole(r.role);
                      setRoleDropdownOpen(false);
                      if (r.role === 'CITIZEN') router.push('/citizen');
                      else if (r.role === 'HELP_DESK') router.push('/help-desks');
                      else if (r.role === 'POLICE') router.push('/police');
                      else if (r.role === 'VOLUNTEER') router.push('/volunteers');
                      else router.push('/control-room');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition text-left ${
                      state.currentRole === r.role
                        ? 'bg-cyan-950/60 text-cyan-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{r.icon}</span>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
