'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  UserX,
  Camera,
  Search,
  CheckCircle2,
  AlertTriangle,
  Upload,
  UploadCloud,
  FolderOpen,
  X,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  ArrowRight,
  Eye,
  Radio,
  Maximize2,
  ExternalLink,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import { MissingPerson } from '@/types';

export default function MissingPersonPage() {
  const { state, reportMissingPerson } = useSuraksha();

  // Active missing person list view vs Report Form tab
  const [activeTab, setActiveTab] = useState<'LIST' | 'REPORT' | 'AI_SCAN'>('LIST');

  // Full-size image lightbox modal state
  const [fullSizeModal, setFullSizeModal] = useState<{
    url: string;
    name: string;
    age?: number | string;
    gender?: string;
    category?: string;
    status?: string;
    id?: string;
    clothing?: string;
    location?: string;
    contact?: string;
    incidentId?: string;
    mp?: MissingPerson;
  } | null>(null);

  // Close full size modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullSizeModal(null);
      }
    };
    if (fullSizeModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [fullSizeModal]);

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
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Submission success dialog
  const [submittedIncidentId, setSubmittedIncidentId] = useState<string | null>(null);

  // File Upload Handlers (Drag & Drop + Select from Folder)
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit. Please choose a smaller photo.');
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPhotoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl('');
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      photoUrl: photoUrl || '',
    });

    // Reset Form
    setName('');
    setAge('');
    setClothing('');
    setLastLocation('');
    setLastTime('');
    setContactName('');
    setContactPhone('');
    setMedicalNotes('');
    setPhotoUrl('');
    setFileName('');
    setFileSize('');

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {state.missingPersons.map((mp) => {
            const isChild = mp.category === 'CHILD';
            const isResolved = mp.status === 'REUNITED' || mp.status === 'LOCATED';
            const hasPhoto = Boolean(mp.photoUrl && mp.photoUrl.trim() !== '');

            return (
              <div
                key={mp.id}
                className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300/80 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Large Prominent Photo Banner */}
                  {hasPhoto ? (
                    <div
                      onClick={() =>
                        setFullSizeModal({
                          url: mp.photoUrl,
                          name: mp.name,
                          age: mp.age,
                          gender: mp.gender,
                          category: mp.category,
                          status: mp.status,
                          id: mp.id,
                          clothing: mp.clothingDescription,
                          location: mp.lastKnownLocation,
                          contact: `${mp.contactPerson} (${mp.contactNumber})`,
                          incidentId: mp.incidentId,
                          mp,
                        })
                      }
                      className="relative w-full h-56 bg-slate-900 overflow-hidden cursor-pointer group/photo"
                      title="Click to view full size photo"
                    >
                      <img
                        src={mp.photoUrl}
                        alt={mp.name}
                        className="w-full h-full object-cover object-center group-hover/photo:scale-105 transition-transform duration-500"
                      />
                      {/* Gradient overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-black/25 to-black/40 pointer-events-none" />

                      {/* Floating Top Status Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md ${
                              isChild ? 'bg-blue-600/95 border border-blue-400/30' : 'bg-purple-600/95 border border-purple-400/30'
                            }`}
                          >
                            {mp.category}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md flex items-center gap-1.5 ${
                              isResolved
                                ? 'bg-emerald-600/95 border border-emerald-400/30'
                                : mp.status === 'SIGHTED'
                                ? 'bg-amber-500/95 border border-amber-300/30'
                                : 'bg-red-600/95 border border-red-400/40'
                            }`}
                          >
                            {!isResolved && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            )}
                            {mp.status}
                          </span>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] font-bold shadow-md">
                          {mp.id}
                        </span>
                      </div>

                      {/* Explicit "Full Size" Button on bottom-right */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullSizeModal({
                            url: mp.photoUrl,
                            name: mp.name,
                            age: mp.age,
                            gender: mp.gender,
                            category: mp.category,
                            status: mp.status,
                            id: mp.id,
                            clothing: mp.clothingDescription,
                            location: mp.lastKnownLocation,
                            contact: `${mp.contactPerson} (${mp.contactNumber})`,
                            incidentId: mp.incidentId,
                            mp,
                          });
                        }}
                        className="absolute bottom-3 right-3 z-10 px-2.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-blue-600 border border-white/25 hover:border-blue-400 backdrop-blur-md text-white font-bold text-[11px] flex items-center gap-1.5 shadow-lg transition-all duration-200 active:scale-95 group-hover/photo:bg-blue-600"
                        title="View photo in full size"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Full Size</span>
                      </button>

                      {/* Floating Person Name & Demographics on Photo Bottom */}
                      <div className="absolute bottom-3 left-3.5 right-26 text-white pointer-events-none">
                        <h3 className="font-black text-xl text-white tracking-tight drop-shadow-md leading-tight truncate">
                          {mp.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mt-0.5 drop-shadow-sm">
                          <span>{mp.age} years old</span>
                          <span>•</span>
                          <span className="uppercase tracking-wider">{mp.gender}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-b border-slate-700/80 relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white shadow-sm ${
                              isChild ? 'bg-blue-600' : 'bg-purple-600'
                            }`}
                          >
                            {mp.category}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white shadow-sm ${
                              isResolved
                                ? 'bg-emerald-600'
                                : mp.status === 'SIGHTED'
                                ? 'bg-amber-500'
                                : 'bg-red-600'
                            }`}
                          >
                            {mp.status}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px] font-bold">
                          {mp.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner shrink-0 ${
                            isChild
                              ? 'bg-blue-900/60 text-blue-300 border border-blue-500/40'
                              : 'bg-purple-900/60 text-purple-300 border border-purple-500/40'
                          }`}
                        >
                          <UserX className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-lg text-white leading-tight">{mp.name}</h3>
                          <div className="text-xs text-slate-300 font-medium mt-0.5">
                            {mp.age} years • {mp.gender}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Content Details */}
                  <div className="p-4 space-y-3">
                    {/* Clothing Description Highlight */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Clothing &amp; Appearance
                      </span>
                      <p className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2">
                        {mp.clothingDescription || 'No description provided'}
                      </p>
                    </div>

                    {/* Operational Telemetry Grid */}
                    <div className="space-y-2 pt-1 text-xs">
                      {/* Location */}
                      <div className="flex items-start gap-2.5 text-slate-600">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-0.5">
                            Last Known Location
                          </span>
                          <span className="font-semibold text-slate-800 truncate block">
                            {mp.lastKnownLocation}
                          </span>
                        </div>
                      </div>

                      {/* Last Seen Time */}
                      <div className="flex items-start gap-2.5 text-slate-600">
                        <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-0.5">
                            Time Last Seen
                          </span>
                          <span className="font-semibold text-slate-800 block">
                            {mp.lastSeenTime}
                          </span>
                        </div>
                      </div>

                      {/* Contact Person */}
                      <div className="flex items-start gap-2.5 text-slate-600">
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-0.5">
                            Reporting Contact
                          </span>
                          <span className="font-semibold text-slate-800 block truncate">
                            {mp.contactPerson}{' '}
                            <span className="font-mono text-slate-500 font-normal">
                              ({mp.contactNumber})
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Medical Alert Notice (High Priority) */}
                    {mp.medicalNotes && (
                      <div className="p-2.5 rounded-xl bg-red-50/90 border border-red-200/90 text-xs text-red-900 flex items-start gap-2 shadow-2xs">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div className="leading-tight">
                          <span className="font-extrabold text-[10px] uppercase tracking-wider text-red-700 block">
                            Medical Alert
                          </span>
                          <span className="font-semibold text-red-900">{mp.medicalNotes}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2.5">
                  <button
                    onClick={() => runAiScanner(mp)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-98"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI CCTV Scan</span>
                  </button>

                  <Link
                    href={`/incidents/${mp.incidentId}`}
                    className="py-2 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/90 text-xs font-bold transition shadow-2xs"
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

            {/* Drag & Drop or Select from Folder Photo Upload Zone */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-800 font-bold block text-xs flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Photo of Missing Person (Drag &amp; Drop or Select from Folder)</span>
                </label>
                <span className="text-[10px] text-blue-700 bg-blue-50 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  Optional • AI Facial Indexing
                </span>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="missing-person-photo-input"
              />

              {!photoUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/90 scale-[1.01] ring-4 ring-blue-500/10'
                      : 'border-slate-300 hover:border-blue-500 bg-slate-50/70 hover:bg-slate-50 shadow-inner/5'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      Drag &amp; drop photo here, or choose an option:
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Supports JPG, PNG, WEBP, HEIC (Max 10MB) • Used for CCTV facial matching
                    </p>
                  </div>

                  {/* Prominent Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 text-slate-800 hover:text-blue-700 font-bold text-xs flex items-center gap-2 shadow-xs transition active:scale-98"
                    >
                      <FolderOpen className="w-4 h-4 text-blue-600" />
                      <span>Select from Folder</span>
                    </button>
                    <span className="text-xs text-slate-400 font-medium">or drop file here</span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() =>
                        setFullSizeModal({
                          url: photoUrl,
                          name: name || 'Uploaded Reference Photo',
                          age: age || undefined,
                          gender: gender,
                          category: category,
                          clothing: clothing,
                          location: lastLocation,
                        })
                      }
                      className="w-14 h-14 rounded-xl overflow-hidden border-2 border-blue-400 bg-white shadow-xs shrink-0 cursor-pointer relative group/preview"
                      title="Click to view full size photo"
                    >
                      <img
                        src={photoUrl}
                        alt="Uploaded preview"
                        className="w-full h-full object-cover group-hover/preview:scale-105 transition"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition flex items-center justify-center text-white">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[220px]">
                          {fileName || 'Photo Uploaded'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono mt-0.5 flex items-center gap-2">
                        {fileSize && <span>{fileSize}</span>}
                        <span className="text-emerald-700 font-semibold">• Ready for AI Indexing</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setFullSizeModal({
                          url: photoUrl,
                          name: name || 'Uploaded Reference Photo',
                          age: age || undefined,
                          gender: gender,
                          category: category,
                          clothing: clothing,
                          location: lastLocation,
                        })
                      }
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-2xs flex items-center gap-1.5 transition"
                      title="View full size photo"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Full</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-2xs flex items-center gap-1.5 transition"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Change</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition"
                      title="Remove photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('LIST')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
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
            <div className="flex items-center gap-3.5">
              {scanningTarget.photoUrl ? (
                <div
                  onClick={() =>
                    setFullSizeModal({
                      url: scanningTarget.photoUrl,
                      name: scanningTarget.name,
                      age: scanningTarget.age,
                      gender: scanningTarget.gender,
                      category: scanningTarget.category,
                      status: scanningTarget.status,
                      id: scanningTarget.id,
                      clothing: scanningTarget.clothingDescription,
                      location: scanningTarget.lastKnownLocation,
                      incidentId: scanningTarget.incidentId,
                      mp: scanningTarget,
                    })
                  }
                  className="w-14 h-14 rounded-xl overflow-hidden border-2 border-blue-500 shadow-xs shrink-0 bg-slate-100 cursor-pointer relative group/scantarg"
                  title="Click to view full size photo"
                >
                  <img
                    src={scanningTarget.photoUrl}
                    alt={scanningTarget.name}
                    className="w-full h-full object-cover group-hover/scantarg:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/scantarg:opacity-100 transition flex items-center justify-center text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div className="w-13 h-13 rounded-xl bg-blue-100 border-2 border-blue-500 text-blue-700 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <UserX className="w-6 h-6" />
                </div>
              )}
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

      {/* FULL-SIZE IMAGE LIGHTBOX MODAL */}
      {fullSizeModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setFullSizeModal(null)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
          >
            {/* Modal Header */}
            <div className="p-4 px-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white truncate">
                      {fullSizeModal.name}
                    </h3>
                    {fullSizeModal.id && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-bold shrink-0">
                        {fullSizeModal.id}
                      </span>
                    )}
                    {fullSizeModal.status && (
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-white ${
                          fullSizeModal.status === 'REUNITED' || fullSizeModal.status === 'LOCATED'
                            ? 'bg-emerald-600'
                            : fullSizeModal.status === 'SIGHTED'
                            ? 'bg-amber-500'
                            : 'bg-red-600'
                        }`}
                      >
                        {fullSizeModal.status}
                      </span>
                    )}
                  </div>
                  {(fullSizeModal.age || fullSizeModal.gender) && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {fullSizeModal.age ? `${fullSizeModal.age} years old • ` : ''}
                      {fullSizeModal.gender}
                      {fullSizeModal.category ? ` • ${fullSizeModal.category}` : ''}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {fullSizeModal.mp && (
                  <button
                    type="button"
                    onClick={() => {
                      const target = fullSizeModal.mp!;
                      setFullSizeModal(null);
                      runAiScanner(target);
                    }}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI CCTV Scan</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setFullSizeModal(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Full-Size Image Container */}
            <div className="flex-1 min-h-[300px] max-h-[68vh] bg-black/80 flex items-center justify-center p-3 sm:p-5 overflow-auto relative">
              <img
                src={fullSizeModal.url}
                alt={fullSizeModal.name}
                className="max-h-[64vh] max-w-full w-auto object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Modal Footer with Case Details */}
            <div className="p-3.5 px-5 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
              <div className="space-y-1 min-w-0">
                {fullSizeModal.clothing && (
                  <div className="truncate">
                    <strong className="text-slate-300">Clothing:</strong> {fullSizeModal.clothing}
                  </div>
                )}
                {fullSizeModal.location && (
                  <div className="truncate">
                    <strong className="text-slate-300">Last Spot:</strong> {fullSizeModal.location}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {fullSizeModal.incidentId && (
                  <Link
                    href={`/incidents/${fullSizeModal.incidentId}`}
                    onClick={() => setFullSizeModal(null)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition"
                  >
                    View Case Dossier
                  </Link>
                )}
                <a
                  href={fullSizeModal.url}
                  target="_blank"
                  rel="noreferrer"
                  download={`missing-person-${fullSizeModal.id || 'photo'}.png`}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
