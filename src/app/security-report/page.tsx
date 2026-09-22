'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Shield,
  Camera,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import { IncidentType } from '@/types';

export default function SecurityReportPage() {
  const { state, createIncident } = useSuraksha();

  const [category, setCategory] = useState<IncidentType>('THEFT');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Memorial Book Pavilions South Lawn');
  const [description, setDescription] = useState('');
  const [suspectDescription, setSuspectDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [createdIncidentId, setCreatedIncidentId] = useState<string | null>(null);

  const securityCategories = [
    { type: 'THEFT' as IncidentType, label: 'Chain Snatching & Pickpocketing', icon: '💍' },
    { type: 'HARASSMENT' as IncidentType, label: 'Harassment / Eve-Teasing', icon: '🛑' },
    { type: 'SUSPICIOUS_ACTIVITY' as IncidentType, label: 'Suspicious Activity / Abandoned Item', icon: '🎒' },
    { type: 'OTHER' as IncidentType, label: 'Lost Property / Valuables', icon: '📱' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !reporterName || !reporterPhone) {
      alert('Please fill all required fields');
      return;
    }

    const incident = createIncident({
      type: category,
      title: title || `${category.replace('_', ' ')} reported near ${location}`,
      reporter: {
        name: reporterName,
        phone: reporterPhone,
        role: 'CITIZEN',
      },
      location,
      coords: [21.12690, 79.06520],
      description,
      evidence: {
        suspectDescription: suspectDescription || undefined,
      },
      severity: category === 'THEFT' || category === 'HARASSMENT' ? 'HIGH' : 'MEDIUM',
      verificationStatus: 'UNDER_REVIEW',
      initialStatus: 'RESPONDING',
      assignedDepartment: 'Nagpur Police Crime Branch & Flying Squad',
      assignedResponder: {
        id: 'PP-06',
        name: 'PSI Sachin Gurnule (Flying Squad)',
        type: 'POLICE',
        phone: '+91 712 256 1006',
        assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        distanceMeters: 90,
      },
      nearbyCctvIds: ['CAM-12', 'CAM-08'],
      nearbyHelpDeskId: 'HD-07',
      tags: [category, 'Security Alert', 'Police Dispatched'],
    });

    setCreatedIncidentId(incident.id);
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>NAGPUR POLICE CRIME & VIGILANCE DESK</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Security & Crime Incident Intake
        </h1>
        <p className="text-xs text-slate-400">
          Fast intake for chain snatching, theft, harassment, or suspicious movement on gathering premises.
        </p>
      </div>

      {createdIncidentId ? (
        <div className="p-6 rounded-2xl bg-slate-900 border-2 border-emerald-500 shadow-xl space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">
                Police Action Dispatched: Reference {createdIncidentId}
              </div>
              <div className="text-slate-400">
                Flying Squad PP-06 alerted with suspect details. Nearby CCTV cameras (CAM-12, CAM-08) tagged for immediate video playback review.
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href={`/incidents/${createdIncidentId}`}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center gap-1.5"
            >
              <span>View Live Case Tracking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 text-xs">
          {/* Category Chips */}
          <div>
            <label className="text-slate-300 font-bold block mb-1.5">Security Category *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {securityCategories.map((c) => (
                <button
                  key={c.type}
                  type="button"
                  onClick={() => setCategory(c.type)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                    category === c.type
                      ? 'bg-amber-950/60 border-amber-500 text-white shadow'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl">{c.icon}</span>
                  <div>
                    <div className="font-bold text-slate-200">{c.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Brief Title / Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Gold chain snatching attempt near Stall 42..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Incident Spot *</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="Memorial Book Pavilions South Lawn">Memorial Book Pavilions South Lawn</option>
                <option value="South Gate 3 - Laxmi Nagar Pedestrian Corridor">South Gate 3 - Laxmi Nagar</option>
                <option value="East Gate 2 - Main Pilgrim Walkway">East Gate 2 - Main Walkway</option>
                <option value="Annadanam Food Pavilion A">Annadanam Food Pavilion A</option>
                <option value="Laxmi Nagar Shared-Auto Bay">Laxmi Nagar Shared-Auto Bay</option>
                <option value="West Gate 4 - Ring Road Concourse">West Gate 4 - Ring Road Concourse</option>
                <option value="Central Stupa Dome Tier 2">Central Stupa Dome Tier 2</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Approximate Time</label>
              <input
                type="text"
                defaultValue="Just now (~10:45 AM)"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Incident Details *</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe exactly what occurred, direction suspect fled, items taken..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 h-20"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Suspect Physical Description (If observed)
            </label>
            <input
              type="text"
              value={suspectDescription}
              onChange={(e) => setSuspectDescription(e.target.value)}
              placeholder="e.g. Male, ~28-30 yrs, black synthetic jacket, red baseball cap, scar on eyebrow..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. Sunita Dongre"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Contact Phone *</label>
              <input
                type="text"
                required
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="e.g. +91 94228 11220"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-bold shadow-lg transition"
            >
              Submit Report & Alert Police
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
