'use client';

import React from 'react';
import {
  Users,
  DoorOpen,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import DynamicSecurityMap from '@/components/map/DynamicSecurityMap';

export default function CrowdIntelligencePage() {
  const { state, executeCrowdDiversion } = useSuraksha();

  const totalCrowd = state.crowdZones.reduce((acc, z) => acc + z.currentCount, 0);
  const totalSafeCapacity = state.crowdZones.reduce((acc, z) => acc + z.maxSafeCapacity, 0);
  const totalFlowIn = state.exitGates.reduce((acc, e) => acc + e.entryFlowPerMin, 0);
  const totalFlowOut = state.exitGates.reduce((acc, e) => acc + e.exitFlowPerMin, 0);

  const criticalExit = state.exitGates.find((e) => e.riskLevel === 'CRITICAL');

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Crowd Intelligence & Exit Risk Analysis
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time pedestrian density heatmaps, choke-point flux tracking, and automated diversion triggers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>TOTAL ON-SITE: <strong className="text-white">{totalCrowd.toLocaleString()}</strong> PAX</span>
          </div>
        </div>
      </div>

      {/* Critical Exit Alert Banner if any exit exceeds threshold */}
      {criticalExit && (
        <div className="p-4 rounded-2xl bg-red-950/70 border-2 border-red-500 text-white shadow-xl shadow-red-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400 shrink-0" />
            <div>
              <div className="font-extrabold text-sm text-red-200">
                CRITICAL THRESHOLD VIOLATION: {criticalExit.name.toUpperCase()}
              </div>
              <p className="text-xs text-red-200/90 mt-0.5">
                Congestion reached <strong>{criticalExit.congestionPct}%</strong> ({criticalExit.currentCrowd.toLocaleString()} people in 5,000 capacity gate). {criticalExit.recommendedAction}
              </p>
            </div>
          </div>

          <button
            onClick={() => executeCrowdDiversion(criticalExit.id)}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg flex items-center gap-2 shrink-0 transition"
          >
            <span>Execute Diversion Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Gathering Count
          </span>
          <div className="text-2xl font-black font-mono text-white">
            {totalCrowd.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Venue Safe Cap: {totalSafeCapacity.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Pedestrian Inflow
          </span>
          <div className="text-2xl font-black font-mono text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-5 h-5" />
            <span>+{totalFlowIn}/min</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Across 4 main gates</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Pedestrian Outflow
          </span>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {totalFlowOut}/min
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Steady outbound dispersal</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Exit 3 Risk Status
          </span>
          <div className="text-2xl font-black font-mono text-red-400">
            {criticalExit ? 'CRITICAL (RED)' : 'NORMAL (GREEN)'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">AI automated monitoring</div>
        </div>
      </div>

      {/* 5 Major Exit Gates Dedicated Analysis Grid (Section 12) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <DoorOpen className="w-4 h-4 text-orange-400" />
            <span>Dedicated Exit Risk Analysis (5 Gates)</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">Sensors polling every 3.5s</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.exitGates.map((gate) => {
            const isCritical = gate.riskLevel === 'CRITICAL';
            const isElevated = gate.riskLevel === 'ELEVATED';

            return (
              <div
                key={gate.id}
                className={`p-5 rounded-2xl border shadow-xl flex flex-col justify-between space-y-3 transition ${
                  isCritical
                    ? 'bg-red-950/40 border-red-500 shadow-red-950/40'
                    : isElevated
                    ? 'bg-amber-950/20 border-amber-500/80'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="font-mono font-bold text-xs text-cyan-300">{gate.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        isCritical
                          ? 'bg-red-600 text-white animate-pulse'
                          : isElevated
                          ? 'bg-amber-600 text-white'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {gate.congestionPct}% CONGESTED
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white">{gate.name}</h3>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Crowd:</span>
                      <span className="font-mono font-bold text-white">
                        {gate.currentCrowd.toLocaleString()} / {gate.capacity.toLocaleString()} safe cap
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gate Flux:</span>
                      <span className="font-mono text-cyan-400">
                        +{gate.entryFlowPerMin}/m in | -{gate.exitFlowPerMin}/m out
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
                    <strong className="text-slate-400 block mb-0.5">AI Recommendation:</strong>
                    {gate.recommendedAction}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {isCritical ? (
                    <button
                      onClick={() => executeCrowdDiversion(gate.id)}
                      className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                    >
                      <span>Execute Immediate Diversion</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Flow within normal threshold</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 10 Crowd Zones Heatmap & GIS Map View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 6 cols: Zone Density Breakdown */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>10 Gathering Zones Density Breakdown</span>
            </h2>
          </div>

          <div className="space-y-3">
            {state.crowdZones.map((zone) => {
              const pct = Math.min(100, Math.round((zone.currentCount / zone.maxSafeCapacity) * 100));
              const color =
                zone.riskColor === 'RED'
                  ? 'bg-red-500'
                  : zone.riskColor === 'ORANGE'
                  ? 'bg-orange-500'
                  : zone.riskColor === 'YELLOW'
                  ? 'bg-yellow-500'
                  : 'bg-emerald-500';

              return (
                <div key={zone.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-bold text-slate-200">{zone.name}</span>
                    <span className="font-mono text-slate-300">
                      <strong className="text-white">{zone.currentCount.toLocaleString()}</strong> /{' '}
                      {zone.maxSafeCapacity.toLocaleString()} ({pct}%)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden mb-1">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${color}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Level: {zone.densityLevel}</span>
                    <span>Trend: {zone.trend}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 cols: Interactive GIS Map with Crowd Heat Layer */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
            <span>LIVE PERIMETER CROWD MAP</span>
            <span className="text-emerald-400 font-mono">Heatmap Active</span>
          </div>
          <DynamicSecurityMap height="550px" />
        </div>
      </div>
    </div>
  );
}
