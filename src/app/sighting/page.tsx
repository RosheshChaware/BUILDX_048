'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  CheckCircle2,
  XCircle,
  Copy,
  AlertTriangle,
  Sparkles,
  MapPin,
  Clock,
  User,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import { VerificationStatus } from '@/types';

export default function SightingVerificationPage() {
  const { state, submitSighting, verifySighting } = useSuraksha();

  const [activeTab, setActiveTab] = useState<'QUEUE' | 'SUBMIT'>('QUEUE');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Submit form state
  const [incidentId, setIncidentId] = useState(state.incidents[0]?.id || 'INC-2026-1048');
  const [reporterName, setReporterName] = useState('');
  const [reporterType, setReporterType] = useState<'CITIZEN' | 'VOLUNTEER' | 'POLICE'>('CITIZEN');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const [decisionNotes, setDecisionNotes] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !location || !reporterName) {
      alert('Please fill all required fields');
      return;
    }

    const linkedInc = state.incidents.find((i) => i.id === incidentId);

    submitSighting({
      incidentId,
      missingPersonName: linkedInc?.title,
      reporterName,
      reporterType,
      location,
      description,
      photoUrl: photoUrl || undefined,
    });

    setActiveTab('QUEUE');
    setReporterName('');
    setLocation('');
    setDescription('');
    setPhotoUrl('');
  };

  const handleAction = (
    sightingId: string,
    action: 'VERIFIED' | 'REJECTED' | 'DUPLICATE'
  ) => {
    const note = decisionNotes[sightingId] || undefined;
    verifySighting(sightingId, action, note, `${state.currentRole} Verifier`);
  };

  const filteredSightings = state.sightings.filter((s) => {
    if (filterStatus === 'ALL') return true;
    return s.verificationStatus === filterStatus;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Sighting Verification & AI Triangulation
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Key differentiator: Prevents false sightings, filters duplicate noise, and escalates genuine leads.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('QUEUE')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'QUEUE'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Verification Queue ({state.sightings.length})
          </button>
          <button
            onClick={() => setActiveTab('SUBMIT')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'SUBMIT'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            + Submit New Sighting
          </button>
        </div>
      </div>

      {activeTab === 'QUEUE' && (
        <div className="space-y-4">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Filter:</span>
            {['ALL', 'UNVERIFIED', 'VERIFIED', 'UNDER_REVIEW', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  filterStatus === st
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sighting Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSightings.map((s) => {
              const isUnverified = s.verificationStatus === 'UNVERIFIED';
              const isVerified = s.verificationStatus === 'VERIFIED';
              const isRejected = s.verificationStatus === 'REJECTED';

              return (
                <div
                  key={s.id}
                  className={`p-5 rounded-2xl border shadow-xl flex flex-col justify-between space-y-4 transition ${
                    isVerified
                      ? 'bg-emerald-950/20 border-emerald-500/70 shadow-emerald-950/20'
                      : isUnverified
                      ? 'bg-amber-950/20 border-amber-500/80 shadow-amber-950/30'
                      : isRejected
                      ? 'bg-slate-900/40 border-slate-800 opacity-70'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-xs text-white">{s.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              isVerified
                                ? 'bg-emerald-600 text-white border-emerald-400'
                                : isUnverified
                                ? 'bg-amber-600 text-white border-amber-400 animate-pulse'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {s.verificationStatus}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-100">
                          {s.missingPersonName || 'Unknown Subject'}
                        </h3>
                      </div>

                      {/* AI Confidence Badge */}
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block mb-0.5">
                          AI Match Score
                        </span>
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-mono font-black border ${
                            s.aiSimilarityScore >= 85
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {s.aiSimilarityScore}% ({s.aiConfidence})
                        </span>
                      </div>
                    </div>

                    {/* Sighting Description */}
                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      &quot;{s.description}&quot;
                    </p>

                    {/* Reporter & Location Metadata */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{s.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{s.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>
                          {s.reporterName} ({s.reporterType})
                        </span>
                      </div>
                      <div>
                        <Link
                          href={`/incidents/${s.incidentId}`}
                          className="text-cyan-400 hover:underline font-mono"
                        >
                          Ref: {s.incidentId}
                        </Link>
                      </div>
                    </div>

                    {/* AI Triangulation Consistency Box */}
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>AI Consistency Analysis</span>
                      </div>
                      <div className="flex gap-4 text-slate-400">
                        <span>
                          Location match:{' '}
                          <strong className={s.consistencyCheck.locationConsistent ? 'text-emerald-400' : 'text-red-400'}>
                            {s.consistencyCheck.locationConsistent ? 'CONSISTENT' : 'DEVIATED'}
                          </strong>
                        </span>
                        <span>
                          Time check:{' '}
                          <strong className={s.consistencyCheck.timeConsistent ? 'text-emerald-400' : 'text-red-400'}>
                            {s.consistencyCheck.timeConsistent ? 'VALID' : 'INVALID'}
                          </strong>
                        </span>
                      </div>
                      <p className="text-slate-400 text-[10px] leading-snug">
                        {s.consistencyCheck.notes}
                      </p>
                    </div>

                    {s.verifiedBy && (
                      <div className="text-[10px] text-slate-400 italic">
                        Verified by {s.verifiedBy} at {s.verifiedAt}
                      </div>
                    )}
                  </div>

                  {/* Verification Operator Action Toolbar */}
                  {isUnverified && (
                    <div className="pt-3 border-t border-slate-800/80 space-y-2">
                      <input
                        type="text"
                        placeholder="Optional operator notes (e.g. cross-verified via CCTV-04)..."
                        value={decisionNotes[s.id] || ''}
                        onChange={(e) =>
                          setDecisionNotes({ ...decisionNotes, [s.id]: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleAction(s.id, 'VERIFIED')}
                          className="py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>VERIFY</span>
                        </button>
                        <button
                          onClick={() => handleAction(s.id, 'REJECTED')}
                          className="py-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>REJECT</span>
                        </button>
                        <button
                          onClick={() => handleAction(s.id, 'DUPLICATE')}
                          className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>DUPLICATE</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SUBMIT SIGHTING FORM */}
      {activeTab === 'SUBMIT' && (
        <div className="max-w-xl mx-auto p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Submit New Sighting Information</h2>
            <p className="text-xs text-slate-400">
              Submitted sightings undergo automated AI consistency checks before operator verification.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Related Incident *</label>
              <select
                value={incidentId}
                onChange={(e) => setIncidentId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {state.incidents.map((inc) => (
                  <option key={inc.id} value={inc.id}>
                    {inc.id} - {inc.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Reporter Name *</label>
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Ramesh Kadam"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Reporter Type</label>
                <select
                  value={reporterType}
                  onChange={(e) => setReporterType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="CITIZEN">Citizen Pilgrim</option>
                  <option value="VOLUNTEER">Field Volunteer</option>
                  <option value="POLICE">Police Officer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Sighting Spot / Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Tea stall behind East Gate 2 / near water tank 3..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Detailed Sighting Description *
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you saw: clothing, companion, physical state, direction headed..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 h-24"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('QUEUE')}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg"
              >
                Submit for Verification
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
