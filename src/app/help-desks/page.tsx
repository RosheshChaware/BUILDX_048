'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  MapPin,
  Phone,
  ArrowRight,
  Shield,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import DynamicSecurityMap from '@/components/map/DynamicSecurityMap';

export default function HelpDesksPage() {
  const { state, transferIncident } = useSuraksha();

  const [selectedDeskId, setSelectedDeskId] = useState<string>('HD-02');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [incidentToTransfer, setIncidentToTransfer] = useState('');
  const [transferTargetDesk, setTransferTargetDesk] = useState('');
  const [transferReason, setTransferReason] = useState('');

  const selectedDesk = state.helpDesks.find((h) => h.id === selectedDeskId) || state.helpDesks[0];

  // Filter cases belonging to selected help desk
  const deskCases = state.incidents.filter(
    (inc) => inc.nearbyHelpDeskId === selectedDesk.id && inc.status !== 'RESOLVED' && inc.status !== 'CLOSED'
  );

  const handleTransfer = () => {
    if (!incidentToTransfer || !transferTargetDesk) return;
    transferIncident(incidentToTransfer, transferTargetDesk, transferReason || 'Load balancing between help desks');
    setShowTransferModal(false);
    setIncidentToTransfer('');
    setTransferReason('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Multi-Help-Desk Operations Grid
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            10 connected ground assistance kiosks coordinating pilgrim support, case handovers, and volunteer dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/report"
            className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Kiosk Intake Form</span>
          </Link>
        </div>
      </div>

      {/* 10 Help Desks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {state.helpDesks.map((hd) => {
          const isSelected = hd.id === selectedDesk.id;
          const isOverloaded = hd.status === 'OVERLOADED';
          const capacityPct = Math.round((hd.activeCasesCount / hd.capacity) * 100);

          return (
            <button
              key={hd.id}
              onClick={() => setSelectedDeskId(hd.id)}
              className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-950/70 border-purple-500 ring-1 ring-purple-400 text-white shadow-lg shadow-purple-950/40'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-mono font-black text-xs text-purple-300">{hd.id}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      isOverloaded
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {hd.status}
                  </span>
                </div>

                <div className="font-bold text-xs line-clamp-1 text-slate-100">{hd.name}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{hd.location}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400">Load</span>
                  <span className="font-mono font-bold text-white">
                    {hd.activeCasesCount} / {hd.capacity} ({capacityPct}%)
                  </span>
                </div>
                <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      capacityPct > 85 ? 'bg-red-500' : capacityPct > 60 ? 'bg-amber-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${Math.min(100, capacityPct)}%` }}
                  ></div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Help Desk In-Depth View & Cases Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 cols: Active cases on this desk & actions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono text-xs font-bold border border-purple-800">
                    {selectedDesk.id}
                  </span>
                  <h2 className="text-base font-bold text-white">{selectedDesk.name}</h2>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span>Lead: {selectedDesk.leadOperator}</span>
                  <span>Phone: {selectedDesk.phone}</span>
                  <span>Staff: {selectedDesk.operatorsCount} operators</span>
                </div>
              </div>

              <button
                onClick={() => setShowTransferModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Transfer Case</span>
              </button>
            </div>

            {/* Cases list */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Active Queue Cases ({deskCases.length})</span>
                <span className="text-[10px] text-slate-500 font-mono">Live Synchronized</span>
              </div>

              <div className="space-y-2">
                {deskCases.length === 0 ? (
                  <div className="p-8 rounded-xl bg-slate-950/40 text-center text-xs text-slate-500">
                    No active cases pending at this help desk. All cases resolved or reassigned.
                  </div>
                ) : (
                  deskCases.map((inc) => (
                    <div
                      key={inc.id}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-cyan-400">{inc.id}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            {inc.type}
                          </span>
                          <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">
                            {inc.status}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-200 truncate">{inc.title}</div>
                        <div className="text-[11px] text-slate-400">{inc.location} ({inc.timestamp})</div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/incidents/${inc.id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 transition"
                        >
                          Manage Case
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Help Desk Map locus & quick links */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {selectedDesk.name} Locus
            </span>
            <DynamicSecurityMap
              height="360px"
              focusedCoords={selectedDesk.coords}
              zoom={17}
              interactive={true}
            />
          </div>
        </div>
      </div>

      {/* Modal: Transfer case between desks */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Transfer Case Across Help Desks</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Select Incident to Transfer</label>
              <select
                value={incidentToTransfer}
                onChange={(e) => setIncidentToTransfer(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="">Select Incident...</option>
                {state.incidents.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.id} - {i.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Help Desk Kiosk</label>
              <select
                value={transferTargetDesk}
                onChange={(e) => setTransferTargetDesk(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="">Select Destination Help Desk...</option>
                {state.helpDesks.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} (Active cases: {h.activeCasesCount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Reason for Handover</label>
              <input
                type="text"
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                placeholder="e.g. Pilgrim family relocated to Gate 4 concourse..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={!incidentToTransfer || !transferTargetDesk}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold"
              >
                Execute Handover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
