'use client';

import React from 'react';
import Link from 'next/link';
import { useSuraksha } from '@/hooks/useSuraksha';
import { Users, DoorOpen, Building, ArrowUpRight } from 'lucide-react';

export function TelemetryBars() {
  const { state } = useSuraksha();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Zone Density Telemetry */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Crowd Zone Densities
            </span>
          </div>
          <Link
            href="/crowd"
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Analytics <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {state.crowdZones.slice(0, 5).map((zone) => {
            const pct = Math.min(100, Math.round((zone.currentCount / zone.maxSafeCapacity) * 100));
            const barColor =
              zone.riskColor === 'RED'
                ? 'bg-red-500'
                : zone.riskColor === 'ORANGE'
                ? 'bg-orange-500'
                : zone.riskColor === 'YELLOW'
                ? 'bg-yellow-500'
                : 'bg-emerald-500';

            return (
              <div key={zone.id}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-700 font-medium truncate max-w-[180px]">
                    {zone.name.split(' ')[0]} {zone.name.split(' ')[1]} {zone.name.split(' ')[2]}
                  </span>
                  <span className="text-slate-500 font-mono">
                    <strong className="text-slate-800">{zone.currentCount.toLocaleString()}</strong> /{' '}
                    {zone.maxSafeCapacity.toLocaleString()} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Exit Flow & Congestion Status */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DoorOpen className="w-4 h-4 text-orange-600" />
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Exit Gates Flux &amp; Risk
            </span>
          </div>
          <Link
            href="/crowd"
            className="text-[11px] font-semibold text-orange-600 hover:text-orange-800 flex items-center gap-1"
          >
            Monitor <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {state.exitGates.map((gate) => {
            const isCritical = gate.riskLevel === 'CRITICAL';
            const badgeColor =
              isCritical
                ? 'bg-red-50 text-red-700 border-red-200'
                : gate.riskLevel === 'ELEVATED'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200';

            return (
              <div
                key={gate.id}
                className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-slate-800">{gate.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    Flow: {gate.entryFlowPerMin}/m in | {gate.exitFlowPerMin}/m out
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${badgeColor}`}
                  >
                    {gate.congestionPct}% FULL
                  </span>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                    {gate.currentCrowd.toLocaleString()} pax
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Help Desk Workload Status */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Help Desk Workload Matrix
            </span>
          </div>
          <Link
            href="/help-desks"
            className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            All 10 Desks <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {state.helpDesks.slice(0, 6).map((hd) => (
            <div
              key={hd.id}
              className="p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1">
                <span>{hd.id}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                    hd.status === 'OVERLOADED'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {hd.status}
                </span>
              </div>
              <div className="text-[10px] text-slate-500">
                Active: <strong className="text-slate-800 font-mono">{hd.activeCasesCount}</strong> /{' '}
                {hd.capacity}
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">Staff: {hd.operatorsCount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
