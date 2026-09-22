'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserX,
  Camera,
  Search,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  ArrowRight,
  Eye,
  Radio,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import { MissingPerson } from '@/types';

export default function MissingPersonPage() {
  const { state, reportMissingPerson } = useSuraksha();

  // Active missing person list view vs Report Form tab
  const [activeTab, setActiveTab] = useState<'LIST' | 'REPORT' | 'AI_SCAN'>('LIST');

  // Form State
  const [category, setCategory] = useState<'CHILD' | 'ELDERLY' | 'ADULT'>('CHILD');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [clothing, setClothing] = useState('');
  const [lastLocation, setLastLocation] = useState('');
  const [lastTime, setLastTime] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Submission success dialog
  const [submittedIncidentId, setSubmittedIncidentId] = useState<string | null>(null);

  // AI Scanner state
  const [scanningTarget, setScanningTarget] = useState<MissingPerson | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clothing || !lastLocation || !contactName || !contactPhone) {
      alert('Please fill all mandatory fields.');
      return;
    }

    const { incident } = reportMissingPerson({
      name,
      age: parseInt(age) || (category === 'CHILD' ? 6 : category === 'ELDERLY' ? 72 : 30),
      gender,
      category,
      clothingDescription: clothing,
      lastKnownLocation: lastLocation,
      contactPerson: contactName,
      contactNumber: contactPhone,
      medicalNotes: medicalNotes || undefined,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=400&q=80',
    });

    setSubmittedIncidentId(incident.id);
    setActiveTab('LIST');
  };

  const runAiScanner = (mp: MissingPerson) => {
    setScanningTarget(mp);
    setIsScanning(true);
    setActiveTab('AI_SCAN');

    setTimeout(() => {
      setIsScanning(false);
      setScanResults([
        {
          cameraId: 'CCTV-12',
          cameraLocation: 'Zone B Dome Pathway Approach',
          timestamp: 'Just now',
          confidence: 87,
          notes: 'High probability clothing vector and height histogram match.',
          status: 'VERIFIED',
        },
        {
          cameraId: 'CAM-03',
          cameraLocation: 'East Gate 2 Main Entrance Walkway',
          timestamp: '4 mins ago',
          confidence: 76,
          notes: 'Secondary perimeter sighting detected near water booth.',
          status: 'DISMISSED',
        },
        {
          cameraId: 'CAM-09',
          cameraLocation: 'Central Stupa Dome North-East Tier',
          timestamp: '12 mins ago',
          confidence: 68,
          notes: 'Low confidence crowd cluster match.',
          status: 'DISMISSED',
        },
      ]);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#F1F5F9]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <UserX className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Missing Persons Coordination Module
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Rapid search, CCTV facial pattern matching, and multi-agency family reunification.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
          <button
            onClick={() => setActiveTab('LIST')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'LIST'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Cases ({state.missingPersons.length})
          </button>
          <button
            onClick={() => setActiveTab('REPORT')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'REPORT'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Report Missing
          </button>
          <button
            onClick={() => {
              if (state.missingPersons.length > 0) {
                runAiScanner(state.missingPersons[0]);
              }
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'AI_SCAN'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-teal-700 hover:text-teal-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI CCTV Scanner</span>
          </button>
        </div>
      </div>

      {/* Success Banner if newly reported */}
      {submittedIncidentId && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-xs">
                Searching Initiated! Case Registered: {submittedIncidentId}
              </div>
              <div className="text-[11px] text-emerald-700">
                10 Help Desks and 15 CCTV Cameras notified. Smart Volunteer assignment engaged.
              </div>
            </div>
          </div>
          <Link
            href={`/incidents/${submittedIncidentId}`}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
          >
            Open Case Dossier
          </Link>
        </div>
      )}

      {/* TAB 1: ACTIVE CASES GRID */}
      {activeTab === 'LIST' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {state.missingPersons.map((mp) => {
            const isChild = mp.category === 'CHILD';
            const isResolved = mp.status === 'REUNITED' || mp.status === 'LOCATED';

            return (
              <div
                key={mp.id}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={mp.photoUrl}
                      alt={mp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs ${
                          isChild ? 'bg-blue-600' : 'bg-purple-600'
                        }`}
                      >
                        {mp.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                          isResolved
                            ? 'bg-emerald-600 text-white'
                            : mp.status === 'SIGHTED'
                            ? 'bg-amber-500 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {mp.status}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-mono font-bold text-slate-800 shadow-2xs border border-slate-200">
                      {mp.id}
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{mp.name}</h3>
                      <div className="text-xs text-slate-500">
                        {mp.age} years • {mp.gender}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                      <strong className="text-slate-800">Clothing:</strong> {mp.clothingDescription}
                    </p>

                    <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{mp.lastKnownLocation}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Last seen: {mp.lastSeenTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>
                          Contact: {mp.contactPerson} ({mp.contactNumber})
                        </span>
                      </div>
                    </div>

                    {mp.medicalNotes && (
                      <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-[10px] text-red-700">
                        ⚠️ <strong>Medical Alert:</strong> {mp.medicalNotes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => runAiScanner(mp)}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>Run AI Scan</span>
                  </button>

                  <Link
                    href={`/incidents/${mp.incidentId}`}
                    className="py-1.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition shadow-2xs"
                  >
                    Dossier
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: REPORT MISSING FORM */}
      {activeTab === 'REPORT' && (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Register Missing Person Report</h2>
            <p className="text-xs text-slate-500">
              Information submitted is broadcast instantly to Help Desks, Volunteers, and the AI CCTV Search Engine.
            </p>
          </div>

          <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
            {/* Category selection */}
            <div>
              <label className="text-slate-700 font-bold block mb-1">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'CHILD', label: 'Child (Below 14)' },
                  { key: 'ELDERLY', label: 'Elderly Person' },
                  { key: 'ADULT', label: 'Adult' },
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategory(c.key as any)}
                    className={`py-2 px-3 rounded-xl font-bold border transition ${
                      category === c.key
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-slate-700 font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarohi"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Age *</label>
                <input
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 7"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Last Seen Time</label>
                <input
                  type="text"
                  value={lastTime}
                  onChange={(e) => setLastTime(e.target.value)}
                  placeholder="e.g. 10:30 AM"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Clothing &amp; Physical Appearance *
              </label>
              <textarea
                required
                value={clothing}
                onChange={(e) => setClothing(e.target.value)}
                placeholder="e.g. Blue shirt, ponytail, pink shoes..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 h-20"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Last Known Location (Gathering Spot) *
              </label>
              <input
                type="text"
                required
                value={lastLocation}
                onChange={(e) => setLastLocation(e.target.value)}
                placeholder="e.g. Zone B - Main Pathway..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Medical or Special Information (Optional)
              </label>
              <input
                type="text"
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="e.g. Asthmatic (inhaler pouch), hard of hearing, Alzheimer’s..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Suresh (Father)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Reference Photo URL (or leave blank for demo photo)
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('LIST')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition active:scale-98"
              >
                Initiate Search Protocol
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: AI CCTV SCANNER SIMULATION */}
      {activeTab === 'AI_SCAN' && scanningTarget && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={scanningTarget.photoUrl}
                alt={scanningTarget.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-blue-500 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                    {scanningTarget.id}
                  </span>
                  <span className="text-base font-bold text-slate-900">{scanningTarget.name}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Scanning 15 Deekshabhoomi CCTV streams against clothing and facial biometric clusters.
                </p>
              </div>
            </div>

            <button
              onClick={() => runAiScanner(scanningTarget)}
              disabled={isScanning}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Radio className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning 15 Cameras...' : 'Re-Run AI Matching Scan'}</span>
            </button>
          </div>

          {isScanning ? (
            <div className="p-16 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="text-sm font-bold text-blue-700">
                AI Vision Pipeline Scanning 15 Active RTSP Feeds...
              </div>
              <p className="text-xs text-slate-500">
                Comparing feature vectors: Color histogram (Blue shirt), gait analysis, facial landmark embedding.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                CCTV Detections ({scanResults.length} Candidate Frames Found)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scanResults.map((res, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border shadow-sm space-y-3 ${
                      res.confidence >= 85
                        ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {res.cameraId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          res.confidence >= 85
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {res.confidence}% Match
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {res.cameraLocation}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{res.timestamp}</div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">{res.notes}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        CONFIRMED MATCH
                      </span>
                      <Link
                        href={`/cctv?camera=${res.cameraId}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        Inspect Camera Feed <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
