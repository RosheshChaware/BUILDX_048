'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  AlertOctagon,
  UserX,
  Eye,
  Camera,
  Users2,
  Building2,
  Shield,
  HeartHandshake,
  Car,
  UserCheck2,
  AlertTriangle,
  FileText,
  BarChart3,
  Smartphone,
  Settings,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';

export const NAVIGATION_ITEMS = [
  { name: 'SOC Overview', href: '/', icon: LayoutDashboard, badge: 'Main' },
  { name: 'Command Center', href: '/control-room', icon: LayoutDashboard, badge: 'Live' },
  { name: 'Incident Registry', href: '/incidents', icon: AlertOctagon, dynamicBadge: true },
  { name: 'Missing Persons', href: '/missing-person', icon: UserX, alertCount: 3 },
  { name: 'Sighting Verifier', href: '/sighting', icon: Eye, highlight: true },
  { name: 'CCTV Grid', href: '/cctv', icon: Camera, badge: '15 Feeds' },
  { name: 'Crowd & Exits', href: '/crowd', icon: Users2, surgeAlert: true },
  { name: 'Help Desk Matrix', href: '/help-desks', icon: Building2, badge: '10 Desks' },
  { name: 'Police Sector', href: '/police', icon: Shield },
  { name: 'Field Volunteers', href: '/volunteers', icon: HeartHandshake, badge: '20 Active' },
  { name: 'Shared-Auto Safety', href: '/vehicle-safety', icon: Car, alertBadge: 'GPS' },
  { name: 'Elderly Safety', href: '/elderly', icon: UserCheck2 },
  { name: 'Emergency SOS', href: '/sos', icon: AlertTriangle, emergency: true },
  { name: 'Security Reports', href: '/security-report', icon: FileText },
  { name: 'Operations Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Citizen Interface', href: '/citizen', icon: Smartphone, citizen: true },
  { name: 'System Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { state } = useSuraksha();

  const activeIncidentsCount = state.incidents.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED'
  ).length;

  return (
    <aside className="w-56 shrink-0 border-r border-[#1C273E] bg-[#0B1324] flex flex-col h-[calc(100vh-3.25rem)] sticky top-13 select-none overflow-y-auto hidden md:flex">
      <div className="p-2.5 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider px-3">
        SOC Modules
      </div>

      <nav className="flex-1 px-2 space-y-0.5 pb-4">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded transition ${
                isActive
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0F1A30] border border-transparent'
              } ${item.emergency ? 'text-red-400 hover:text-red-300' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={`w-3.5 h-3.5 transition ${
                    isActive
                      ? 'text-cyan-400'
                      : item.emergency
                      ? 'text-red-400'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {item.dynamicBadge && activeIncidentsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded bg-red-950 border border-red-800 text-red-300">
                  {activeIncidentsCount}
                </span>
              )}

              {item.badge && !item.dynamicBadge && (
                <span className="px-1 py-0.2 text-[9px] font-mono rounded bg-slate-900 border border-[#1C273E] text-slate-400">
                  {item.badge}
                </span>
              )}

              {item.alertBadge && (
                <span className="px-1 py-0.2 text-[9px] font-mono font-bold rounded bg-amber-950 border border-amber-800 text-amber-300 animate-pulse">
                  {item.alertBadge}
                </span>
              )}

              {item.surgeAlert && (
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info Widget */}
      <div className="p-2 mx-2 mb-2 rounded bg-[#0E172B] border border-[#1C273E] text-[10px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between text-slate-300 font-medium">
          <span>Grid Security</span>
          <span className="text-emerald-400 font-mono font-bold text-[9px]">NORMAL OPS</span>
        </div>
        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
          <span>Deekshabhoomi Grid</span>
          <span>100% Online</span>
        </div>
      </div>
    </aside>
  );
}
