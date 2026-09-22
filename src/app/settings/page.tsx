'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  FileText,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import { UserRole } from '@/types';

export default function SettingsPage() {
  const {
    state,
    setRole,
    toggleSimulation,
    setSimulationSpeed,
    resetToDefaults,
  } = useSuraksha();

  const [surgeThreshold, setSurgeThreshold] = useState(85);
  const [dataMasking, setDataMasking] = useState(true);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">
              System Configuration & Audit Operations
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Realtime simulation controls, access control matrices, and immutable audit logs.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset entire system state back to default mock dataset?')) {
              resetToDefaults();
            }
          }}
          className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-bold transition flex items-center gap-1.5 shadow"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Demo Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Live Simulation Settings */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Live Simulation Controls</span>
            </h2>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                state.simulationActive
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {state.simulationActive ? 'ACTIVE' : 'PAUSED'}
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="font-bold text-slate-200 block">Simulation Heartbeat</span>
                <span className="text-slate-400 text-[11px]">
                  Simulates random crowd shifts, volunteer movement, and vehicle drift.
                </span>
              </div>
              <button
                onClick={() => toggleSimulation()}
                className={`px-4 py-1.5 rounded-lg font-bold transition ${
                  state.simulationActive
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {state.simulationActive ? 'Pause Sim' : 'Resume Sim'}
              </button>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Simulation Heartbeat Speed: {state.simulationSpeed}x
              </label>
              <div className="flex gap-2">
                {[1, 2, 5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSimulationSpeed(speed)}
                    className={`flex-1 py-1.5 rounded-lg border font-mono font-bold transition ${
                      state.simulationSpeed === speed
                        ? 'bg-cyan-600 text-white border-cyan-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {speed}x Speed
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Security Thresholds & Access Control */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Thresholds & Privacy Governance</span>
          </h2>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-300">Exit Surge Alarm Trigger</span>
                <span className="font-mono text-cyan-400 font-bold">{surgeThreshold}% Capacity</span>
              </div>
              <input
                type="range"
                min="50"
                max="98"
                value={surgeThreshold}
                onChange={(e) => setSurgeThreshold(parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Automatically flags exits in RED Code and recommends diversion routing.
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="font-bold text-slate-200 block">Citizen Privacy Masking</span>
                <span className="text-slate-400 text-[11px]">
                  Mask sensitive phone numbers & medical records in public portal views.
                </span>
              </div>
              <button
                onClick={() => setDataMasking(!dataMasking)}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  dataMasking ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {dataMasking ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. System Audit Log Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Tamper-Evident Operations Audit Trail</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {state.auditLogs.length} Events Logged
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Actor & Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target ID</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {state.auditLogs.slice(0, 15).map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-white font-sans font-semibold">{log.actor}</span>
                    <span className="text-[10px] text-slate-500 block">({log.role})</span>
                  </td>
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">{log.action}</td>
                  <td className="py-2.5 px-3 text-purple-400">{log.targetId}</td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
