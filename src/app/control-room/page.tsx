'use client';

import React from 'react';
import { KpiCards } from '@/components/control-room/KpiCards';
import { IncidentFeed } from '@/components/control-room/IncidentFeed';
import { CriticalAlerts } from '@/components/control-room/CriticalAlerts';
import { TelemetryBars } from '@/components/control-room/TelemetryBars';
import DynamicSecurityMap from '@/components/map/DynamicSecurityMap';
import { Shield, Radio, Sparkles, MapPin } from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';

export default function ControlRoomPage() {
  const { state } = useSuraksha();

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1750px] mx-auto bg-[#F1F5F9]">
      {/* Top Section: Control Room Header & Telemetry Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping"></span>
              Central Operations Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
              DEEKSHABHOOMI GROUND ZERO
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-agency coordination network connecting Citizens, Help Desks, Police Posts, and Volunteers.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold">SYSTEM HEALTH: 100% NOMINAL</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <KpiCards />

      {/* Main Command Center Layout: Left (Feed) - Center (Map) - Right (Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT: Live Incident Stream (3 cols) */}
        <div className="lg:col-span-3 h-[600px]">
          <IncidentFeed />
        </div>

        {/* CENTER: Tactical GIS Security Map (6 cols) */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>LIVE TACTICAL GIS SECURITY MAP (NAGPUR)</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">9 Security Layers Active</span>
          </div>
          <DynamicSecurityMap height="566px" />
        </div>

        {/* RIGHT: Critical Alerts & Rapid Response (3 cols) */}
        <div className="lg:col-span-3 h-[600px]">
          <CriticalAlerts />
        </div>
      </div>

      {/* Bottom Row: Crowd Analytics, Exit Flow, and Help Desk Status */}
      <div className="pt-2">
        <TelemetryBars />
      </div>
    </div>
  );
}
