'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  Battery,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  UserCheck,
  Search,
  ArrowRight,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import { Volunteer } from '@/types';

export default function VolunteersPage() {
  const { state, assignResponder } = useSuraksha();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedIncidentForDispatch, setSelectedIncidentForDispatch] = useState(
    state.incidents.find((i) => !i.assignedResponder)?.id || state.incidents[0]?.id || ''
  );

  const filteredVolunteers = state.volunteers.filter((v) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!v.name.toLowerCase().includes(q) && !v.id.toLowerCase().includes(q) && !v.zone.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
    return true;
  });

  const handleQuickDispatch = (volunteer: Volunteer) => {
    if (!selectedIncidentForDispatch) {
      alert('Please select an active incident from the dropdown above');
      return;
    }

    assignResponder(
      selectedIncidentForDispatch,
      {
        id: volunteer.id,
        name: volunteer.name,
        type: 'VOLUNTEER',
        phone: volunteer.phone,
        distanceMeters: Math.floor(120 + Math.random() * 350),
      },
      'Volunteer Coordinator'
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Field Volunteer Coordination Roster
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            20 active volunteers deployed for lost child search, medical first aid, and crowd guidance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold shadow-2xs">
            {state.volunteers.filter((v) => v.status === 'AVAILABLE').length} Available for Dispatch
          </span>
        </div>
      </div>

      {/* Smart Dispatch Selection Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-800 font-bold whitespace-nowrap">Target Incident:</span>
          <select
            value={selectedIncidentForDispatch}
            onChange={(e) => setSelectedIncidentForDispatch(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 w-full sm:w-80"
          >
            {state.incidents.map((i) => (
              <option key={i.id} value={i.id}>
                {i.id} - {i.title.slice(0, 40)}... ({i.severity})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search volunteer name or zone..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium"
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="RESPONDING">Responding</option>
            <option value="BUSY">Busy</option>
          </select>
        </div>
      </div>

      {/* Volunteer Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredVolunteers.map((v) => {
          const isAvailable = v.status === 'AVAILABLE';
          const isAssigned = v.status === 'ASSIGNED' || v.status === 'RESPONDING';

          return (
            <div
              key={v.id}
              className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between space-y-3 transition ${
                isAssigned
                  ? 'bg-amber-50/50 border-amber-300'
                  : isAvailable
                  ? 'bg-white border-slate-200 hover:shadow-md'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-700">{v.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono border ${
                        isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isAssigned
                          ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono font-medium">
                    <Battery className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{v.batteryPct}%</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900">{v.name}</h3>

                <div className="text-xs text-slate-500 space-y-1 mt-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="truncate">Zone: {v.zone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="font-mono">{v.phone}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {v.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[9px] font-medium bg-slate-100 border border-slate-200 text-slate-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {v.assignedIncidentId && (
                  <div className="mt-2.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-800">
                    Assigned to: <strong className="font-mono">{v.assignedIncidentId}</strong> (
                    {v.assignedDistanceMeters || 140}m away)
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100">
                {isAvailable ? (
                  <button
                    onClick={() => handleQuickDispatch(v)}
                    className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <span>Dispatch to Selected Case</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <div className="text-center text-[10px] text-slate-400 italic py-1">
                    Currently engaged in field action
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
