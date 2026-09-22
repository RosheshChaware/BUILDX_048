'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Car,
  AlertTriangle,
  MapPin,
  Phone,
  ShieldAlert,
  CheckCircle2,
  Navigation,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import DynamicSecurityMap from '@/components/map/DynamicSecurityMap';

export default function VehicleSafetyPage() {
  const { state, flagVehicleTrip } = useSuraksha();

  const [selectedTripId, setSelectedTripId] = useState<string>('TRIP-2026-809');

  const selectedTrip =
    state.vehicleTrips.find((t) => t.id === selectedTripId) || state.vehicleTrips[0];

  const handleAction = (tripId: string, action: 'FLAG_ALERT' | 'CONTACT_DRIVER' | 'SAFE_RESOLVED') => {
    flagVehicleTrip(tripId, action);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Car className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Shared-Auto & Transit Safety Telematics
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Geofence tracking, automated route deviation alarm, and police PCR rapid interception.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold">
            {state.vehicleTrips.filter((t) => t.isDeviated).length} DEVIATION ALARMS ACTIVE
          </span>
        </div>
      </div>

      {/* Active Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.vehicleTrips.map((trip) => {
          const isSelected = trip.id === selectedTrip.id;
          const isDeviated = trip.isDeviated && trip.status !== 'SAFE_COMPLETED';

          return (
            <div
              key={trip.id}
              onClick={() => setSelectedTripId(trip.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-400 shadow-xl'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs text-white">
                    {trip.vehicleNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      isDeviated
                        ? 'bg-red-600 text-white animate-pulse'
                        : trip.status === 'SAFE_COMPLETED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-200">
                  {trip.driverName} ({trip.vehicleType})
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Passengers: {trip.passengerName} ({trip.passengerCount} people)
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Route:</span>
                    <span className="font-semibold text-cyan-400 truncate max-w-[170px]">
                      {trip.destination}
                    </span>
                  </div>
                  {isDeviated && (
                    <div className="text-red-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Deviated by {trip.deviationDistanceMeters}m off corridor!</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Start: {trip.startedAt}</span>
                <span>ETA: {trip.estimatedArrival}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Trip Dossier & GIS Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 6 cols: Trip Details & Actions */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="font-mono text-xs text-indigo-400 font-bold">
                {selectedTrip.id}
              </span>
              <h2 className="text-base font-bold text-white">
                Vehicle: {selectedTrip.vehicleNumber}
              </h2>
            </div>
            {selectedTrip.isDeviated && selectedTrip.status !== 'SAFE_COMPLETED' ? (
              <span className="px-3 py-1 rounded bg-red-950 border border-red-700 text-red-200 font-bold animate-pulse">
                ROUTE BREACH DETECTED
              </span>
            ) : (
              <span className="px-3 py-1 rounded bg-emerald-950 border border-emerald-700 text-emerald-200 font-bold">
                ROUTE SECURE
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Driver Profile</span>
              <div className="font-bold text-white text-xs">{selectedTrip.driverName}</div>
              <div className="text-slate-400 font-mono">{selectedTrip.driverPhone}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">
                Passenger Details
              </span>
              <div className="font-bold text-white text-xs">{selectedTrip.passengerName}</div>
              <div className="text-slate-400 font-mono">{selectedTrip.passengerPhone}</div>
            </div>
          </div>

          {/* Route corridor comparison */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Transit Corridor Waypoints
            </div>
            <div className="space-y-1 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Authorized Transit: Deekshabhoomi → Rahate Colony → Dhantoli → Sitabuldi</span>
              </div>
              {selectedTrip.isDeviated && selectedTrip.status !== 'SAFE_COMPLETED' && (
                <div className="flex items-center gap-2 text-red-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>Detected Deviation: Diverted onto Hingna / Wardha Bypass road (+1.45km)</span>
                </div>
              )}
            </div>
          </div>

          {/* Control Room Intercept Actions */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
              Control Room Intervention Protocols
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAction(selectedTrip.id, 'CONTACT_DRIVER')}
                className="py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow"
              >
                Contact Driver
              </button>
              <button
                onClick={() => handleAction(selectedTrip.id, 'FLAG_ALERT')}
                className="py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow"
              >
                Dispatch PCR Unit
              </button>
              <button
                onClick={() => handleAction(selectedTrip.id, 'SAFE_RESOLVED')}
                className="py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
              >
                Mark Safe / Cleared
              </button>
            </div>
          </div>
        </div>

        {/* Right 6 cols: Map of Current GPS Position */}
        <div className="lg:col-span-6 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
            Vehicle Breadcrumb Telematics Map
          </span>
          <DynamicSecurityMap
            height="440px"
            focusedCoords={selectedTrip.currentPosition}
            zoom={16}
            interactive={true}
          />
        </div>
      </div>
    </div>
  );
}
