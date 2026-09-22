'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Clock, MapPin, User, ChevronRight, Filter } from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import { IncidentType, Severity } from '@/types';

export function IncidentFeed() {
  const { state } = useSuraksha();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredIncidents = state.incidents.filter((inc) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'ACTIVE') return inc.status !== 'RESOLVED' && inc.status !== 'CLOSED';
    if (filterType === 'MISSING') return inc.type === 'MISSING_PERSON';
    if (filterType === 'SECURITY')
      return inc.type === 'THEFT' || inc.type === 'SUSPICIOUS_ACTIVITY' || inc.type === 'HARASSMENT';
    if (filterType === 'CRITICAL') return inc.severity === 'CRITICAL';
    return true;
  });

  const getSeverityBadge = (sev: Severity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESPONDING':
        return 'text-amber-600 font-bold';
      case 'RESOLVED':
        return 'text-emerald-600 font-bold';
      case 'VERIFIED':
        return 'text-blue-600 font-bold';
      default:
        return 'text-slate-500 font-bold';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></div>
          <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            Live Incident Stream
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
            {filteredIncidents.length}
          </span>
        </div>
        <Link
          href="/report"
          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition"
        >
          + New Report
        </Link>
      </div>

      {/* Filter Chips */}
      <div className="px-3 py-2 border-b border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-[11px]">
        {['ALL', 'ACTIVE', 'CRITICAL', 'MISSING', 'SECURITY'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-2.5 py-0.5 rounded-full font-semibold whitespace-nowrap transition ${
              filterType === f
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[520px]">
        {filteredIncidents.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No matching incidents</div>
        ) : (
          filteredIncidents.map((inc) => (
            <Link
              key={inc.id}
              href={`/incidents/${inc.id}`}
              className="p-3.5 block hover:bg-slate-50/80 transition group"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-xs text-blue-600">{inc.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getSeverityBadge(
                      inc.severity
                    )}`}
                  >
                    {inc.severity}
                  </span>
                </div>
                <span className={`text-[10px] uppercase font-mono ${getStatusBadge(inc.status)}`}>
                  {inc.status}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 line-clamp-1 transition">
                {inc.title}
              </h4>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1 truncate max-w-[150px]">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{inc.location}</span>
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{inc.timestamp}</span>
                </span>
              </div>

              {inc.assignedResponder && (
                <div className="mt-2 text-[10px] text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <User className="w-3 h-3 text-blue-600" />
                    <span className="truncate">{inc.assignedResponder.name}</span>
                  </span>
                  <span className="text-blue-600 font-mono font-semibold">
                    {inc.assignedResponder.distanceMeters
                      ? `${inc.assignedResponder.distanceMeters}m away`
                      : 'Assigned'}
                  </span>
                </div>
              )}
            </Link>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-center">
        <Link
          href="/incidents"
          className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center gap-1"
        >
          Open Master Incident Registry <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
