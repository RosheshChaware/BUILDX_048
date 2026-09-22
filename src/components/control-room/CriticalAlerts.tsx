'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ShieldAlert, ArrowRight, UserCheck, CheckCircle, Radio } from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';

export function CriticalAlerts() {
  const { state, executeCrowdDiversion, verifySighting, flagVehicleTrip } = useSuraksha();

  const exit3 = state.exitGates.find((e) => e.id === 'EXIT-03');
  const isExitCritical = exit3?.riskLevel === 'CRITICAL';

  const pendingSighting = state.sightings.find(
    (s) => s.verificationStatus === 'UNVERIFIED' && s.aiSimilarityScore >= 80
  );

  const deviatedTrip = state.vehicleTrips.find(
    (t) => t.isDeviated && t.status !== 'SAFE_COMPLETED'
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600 animate-bounce" />
          <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            Critical Alerts &amp; Triage
          </span>
        </div>
        <span className="text-[10px] text-red-700 font-mono font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
          PRIORITY 1
        </span>
      </div>

      <div className="p-3.5 space-y-3 overflow-y-auto max-h-[520px]">
        {/* Alert 1: Exit 3 Bottleneck Surge */}
        {isExitCritical && (
          <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-300 shadow-xs relative">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-xs font-extrabold text-red-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                EXIT GATE 3 SURGE (96% FULL)
              </span>
              <span className="text-[10px] text-red-700 font-mono font-bold bg-white px-2 py-0.5 rounded border border-red-200 shadow-2xs">
                DANGER
              </span>
            </div>
            <p className="text-xs text-red-800 leading-relaxed mb-2.5">
              Current Crowd: <strong>7,840</strong> (Capacity: 5,000). High risk of congestion at Laxmi Nagar corridor.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => executeCrowdDiversion('EXIT-03')}
                className="w-full py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
              >
                <span>Execute Diversion to Gate 2 &amp; 4</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Alert 2: High Confidence AI Sighting Waiting for Verification */}
        {pendingSighting && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 shadow-xs relative">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-amber-600 animate-spin" />
                AI SIGHTING: {pendingSighting.missingPersonName || 'Aarav Patil'}
              </span>
              <span className="text-[10px] text-amber-800 font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-200">
                {pendingSighting.aiSimilarityScore}% Match
              </span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed mb-1">
              Detected at: <strong>{pendingSighting.location}</strong>
            </p>
            <p className="text-[11px] text-slate-600 mb-2.5 line-clamp-2">
              &quot;{pendingSighting.description}&quot;
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  verifySighting(
                    pendingSighting.id,
                    'VERIFIED',
                    'Confirmed by Control Room Operator from CAM-04 frame.',
                    'Operator'
                  )
                }
                className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                <span>Verify Sighting</span>
              </button>
              <Link
                href="/sighting"
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
              >
                Inspect
              </Link>
            </div>
          </div>
        )}

        {/* Alert 3: Shared Auto Route Deviation Alert */}
        {deviatedTrip && (
          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 shadow-xs relative">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-indigo-600" />
                AUTO ROUTE DEVIATION
              </span>
              <span className="text-[10px] text-indigo-700 font-mono bg-white px-2 py-0.5 rounded font-bold border border-indigo-200">
                1.45km Off-Route
              </span>
            </div>
            <p className="text-xs text-indigo-900 mb-1">
              Vehicle: <strong>{deviatedTrip.vehicleNumber}</strong> ({deviatedTrip.driverName})
            </p>
            <p className="text-[11px] text-slate-600 mb-2.5">
              Passenger: {deviatedTrip.passengerName} ({deviatedTrip.passengerCount} souls on board).
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => flagVehicleTrip(deviatedTrip.id, 'CONTACT_DRIVER')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition"
              >
                Dispatch PCR Unit
              </button>
              <Link
                href="/vehicle-safety"
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
              >
                Track Map
              </Link>
            </div>
          </div>
        )}

        {/* Quick Triage Shortcut Links */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Quick Actions
          </div>
          <Link
            href="/sos"
            className="flex items-center justify-between p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold transition"
          >
            <span>🚨 Deploy Emergency SOS Unit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/missing-person"
            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition"
          >
            <span>👤 Register Missing Person</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/cctv"
            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition"
          >
            <span>📷 Open CCTV Grid &amp; AI Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
