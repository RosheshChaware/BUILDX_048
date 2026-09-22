'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Flame,
  HeartPulse,
  Shield,
  UserX,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Radio,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';

export default function EmergencySosPage() {
  const { state, triggerSos } = useSuraksha();

  const [selectedEmergency, setSelectedEmergency] = useState<
    'MEDICAL' | 'POLICE' | 'FIRE' | 'MISSING' | 'HARASSMENT' | 'OTHER'
  >('MEDICAL');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [locationName, setLocationName] = useState('East Gate 2 - Main Pilgrim Walkway');
  const [description, setDescription] = useState('');

  const [createdIncident, setCreatedIncident] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emergencyCategories: {
    key: 'MEDICAL' | 'POLICE' | 'FIRE' | 'MISSING' | 'HARASSMENT' | 'OTHER';
    label: string;
    sub: string;
    icon: any;
    color: string;
  }[] = [
    {
      key: 'MEDICAL',
      label: 'Medical Emergency',
      sub: 'Cardiac, collapse, severe injury, dehydration',
      icon: HeartPulse,
      color: 'from-red-600 to-rose-700 border-red-500',
    },
    {
      key: 'POLICE',
      label: 'Police Intervention',
      sub: 'Physical altercation, theft, active threat',
      icon: ShieldAlert,
      color: 'from-blue-600 to-indigo-700 border-blue-500',
    },
    {
      key: 'HARASSMENT',
      label: 'Women Safety / Harassment',
      sub: 'Damini Squad rapid intervention',
      icon: Shield,
      color: 'from-purple-600 to-fuchsia-700 border-purple-500',
    },
    {
      key: 'MISSING',
      label: 'Immediate Child Lost',
      sub: 'Separated child in heavy crowd',
      icon: UserX,
      color: 'from-amber-600 to-orange-700 border-amber-500',
    },
    {
      key: 'FIRE',
      label: 'Fire / Smoke Hazard',
      sub: 'Kitchen stall, electrical sparks',
      icon: Flame,
      color: 'from-orange-600 to-red-700 border-orange-500',
    },
    {
      key: 'OTHER',
      label: 'Other Danger / Bottleneck',
      sub: 'Exit crush, stampede risk',
      icon: AlertTriangle,
      color: 'from-slate-700 to-slate-800 border-slate-600',
    },
  ];

  const handleSosTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const inc = triggerSos({
        category: selectedEmergency,
        locationName,
        userName: userName.trim() || 'Citizen Pilgrim (Anonymous SOS)',
        userPhone: userPhone.trim() || '+91 98000 00000',
        description,
      });

      setCreatedIncident(inc);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* SOS Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold animate-pulse">
          <Radio className="w-3.5 h-3.5" />
          <span>INSTANT EMERGENCY BEACON</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">Emergency Response SOS</h1>
        <p className="text-xs text-slate-400">
          Transmits your GPS location to the Central Control Room, Police Posts, and EMS ambulances instantly.
        </p>
      </div>

      {createdIncident ? (
        /* SOS Confirmation & Live Responder Tracker */
        <div className="p-6 rounded-2xl bg-slate-900 border-2 border-emerald-500 shadow-2xl shadow-emerald-950/50 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">SOS BEACON ACTIVE & DISPATCHED</h2>
                <span className="font-mono text-xs text-cyan-400 font-bold">
                  Reference: {createdIncident.id}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-red-950 text-red-300 border border-red-800 animate-pulse">
              CRITICAL CODE RED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Incident Logged
              </div>
              <div className="text-white font-semibold">{createdIncident.title}</div>
              <div className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{createdIncident.location}</span>
              </div>
              <div className="text-slate-400">
                Department: {createdIncident.assignedDepartment}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] flex items-center justify-between">
                <span>Dispatched Unit</span>
                <span className="text-emerald-400 font-mono">EN ROUTE</span>
              </div>
              <div className="text-white font-bold text-sm">
                {createdIncident.assignedResponder?.name}
              </div>
              <div className="text-cyan-400 font-mono text-xs">
                Distance: ~{createdIncident.assignedResponder?.distanceMeters || 95}m away (ETA: 90
                seconds)
              </div>
              <div className="text-slate-400">
                Emergency Contact: {createdIncident.assignedResponder?.phone}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/80 text-xs text-cyan-200 flex items-center justify-between">
            <div>
              <strong>Stay where you are:</strong> Field responders have received your coordinates. Keep your phone line clear.
            </div>
            <Link
              href={`/incidents/${createdIncident.id}`}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shrink-0 ml-3"
            >
              Open Live Tracking
            </Link>
          </div>
        </div>
      ) : (
        /* SOS Trigger Form */
        <form onSubmit={handleSosTrigger} className="space-y-6">
          {/* Step 1: Emergency Category Cards */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Emergency Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {emergencyCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedEmergency === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedEmergency(cat.key)}
                    className={`p-4 rounded-2xl border text-left transition transform active:scale-98 flex flex-col justify-between ${
                      isSelected
                        ? `bg-gradient-to-br ${cat.color} text-white shadow-xl shadow-red-950/40 ring-2 ring-white/60`
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-6 h-6" />
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-black text-xs sm:text-sm">{cat.label}</div>
                      <div className="text-[10px] opacity-80 mt-0.5 leading-snug">{cat.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Location and Contact Inputs */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 text-xs">
            <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              2. Your Location & Details
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Current Location (Spot on Gathering Grounds) *
              </label>
              <select
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500 font-medium"
              >
                <option value="North Gate 1 - VIP & Emergency Route">
                  North Gate 1 - VIP & Emergency Route
                </option>
                <option value="East Gate 2 - Main Pilgrim Walkway">
                  East Gate 2 - Main Pilgrim Walkway (Ramdaspeth)
                </option>
                <option value="South Gate 3 - Laxmi Nagar Pedestrian Choke Point">
                  South Gate 3 - Laxmi Nagar Pedestrian Choke Point
                </option>
                <option value="West Gate 4 - Ring Road Bus Concourse">
                  West Gate 4 - Ring Road Bus Concourse
                </option>
                <option value="Central Stupa Dome Parikrama Lawn">
                  Central Stupa Dome Parikrama Lawn
                </option>
                <option value="Annadanam Food Pavilion A">Annadanam Food Pavilion A</option>
                <option value="Memorial Book Exhibition Lawn">Memorial Book Exhibition Lawn</option>
                <option value="Laxmi Nagar Shared-Auto Bay">Laxmi Nagar Shared-Auto Bay</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Your Name (Optional)</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Kavita Meshram"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="e.g. +91 98814 77665"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Brief Situation Details (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Patient having acute chest pain near Tree #14..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Trigger Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-base shadow-2xl shadow-red-950/70 transition transform active:scale-98 flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-5 h-5 animate-bounce" />
            <span>{isSubmitting ? 'TRANSMITTING BEACON...' : 'TRANSMIT EMERGENCY SOS NOW'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
