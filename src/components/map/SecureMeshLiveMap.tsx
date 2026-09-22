'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  AlertTriangle,
  Users,
  Camera,
  Shield,
  UserCheck,
  DoorOpen,
  PlusCircle,
  Maximize2,
  ExternalLink,
} from 'lucide-react';

interface IncidentItem {
  id: string;
  type: string;
  zone: string;
  time: string;
  color: string;
}

export function SecureMeshLiveMap() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const incidents: IncidentItem[] = [
    {
      id: 'INC-2048',
      type: 'Missing Child',
      zone: 'Zone B',
      time: '10:42 AM',
      color: 'text-red-600 bg-red-50 border-red-200',
    },
    {
      id: 'INC-2035',
      type: 'Chain Snatching',
      zone: 'Zone A',
      time: '09:15 AM',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      id: 'INC-2022',
      type: 'Suspicious Activity',
      zone: 'Zone C',
      time: '08:47 AM',
      color: 'text-orange-600 bg-orange-50 border-orange-200',
    },
  ];

  const legend = [
    { label: 'Incidents', icon: '▲', color: 'text-red-500' },
    { label: 'High Crowd', icon: '▲', color: 'text-amber-500' },
    { label: 'CCTV', icon: '🎥', color: 'text-blue-500' },
    { label: 'Police Post', icon: '🛡️', color: 'text-indigo-600' },
    { label: 'Volunteer', icon: '👤', color: 'text-emerald-500' },
    { label: 'Exit', icon: '🚪', color: 'text-teal-500' },
    { label: 'Help Desk', icon: '➕', color: 'text-purple-600' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col h-full">
      {/* Title & Subtitle */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Live Security Map</h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time overview of the entire event area.</p>
        </div>
        <Link
          href="/map"
          className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition"
        >
          <Maximize2 className="w-3 h-3" /> Full GIS
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative mt-3">
        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location, gate, or incident..."
          className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      {/* Interactive Map Canvas with Legend */}
      <div className="relative mt-3 flex-1 flex flex-col">
        <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
          {/* Tactical Vector Ground Map */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 260" preserveAspectRatio="none">
            {/* Background Roads & Ground */}
            <rect width="400" height="260" fill="#EBF2F7" />
            
            {/* River / Green lawn zones */}
            <path d="M 0,180 Q 150,220 280,170 T 400,210 L 400,260 L 0,260 Z" fill="#D5E8D4" opacity="0.7" />
            <path d="M 260,0 Q 320,100 400,120 L 400,0 Z" fill="#D5E8D4" opacity="0.6" />
            
            {/* Pathways & Roads */}
            <line x1="200" y1="0" x2="200" y2="260" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
            <line x1="0" y1="120" x2="400" y2="120" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
            <circle cx="200" cy="120" r="45" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="200" cy="120" r="28" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="200" cy="120" r="14" fill="#0284C7" opacity="0.15" />

            {/* High Crowd Heatmap Halo (Zone B) */}
            <ellipse cx="215" cy="115" rx="42" ry="32" fill="#F97316" opacity="0.32" />
            <ellipse cx="215" cy="115" rx="26" ry="20" fill="#EA580C" opacity="0.45" />

            {/* Zone Markers */}
            <text x="80" y="70" fill="#64748B" fontSize="13" fontWeight="bold">Zone A</text>
            <text x="210" y="80" fill="#0F172A" fontSize="13" fontWeight="bold">Zone B</text>
            <text x="310" y="170" fill="#64748B" fontSize="13" fontWeight="bold">Zone C</text>
          </svg>

          {/* Markers overlay */}
          {/* INC-2048 in Zone B */}
          <div className="absolute top-[38%] left-[54%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <div className="relative px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold shadow-md flex items-center gap-1 border border-white">
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>Zone B: INC-2048</span>
              </div>
            </div>
          </div>

          {/* High Crowd pill */}
          <div className="absolute top-[54%] left-[56%] -translate-x-1/2 -translate-y-1/2">
            <span className="px-2 py-0.5 rounded-full bg-orange-500/90 text-white text-[9px] font-bold shadow-sm backdrop-blur-xs">
              High Crowd
            </span>
          </div>

          {/* CCTV pin */}
          <div className="absolute top-[28%] left-[64%] w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shadow-sm">
            <Camera className="w-3 h-3" />
          </div>

          {/* Police pin */}
          <div className="absolute top-[68%] left-[45%] w-6 h-6 rounded-full bg-indigo-700 text-white flex items-center justify-center text-[10px] shadow-sm">
            <Shield className="w-3 h-3" />
          </div>

          {/* Volunteer pin */}
          <div className="absolute top-[72%] left-[70%] w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-sm">
            <UserCheck className="w-3 h-3" />
          </div>

          {/* Help Desk pin */}
          <div className="absolute top-[26%] left-[36%] w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] shadow-sm">
            <PlusCircle className="w-3 h-3" />
          </div>

          {/* Floating Map Legend on Right */}
          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-md rounded-lg border border-slate-200/80 p-2 text-[10px] shadow-sm space-y-1 z-10">
            {legend.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className={`text-[11px] ${item.color}`}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Incidents (5) List / Table */}
        <div className="mt-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <div className="text-xs font-bold text-slate-800">
              Active Incidents <span className="text-slate-400 font-normal">(5)</span>
            </div>
            <Link href="/incidents" className="text-[11px] font-semibold text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs mt-1">
            {incidents.map((inc) => (
              <Link
                key={inc.id}
                href={`/incidents/${inc.id}`}
                className="py-1.5 flex items-center justify-between hover:bg-slate-50 px-1 rounded transition"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${inc.id === 'INC-2048' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="font-bold text-slate-800">{inc.id}</span>
                  <span className="text-slate-600">{inc.type}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span>{inc.zone}</span>
                  <span className="font-mono">{inc.time}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
