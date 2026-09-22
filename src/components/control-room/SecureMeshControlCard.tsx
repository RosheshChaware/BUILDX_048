'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  UserX,
  Users,
  ShieldAlert,
  Flame,
  Radio,
  Maximize2,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';

export function SecureMeshControlCard() {
  const kpis = [
    {
      value: '12',
      label: 'Active Incidents',
      icon: AlertTriangle,
      bg: 'bg-red-50',
      border: 'border-red-200',
      textColor: 'text-red-700',
      numColor: 'text-red-600',
    },
    {
      value: '4',
      label: 'Missing Persons',
      icon: UserX,
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      textColor: 'text-purple-700',
      numColor: 'text-purple-600',
    },
    {
      value: '30',
      label: 'Active Volunteers',
      icon: Users,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      textColor: 'text-emerald-700',
      numColor: 'text-emerald-600',
    },
    {
      value: '7',
      label: 'Threat Alerts',
      icon: ShieldAlert,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      textColor: 'text-amber-700',
      numColor: 'text-amber-600',
    },
    {
      value: '3',
      label: 'High Crowd Zones',
      icon: Flame,
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      textColor: 'text-orange-700',
      numColor: 'text-orange-600',
    },
    {
      value: '2',
      label: 'SOS Requests',
      icon: Radio,
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      textColor: 'text-rose-700',
      numColor: 'text-rose-600',
    },
  ];

  const recentAlerts = [
    { text: 'SOS - Zone B', time: '2 min ago', color: 'bg-red-500' },
    { text: 'Crowd density high - Zone C', time: '5 min ago', color: 'bg-orange-500' },
    { text: 'Missing child - Zone A', time: '8 min ago', color: 'bg-amber-500' },
    { text: 'Volunteer assigned - INC-2048', time: '12 min ago', color: 'bg-emerald-500' },
  ];

  const timelineSteps = [
    { time: '10:42', label: 'Report received from citizen' },
    { time: '10:46', label: 'AI verification completed (87%)' },
    { time: '10:50', label: 'Related CCTV sighting found' },
    { time: '10:54', label: 'Volunteer V-102 assigned' },
    { time: '11:10', label: 'Child located', resolved: true },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col h-full">
      {/* Title & Subtitle */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Control Room Dashboard</h3>
          <p className="text-xs text-slate-500 mt-0.5">Complete situational view &amp; response coordination.</p>
        </div>
        <Link
          href="/control-room"
          className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition"
        >
          Open Hub <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* 6 Pastel KPI Cards Grid */}
      <div className="grid grid-cols-3 gap-2.5 mt-3.5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`p-2 rounded-xl border ${kpi.bg} ${kpi.border} flex items-center gap-2.5 transition hover:shadow-xs`}
            >
              <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-2xs shrink-0">
                <Icon className={`w-4 h-4 ${kpi.numColor}`} />
              </div>
              <div className="min-w-0">
                <div className={`text-base font-extrabold leading-none ${kpi.numColor}`}>
                  {kpi.value}
                </div>
                <div className="text-[10px] font-semibold text-slate-600 truncate mt-0.5">
                  {kpi.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini Live Map + Recent Alerts Split */}
      <div className="grid grid-cols-2 gap-3 mt-3.5 pt-3 border-t border-slate-100">
        {/* Left: Mini Live Map */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-800">Live Map (Control Room)</span>
            <Link href="/" className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold">
              Full View
            </Link>
          </div>
          <div className="relative h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
            {/* SVG radar preview */}
            <svg className="w-full h-full" viewBox="0 0 160 100">
              <rect width="160" height="100" fill="#F1F5F9" />
              <circle cx="80" cy="50" r="35" fill="#E2E8F0" opacity="0.6" />
              <circle cx="80" cy="50" r="20" fill="#CBD5E1" opacity="0.5" />
              <ellipse cx="85" cy="48" rx="22" ry="16" fill="#F97316" opacity="0.35" />
              <circle cx="80" cy="50" r="3" fill="#EF4444" />
              <circle cx="50" cy="35" r="2.5" fill="#3B82F6" />
              <circle cx="110" cy="65" r="2.5" fill="#10B981" />
            </svg>
            <span className="absolute bottom-1 left-2 text-[9px] font-mono text-slate-500 bg-white/80 px-1 rounded">
              CAM-FEED: OPTIMAL
            </span>
          </div>
        </div>

        {/* Right: Recent Alerts */}
        <div>
          <div className="text-xs font-bold text-slate-800 mb-1.5">Recent Alerts</div>
          <div className="space-y-1.5">
            {recentAlerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                <span className={`w-2 h-2 rounded-full ${alert.color} shrink-0 mt-1`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium leading-tight">{alert.text}</p>
                  <span className="text-[9px] text-slate-400 leading-tight">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Timeline (INC-2048) */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex-1 flex flex-col justify-end">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800">Incident Timeline (INC-2048)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Resolved
          </span>
        </div>

        <div className="relative pl-4 border-l border-slate-200 space-y-2 text-xs">
          {timelineSteps.map((step, i) => (
            <div key={i} className="relative flex items-center justify-between">
              <span
                className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full ${
                  step.resolved ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-red-400'
                }`}
              />
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-slate-500">{step.time}</span>
                <span className={`text-[11px] ${step.resolved ? 'font-bold text-emerald-800' : 'text-slate-700'}`}>
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
