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
  { name: 'SECUREMESH Master', href: '/', icon: LayoutDashboard, badge: 'Unified' },
  { name: 'Control Room Hub', href: '/control-room', icon: LayoutDashboard, badge: 'Live' },
  { name: 'Live Security Map', href: '/map', icon: MapPin },
  { name: 'Active Incidents', href: '/incidents', icon: AlertOctagon, dynamicBadge: true },
  { name: 'Missing Person / Object', href: '/missing-person', icon: UserX, alertCount: 3 },
  { name: 'Sighting Verifier', href: '/sighting', icon: Eye, highlight: true },
  { name: 'CCTV Feeds', href: '/cctv', icon: Camera, badge: '15 Feeds' },
  { name: 'Crowd Intelligence', href: '/crowd', icon: Users2, surgeAlert: true },
  { name: 'Help Desk Matrix', href: '/help-desks', icon: Building2, badge: '10 Desks' },
  { name: 'Police Command', href: '/police', icon: Shield },
  { name: 'Volunteer Coordination', href: '/volunteers', icon: HeartHandshake, badge: '20 Active' },
  { name: 'Shared-Auto Safety', href: '/vehicle-safety', icon: Car, alertBadge: 'GPS' },
  { name: 'Elderly Safety', href: '/elderly', icon: UserCheck2 },
  { name: 'Emergency SOS', href: '/sos', icon: AlertTriangle, emergency: true },
  { name: 'Threat Reports', href: '/security-report', icon: FileText },
  { name: 'Operations Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Citizen Mobile App', href: '/citizen', icon: Smartphone, citizen: true },
  { name: 'System Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { state } = useSuraksha();

  const activeIncidentsCount = state.incidents.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED'
  ).length;

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto hidden md:flex shadow-2xs">
      <div className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4">
        Platform Modules
      </div>

      <nav className="flex-1 px-2.5 space-y-1 pb-6">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                isActive
                  ? 'bg-cyan-50 text-cyan-900 border border-cyan-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              } ${item.emergency ? 'text-red-600 hover:text-red-700' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition ${
                    isActive
                      ? 'text-cyan-600'
                      : item.emergency
                      ? 'text-red-500'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {item.dynamicBadge && activeIncidentsCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 border border-red-200 text-red-700">
                  {activeIncidentsCount}
                </span>
              )}

              {item.badge && !item.dynamicBadge && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-slate-100 border border-slate-200 text-slate-600">
                  {item.badge}
                </span>
              )}

              {item.alertBadge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 border border-amber-300 text-amber-800 animate-pulse">
                  {item.alertBadge}
                </span>
              )}

              {item.surgeAlert && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer info widget */}
      <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
        <div className="flex items-center justify-between text-slate-800 font-bold">
          <span>Venue Status</span>
          <span className="text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-200">
            NORMAL OPS
          </span>
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
          <span>Deekshabhoomi Grid</span>
          <span>100% Connected</span>
        </div>
      </div>
    </aside>
  );
}
