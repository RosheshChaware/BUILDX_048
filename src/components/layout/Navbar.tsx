'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  MapPin,
  Activity,
  Play,
  Pause,
  ChevronDown,
  Bell,
  Radio,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import { UserRole } from '@/types';
import { NotificationDropdown } from '../common/NotificationDropdown';

const ROLES: { role: UserRole; label: string; icon: string }[] = [
  { role: 'CONTROL_ROOM', label: 'Control Room Operator', icon: '🏛️' },
  { role: 'CITIZEN', label: 'Citizen Interface', icon: '📱' },
  { role: 'HELP_DESK', label: 'Help Desk Operator', icon: '🟣' },
  { role: 'POLICE', label: 'Police Grid', icon: '👮' },
  { role: 'VOLUNTEER', label: 'Field Volunteer', icon: '🤝' },
  { role: 'ADMIN', label: 'Sys Admin', icon: '⚙️' },
];

const NAV_LINKS = [
  { name: 'SOC Overview', href: '/' },
  { name: 'Incident Registry', href: '/incidents' },
  { name: 'Missing Persons', href: '/missing-person' },
  { name: 'CCTV Grid', href: '/cctv' },
  { name: 'Crowd & Exits', href: '/crowd' },
  { name: 'Field Volunteers', href: '/volunteers' },
  { name: 'Emergency SOS', href: '/sos' },
];

const MORE_LINKS = [
  { name: 'Command Center', href: '/control-room' },
  { name: 'Sighting Verifier', href: '/sighting' },
  { name: 'Help Desk Matrix', href: '/help-desks' },
  { name: 'Police Sector', href: '/police' },
  { name: 'Shared-Auto Safety', href: '/vehicle-safety' },
  { name: 'Elderly Safety', href: '/elderly' },
  { name: 'Security Reports', href: '/security-report' },
  { name: 'Operations Analytics', href: '/analytics' },
  { name: 'Citizen Portal', href: '/citizen' },
  { name: 'System Settings', href: '/settings' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, setRole, toggleSimulation } = useSuraksha();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const currentRoleObj = ROLES.find((r) => r.role === state.currentRole) || ROLES[0];
  const isMoreActive = MORE_LINKS.some((item) => pathname === item.href);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B1324] border-b border-[#1C273E] text-slate-200">
      <div className="max-w-[1780px] mx-auto flex h-13 items-center justify-between px-3 sm:px-5">
        {/* Left: SURAKSHA-NET SOC Logo & Tactical Label */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-md bg-cyan-950 border border-cyan-700/80 flex items-center justify-center text-cyan-400 shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wider text-white">
                SURAKSHA<span className="text-cyan-400">-NET</span>
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 uppercase">
                SOC Control Room
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 pl-3 border-l border-[#1C273E]">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* More Modules Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition ${
                  isMoreActive
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span>More</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {moreDropdownOpen && (
                <div
                  className="absolute left-0 mt-1.5 w-48 rounded-lg bg-[#0F1A30] border border-[#1C273E] shadow-2xl py-1 z-50"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-slate-500 border-b border-[#1C273E]">
                    Additional Modules
                  </div>
                  {MORE_LINKS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs transition text-left ${
                          isActive
                            ? 'bg-cyan-950 text-cyan-300 font-semibold'
                            : 'text-slate-300 hover:bg-[#14203B]'
                        }`}
                      >
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right: Operational Status, Controls & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Venue Status */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0E172B] border border-[#1C273E] text-xs">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium text-slate-300">Deekshabhoomi Grid</span>
            <span className="text-slate-600 font-mono">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">MONITORING ACTIVE</span>
            </div>
          </div>

          {/* Simulation Toggle */}
          <button
            onClick={() => toggleSimulation()}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition ${
              state.simulationActive
                ? 'bg-emerald-950/70 border-emerald-700/80 text-emerald-300'
                : 'bg-[#0E172B] border-[#1C273E] text-slate-400'
            }`}
            title="Toggle Operational Simulation"
          >
            {state.simulationActive ? (
              <>
                <Pause className="w-3 h-3 text-emerald-400" />
                <span className="font-mono text-[11px]">SIM: LIVE</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span className="font-mono text-[11px]">SIM: PAUSED</span>
              </>
            )}
          </button>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#0E172B] hover:bg-[#14203B] border border-[#1C273E] text-xs font-medium text-slate-300 transition"
            >
              <span>{currentRoleObj.icon}</span>
              <span className="hidden md:inline">{currentRoleObj.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-52 rounded-lg bg-[#0F1A30] border border-[#1C273E] shadow-2xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-slate-500 border-b border-[#1C273E]">
                  Operational Role
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
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition text-left ${
                      state.currentRole === r.role
                        ? 'bg-cyan-950 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-[#14203B]'
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
