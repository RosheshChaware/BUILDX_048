'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AlertOctagon,
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  MapPin,
  User,
  Shield,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import { IncidentType, Severity, IncidentStatus } from '@/types';

function IncidentsListContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { state } = useSuraksha();

  const [search, setSearch] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredIncidents = useMemo(() => {
    return state.incidents.filter((inc) => {
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const match =
          inc.id.toLowerCase().includes(query) ||
          inc.title.toLowerCase().includes(query) ||
          inc.location.toLowerCase().includes(query) ||
          inc.reporter.name.toLowerCase().includes(query) ||
          inc.tags.some((t) => t.toLowerCase().includes(query));
        if (!match) return false;
      }

      // Type
      if (selectedType !== 'ALL' && inc.type !== selectedType) return false;

      // Severity
      if (selectedSeverity !== 'ALL' && inc.severity !== selectedSeverity) return false;

      // Status
      if (selectedStatus !== 'ALL' && inc.status !== selectedStatus) return false;

      return true;
    });
  }, [state.incidents, search, selectedType, selectedSeverity, selectedStatus]);

  const getSeverityBadge = (sev: Severity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-300 border-red-800';
      case 'HIGH':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'MEDIUM':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'RESOLVED':
      case 'CLOSED':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'RESPONDING':
      case 'ASSIGNED':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'VERIFIED':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-cyan-400" />
            <span>Master Incident Register</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Central verified incident log with multi-agency traceability & status audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/report"
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Incident</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, keyword, tag, or person..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Categories</option>
              <option value="MISSING_PERSON">Missing Person</option>
              <option value="SIGHTING">Sighting</option>
              <option value="SOS">Emergency SOS</option>
              <option value="THEFT">Theft & Chain Snatching</option>
              <option value="CROWD_SURGE">Crowd Surge</option>
              <option value="MEDICAL">Medical Emergency</option>
              <option value="VEHICLE_SAFETY">Vehicle Safety</option>
              <option value="HARASSMENT">Harassment</option>
              <option value="SUSPICIOUS_ACTIVITY">Suspicious Activity</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Stages</option>
              <option value="REPORTED">Reported</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="VERIFIED">Verified</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="RESPONDING">Responding</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
          <span>
            Showing <strong className="text-white">{filteredIncidents.length}</strong> of{' '}
            {state.incidents.length} incidents
          </span>
          {(search || selectedType !== 'ALL' || selectedSeverity !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedType('ALL');
                setSelectedSeverity('ALL');
                setSelectedStatus('ALL');
              }}
              className="text-cyan-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Incidents Table */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Type & Title</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Responder</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No incidents match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      <Link href={`/incidents/${inc.id}`} className="hover:underline">
                        {inc.id}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100 max-w-xs truncate">
                        {inc.title}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {inc.type} • {inc.reporter.name}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(
                          inc.severity
                        )}`}
                      >
                        {inc.severity}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 max-w-[160px] truncate">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{inc.location}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${getStatusBadge(
                          inc.status
                        )}`}
                      >
                        {inc.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {inc.assignedResponder ? (
                        <div className="text-[11px] text-slate-300">
                          <span className="font-medium text-white block">
                            {inc.assignedResponder.name}
                          </span>
                          <span className="text-[10px] text-cyan-400 font-mono">
                            {inc.assignedResponder.distanceMeters
                              ? `${inc.assignedResponder.distanceMeters}m`
                              : 'Assigned'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {inc.timestamp}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/incidents/${inc.id}`}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 border border-slate-700 transition inline-flex items-center gap-1"
                      >
                        <span>Dossier</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function IncidentsListPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          Loading Incident Registry...
        </div>
      }
    >
      <IncidentsListContent />
    </Suspense>
  );
}
