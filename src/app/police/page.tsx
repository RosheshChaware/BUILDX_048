'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Phone,
  Car,
  Users,
  AlertTriangle,
  Radio,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';

export default function PoliceCommandPage() {
  const { state } = useSuraksha();

  const [selectedPostId, setSelectedPostId] = useState<string>('PP-01');

  const selectedPost =
    state.policePosts.find((p) => p.id === selectedPostId) || state.policePosts[0];

  const totalOfficers = state.policePosts.reduce((acc, p) => acc + p.officersCount, 0);
  const totalVehicles = state.policePosts.reduce((acc, p) => acc + p.vehicleUnits, 0);

  // Filter security incidents
  const securityIncidents = state.incidents.filter(
    (i) =>
      i.type === 'THEFT' ||
      i.type === 'HARASSMENT' ||
      i.type === 'SUSPICIOUS_ACTIVITY' ||
      i.severity === 'CRITICAL'
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Nagpur Police Sector Command
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            8 Police Posts, Anti-Chain Snatching Flying Squads, Damini Squad, and Quick Response Teams.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Total Force: <strong className="text-blue-400">{totalOfficers} Officers</strong> • {totalVehicles} Vehicles
          </div>
        </div>
      </div>

      {/* Police Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {state.policePosts.map((pp) => {
          const isSelected = pp.id === selectedPost.id;
          return (
            <button
              key={pp.id}
              onClick={() => setSelectedPostId(pp.id)}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-950/70 border-blue-500 ring-1 ring-blue-400 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-xs text-blue-300">{pp.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                    {pp.status}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-white line-clamp-1">{pp.name}</h3>
                <div className="text-[10px] text-slate-400 mt-1">{pp.location}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
                <span>{pp.officersCount} Officers</span>
                <span className="text-blue-400 font-mono">{pp.activeResponses} Active Calls</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Post Details & Active Crime Incidents Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 6 cols: Post Details */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-blue-400">{selectedPost.id}</span>
              <h2 className="text-base font-bold text-white">{selectedPost.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">In-Charge: {selectedPost.inCharge}</p>
            </div>
            <span className="px-3 py-1 rounded bg-blue-950 border border-blue-800 text-xs font-mono text-blue-300">
              {selectedPost.activeResponses} Dispatched
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Officers Stationed</span>
              <span className="text-base font-bold text-white font-mono">
                {selectedPost.officersCount} Personnel
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">PCR Mobile Vehicles</span>
              <span className="text-base font-bold text-white font-mono">
                {selectedPost.vehicleUnits} Units
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-300 space-y-1 pt-1">
            <div>
              <span className="text-slate-500">Contact Line:</span>{' '}
              <strong className="text-cyan-400 font-mono">{selectedPost.contact}</strong>
            </div>
            <div>
              <span className="text-slate-500">Jurisdiction Sector:</span>{' '}
              <span>{selectedPost.location}</span>
            </div>
          </div>
        </div>

        {/* Right 6 cols: Law Enforcement Case Queue */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Priority Security & Crime Interventions ({securityIncidents.length})</span>
            </h2>
          </div>

          <div className="space-y-2.5">
            {securityIncidents.map((inc) => (
              <div
                key={inc.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-cyan-400">{inc.id}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-950 text-red-300 border border-red-800">
                      {inc.severity}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">
                      {inc.type}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate">{inc.title}</div>
                  <div className="text-[11px] text-slate-400">{inc.location}</div>
                </div>

                <Link
                  href={`/incidents/${inc.id}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shrink-0"
                >
                  Police Action
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
