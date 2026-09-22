'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserCheck2,
  HeartPulse,
  Search,
  MapPin,
  Clock,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Plus,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';

export default function ElderlySafetyPage() {
  const { state, reportMissingPerson } = useSuraksha();

  const elderlyCases = state.missingPersons.filter((mp) => mp.category === 'ELDERLY');

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('74');
  const [medical, setMedical] = useState('');
  const [clothing, setClothing] = useState('');
  const [location, setLocation] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleRegisterElderly = (e: React.FormEvent) => {
    e.preventDefault();
    reportMissingPerson({
      name,
      age: parseInt(age) || 72,
      gender: 'MALE',
      category: 'ELDERLY',
      clothingDescription: clothing,
      lastKnownLocation: location,
      contactPerson: contactName,
      contactNumber: contactPhone,
      medicalNotes: medical,
    });
    setShowRegisterForm(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck2 className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Elderly Safety & Wandering Tracing Cell
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dedicated welfare assistance for senior citizens, Alzheimer’s patients, and lost elderly pilgrims.
          </p>
        </div>

        <button
          onClick={() => setShowRegisterForm(!showRegisterForm)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register Wandering Senior</span>
        </button>
      </div>

      {/* Register Form Modal/Collapse */}
      {showRegisterForm && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-purple-500/60 shadow-2xl space-y-4 max-w-2xl mx-auto text-xs animate-fadeIn">
          <h2 className="text-sm font-bold text-white">Register Wandering Elderly Case</h2>

          <form onSubmit={handleRegisterElderly} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Senior&apos;s Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Devidas Meshram"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Age *</label>
                <input
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Medical Conditions / Special Needs *
              </label>
              <input
                type="text"
                required
                value={medical}
                onChange={(e) => setMedical(e.target.value)}
                placeholder="e.g. Memory lapse / Alzheimer’s, insulin diabetic, hard of hearing..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Clothing & Appearance *</label>
              <input
                type="text"
                required
                value={clothing}
                onChange={(e) => setClothing(e.target.value)}
                placeholder="e.g. White Kurta Pajama, walking cane, silver bracelet..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Last Known Spot *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Book Stall No. 42 / Water Tank..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Family Contact Person *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Raju Meshram (Son)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Family Contact Phone *</label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 97654 32190"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shadow"
              >
                Launch Elderly Search Cell
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Elderly Cases Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {elderlyCases.map((mp) => {
          const isResolved = mp.status === 'LOCATED' || mp.status === 'REUNITED';
          return (
            <div
              key={mp.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={mp.photoUrl}
                      alt={mp.name}
                      className="w-12 h-12 rounded-xl object-cover border border-purple-500 shadow"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-white">{mp.name}</h3>
                      <div className="text-[11px] text-slate-400">
                        {mp.age} years • Senior Citizen
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isResolved
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                    }`}
                  >
                    {mp.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1.5">
                  <div className="text-slate-300">
                    <strong className="text-slate-400">Appearance:</strong> {mp.clothingDescription}
                  </div>
                  <div className="text-purple-300 font-medium">
                    <HeartPulse className="w-3.5 h-3.5 inline mr-1 text-purple-400" />
                    <strong>Health Alert:</strong> {mp.medicalNotes || 'Requires routine supervision'}
                  </div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{mp.lastKnownLocation}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[10px]">Ref: {mp.incidentId}</span>
                <Link
                  href={`/incidents/${mp.incidentId}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold"
                >
                  View Case Dossier →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
