'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  UserX,
  Users,
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  Upload,
  Radio,
  Eye,
  EyeOff,
  Flame,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Building2,
  Navigation,
  Check,
  Search,
  Activity,
  Maximize2,
  PackageSearch,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import { IncidentType } from '@/types';
import { IncidentGraph } from '@/components/incidents/IncidentGraph';
import { SecureMeshLiveMap } from '@/components/map/SecureMeshLiveMap';
import { SecureMeshControlCard } from '@/components/control-room/SecureMeshControlCard';
import { FamilySafetyCard } from '@/components/common/FamilySafetyCard';

const getIncidentType = (cat: string): IncidentType => {
  switch (cat) {
    case 'Missing Person':
      return 'MISSING_PERSON';
    case 'Theft / Chain Snatching':
      return 'THEFT';
    case 'Emergency / SOS':
      return 'SOS';
    case 'Suspicious Activity':
      return 'SUSPICIOUS_ACTIVITY';
    case 'Crowd Issue':
      return 'CROWD_SURGE';
    default:
      return 'OTHER';
  }
};

export default function SecureMeshMasterPage() {
  const { state, createIncident, addNotification, assignResponder } = useSuraksha();

  // Mobile Mockup Report State
  const [selectedCategory, setSelectedCategory] = useState('Missing Person');
  const [reportDetails, setReportDetails] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [locationShared, setLocationShared] = useState(true);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Missing Person / Object State
  const [missingTab, setMissingTab] = useState<'person' | 'object'>('person');
  const [missingVisibility, setMissingVisibility] = useState<'public' | 'private' | 'anonymous'>('public');

  // Threat Monitoring State
  const [threatTab, setThreatTab] = useState<'reports' | 'hotspots'>('reports');

  // Volunteer Coordination State
  const [volunteerTab, setVolunteerTab] = useState<'available' | 'assigned'>('available');
  const [assignedVols, setAssignedVols] = useState<Record<string, boolean>>({
    'V-102': true,
  });

  // Alert Center State
  const [alertFilter, setAlertFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO'>('ALL');

  // Handle Mobile Mockup Submit
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInc = createIncident({
      title: `${selectedCategory} Reported near Zone B`,
      type: getIncidentType(selectedCategory),
      location: 'Zone B - Main Pathway',
      description: reportDetails || 'Incident reported via mobile quick interface.',
      severity: selectedCategory === 'Emergency / SOS' ? 'CRITICAL' : 'HIGH',
      verificationStatus: 'UNVERIFIED',
      coords: [21.12785, 79.0669],
      tags: [selectedCategory, 'Zone B', 'Citizen Quick Report'],
      nearbyCctvIds: ['CCTV-12'],
      nearbyHelpDeskId: 'Desk-3',
      reporter: {
        name: isAnonymous ? 'Anonymous Pilgrim' : 'Pravin Godghate',
        phone: isAnonymous ? 'Hidden' : '+91 98221 00099',
        role: 'CITIZEN',
      },
    });
    addNotification({
      type: selectedCategory === 'Emergency / SOS' ? 'CRITICAL' : 'WARNING',
      title: 'Incident Dispatched',
      message: `New Incident ${newInc.id} created: ${selectedCategory}`,
      incidentId: newInc.id,
      actionLink: `/incidents/${newInc.id}`,
    });
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportDetails('');
    }, 4000);
  };

  const categories = [
    { name: 'Missing Person', icon: UserX, color: 'text-blue-600 bg-blue-50' },
    { name: 'Theft / Chain Snatching', icon: ShieldAlert, color: 'text-blue-600 bg-blue-50' },
    { name: 'Suspicious Activity', icon: Eye, color: 'text-blue-600 bg-blue-50' },
    { name: 'Emergency / SOS', icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
    { name: 'Crowd Issue', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { name: 'Other', icon: Flame, color: 'text-blue-600 bg-blue-50' },
  ];

  const threats = [
    {
      title: 'Suspicious Activity',
      location: 'Zone B - Near Exit 3',
      time: '10:15 AM',
      color: 'bg-red-500',
    },
    {
      title: 'Chain Snatching',
      location: 'Zone A - Food Court',
      time: '09:32 AM',
      color: 'bg-amber-500',
    },
    {
      title: 'Unattended Object',
      location: 'Zone C - Parking Area',
      time: '08:20 AM',
      color: 'bg-yellow-500',
    },
    {
      title: 'Violence',
      location: 'Zone B - Near Stage',
      time: '07:45 AM',
      color: 'bg-red-500',
    },
    {
      title: 'Unsafe Area',
      location: 'Zone D - Backside Path',
      time: '06:10 AM',
      color: 'bg-yellow-500',
    },
  ];

  const volunteers = [
    { id: 'V-102', zone: 'Zone B', dist: '250 m', status: 'Available', busy: false },
    { id: 'V-108', zone: 'Zone C', dist: '180 m', status: 'Busy', busy: true },
    { id: 'V-117', zone: 'Zone B', dist: '430 m', status: 'Available', busy: false },
    { id: 'V-125', zone: 'Zone A', dist: '520 m', status: 'Available', busy: false },
  ];

  const alerts = [
    {
      text: 'SOS - Zone B',
      time: '2 min ago',
      level: 'Critical',
      filter: 'CRITICAL',
      badge: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500',
    },
    {
      text: 'Crowd density high - Zone C',
      time: '5 min ago',
      level: 'High',
      filter: 'HIGH',
      badge: 'bg-orange-50 text-orange-700 border-orange-200',
      dot: 'bg-orange-500',
    },
    {
      text: 'Missing child - Zone A',
      time: '8 min ago',
      level: 'Medium',
      filter: 'MEDIUM',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
    },
    {
      text: 'Volunteer assigned - INC-2048',
      time: '12 min ago',
      level: 'Info',
      filter: 'INFO',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    },
    {
      text: 'Threat report - Zone B',
      time: '18 min ago',
      level: 'Medium',
      filter: 'MEDIUM',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
    },
  ];

  const filteredAlerts =
    alertFilter === 'ALL' ? alerts : alerts.filter((a) => a.filter === alertFilter);

  const architectureSteps = [
    {
      step: '1',
      title: 'Users & Sources',
      items: ['Citizens', 'Police', 'Volunteers', 'CCTV infrastructure', 'Help Desks'],
      icon: Users,
    },
    {
      step: '2',
      title: 'Data Layer',
      items: ['Reports', 'Location', 'Media (Photo/Video)', 'Live Feeds'],
      icon: Camera,
    },
    {
      step: '3',
      title: 'AI Verification Layer',
      items: ['Duplicate Detection', 'Evidence Consistency', 'Time & Location Correlation', 'Confidence Scoring'],
      icon: Sparkles,
    },
    {
      step: '4',
      title: 'Incident Relationship Graph',
      items: ['Link Related Incidents', 'CCTV + Sightings', 'Crowd Zones', 'Responders & Help Desks'],
      icon: Activity,
    },
    {
      step: '5',
      title: 'Response Engine',
      items: ['Find Nearest Resources', 'Suggest Actions', 'Assign Responders', 'Track Resolution'],
      icon: Shield,
    },
    {
      step: '6',
      title: 'Control Room',
      items: ['Live Map', 'Alerts', 'Incident Monitoring', 'Audit Log'],
      icon: Building2,
    },
  ];

  const keyFeatures = [
    'Incident Reporting & ID',
    'Emergency Response (SOS / Backup)',
    'Surveillance Management (CCTV + Crowd)',
    'Missing Person / Object Module',
    'Threat Monitoring (Hotspots)',
    'Volunteer Coordination',
    'Control Room Dashboard',
    'Alert System',
    'Relative / Family Safety',
    'Live Location Tracking',
    'Voice & Video Communication',
    'Status Tracking & Audit Log',
  ];

  return (
    <div className="w-full bg-[#F1F5F9] text-slate-900 pb-16">
      {/* Top Welcome Notification Pill for Event Coordinators */}
      <div className="bg-white border-b border-slate-200 py-2 px-4 sm:px-6 shadow-2xs">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-800">Operational Grid Active:</span>
            <span className="text-slate-600">Deekshabhoomi Annual Gathering 2026 • 51,480 Active Pilgrims</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Live Sync: <strong className="text-slate-800 font-mono">10:55 AM</strong></span>
            <span>Grid AI Confidence: <strong className="text-emerald-600 font-bold">87% Optimal</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* =========================================================================
            ROW 1: Core Operations (5 Panels Grid)
            1. Report an Incident (Mobile Mockup)
            2. Incident Created (INC-2048)
            3. AI Verification & Incident Graph
            4. Live Security Map
            5. Control Room Dashboard
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4.5 items-stretch">
          {/* 1. Report an Incident (Interactive Smartphone Mockup) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">1. Report an Incident</h3>
              <p className="text-xs text-slate-500 mt-0.5 mb-3">Quick. Simple. From Anywhere.</p>
            </div>

            {/* Smartphone Enclosure */}
            <div className="w-full rounded-[24px] border-4 border-slate-800 bg-white shadow-md p-3 flex flex-col flex-1 overflow-hidden">
              {/* Phone Header Bar */}
              <div className="rounded-xl bg-[#0B1528] text-white p-2.5 flex items-center justify-between shadow-xs mb-3">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/30" />
                  <span className="font-extrabold text-[11px] tracking-wider text-white">SECUREMESH</span>
                </div>
                <div className="space-y-0.5 cursor-pointer">
                  <div className="w-3.5 h-0.5 bg-white/80 rounded"></div>
                  <div className="w-3.5 h-0.5 bg-white/80 rounded"></div>
                  <div className="w-2.5 h-0.5 bg-white/80 rounded ml-auto"></div>
                </div>
              </div>

              {/* Title Inside Phone */}
              <div className="text-xs font-bold text-slate-800 mb-2">Report Incident</div>

              {/* Category Grid (2x3) */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`p-1.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-2xs scale-98'
                          : 'border-slate-100 bg-slate-50/70 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-blue-600' : 'text-slate-600'}`} />
                      <span
                        className={`text-[8.5px] font-semibold leading-tight line-clamp-2 ${
                          isSelected ? 'text-blue-900 font-bold' : 'text-slate-700'
                        }`}
                      >
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Add Details Form */}
              <form onSubmit={handleReportSubmit} className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Add Details</label>
                  <textarea
                    rows={2}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Describe what happened..."
                    className="w-full text-[11px] p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* 3 Action Badges */}
                <div className="grid grid-cols-3 gap-1 py-1">
                  <button
                    type="button"
                    onClick={() => alert('Photo / Video captured and attached.')}
                    className="flex flex-col items-center p-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700"
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-600 mb-0.5" />
                    <span className="text-[7.5px] font-semibold text-center leading-tight">Add Photo/Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLocationShared(!locationShared)}
                    className={`flex flex-col items-center p-1 rounded-lg border text-slate-700 transition ${
                      locationShared ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-teal-600 mb-0.5" />
                    <span className="text-[7.5px] font-semibold text-center leading-tight">Share Live Location</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`flex flex-col items-center p-1 rounded-lg border text-slate-700 transition ${
                      isAnonymous ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    {isAnonymous ? (
                      <EyeOff className="w-3.5 h-3.5 text-indigo-600 mb-0.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-slate-500 mb-0.5" />
                    )}
                    <span className="text-[7.5px] font-semibold text-center leading-tight">Report Anonymously</span>
                  </button>
                </div>

                {/* Submit Report Button */}
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition active:scale-98"
                >
                  {reportSubmitted ? '✓ Dispatched to Police & Volunteers!' : 'Submit Report'}
                </button>
              </form>
            </div>
          </div>

          {/* 2. Incident Created (INC-2048 Card) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Incident Created</h3>
              <p className="text-xs text-slate-500 mt-0.5">Unique ID, Location, Time, Evidence.</p>
            </div>

            <div className="space-y-3.5 my-auto pt-3">
              {/* ID & Priority Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-red-600 text-white flex items-center justify-center shadow-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900 tracking-tight">INC-2048</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                  High Priority
                </span>
              </div>

              {/* Category */}
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Category</span>
                <span className="text-xs font-bold text-slate-800">Missing Person</span>
              </div>

              {/* Location */}
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Location</span>
                <span className="text-xs font-bold text-slate-800">Zone B - Main Pathway</span>
              </div>

              {/* Time */}
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Time</span>
                <span className="text-xs font-medium text-slate-700 font-mono">10:42 AM, 24 Sep 2025</span>
              </div>

              {/* Evidence */}
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Evidence
                </span>
                <div className="flex items-center gap-2">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                    <img
                      src="https://images.unsplash.com/photo-1543332164-6e82f355badc?w=200&q=80"
                      alt="Aarohi missing child evidence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <div className="font-semibold text-slate-800">Photo attached</div>
                    <div className="text-blue-600 font-medium">+1 more</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Description
                </span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                  Child wearing blue shirt, last seen near Main Pathway. Family is with the reporter.
                </p>
              </div>

              {/* Success Alert Banner */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Report submitted successfully!</span>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <Link
                href="/incidents/INC-2048"
                className="text-[11px] text-slate-500 hover:text-blue-600 font-medium transition block"
              >
                You can update or add more info later{' '}
                <span className="text-blue-600 font-bold">(Incident ID: INC-2048)</span>
              </Link>
            </div>
          </div>

          {/* 3. AI Verification & Incident Graph */}
          <IncidentGraph incidentId="INC-2048" />

          {/* 4. Live Security Map */}
          <SecureMeshLiveMap />

          {/* 5. Control Room Dashboard */}
          <SecureMeshControlCard />
        </div>

        {/* =========================================================================
            ROW 2: Operational Workflows (5 Panels Grid)
            6. Missing Person / Object
            7. Threat Monitoring
            8. Volunteer Coordination
            9. Family Safety
            10. Alert Center
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4.5 items-stretch">
          {/* 6. Missing Person / Object */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Missing Person / Object</h3>
              <p className="text-xs text-slate-500 mt-0.5">Post a missing person or object, set visibility, track updates.</p>

              {/* Tabs */}
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl mt-3 text-xs font-semibold">
                <button
                  onClick={() => setMissingTab('person')}
                  className={`py-1.5 rounded-lg transition ${
                    missingTab === 'person' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Missing Person
                </button>
                <button
                  onClick={() => setMissingTab('object')}
                  className={`py-1.5 rounded-lg transition ${
                    missingTab === 'object' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Missing Object
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-2.5 my-auto pt-3">
              {/* Photo & Name */}
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-2xs">
                  <img
                    src="https://images.unsplash.com/photo-1543332164-6e82f355badc?w=200&q=80"
                    alt="Aarohi"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 font-semibold block">Name (Optional)</label>
                  <input
                    type="text"
                    defaultValue="Aarohi"
                    className="w-full text-xs font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block">Age</label>
                <input
                  type="text"
                  defaultValue="7"
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200"
                />
              </div>

              {/* Last Seen */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block">Last Seen</label>
                <input
                  type="text"
                  defaultValue="Zone B - Main Pathway"
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200"
                />
              </div>

              {/* Time */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block">Time</label>
                <input
                  type="text"
                  defaultValue="10:30 AM"
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block">Description</label>
                <textarea
                  rows={2}
                  defaultValue="Blue shirt, ponytail, pink shoes"
                  className="w-full text-xs text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200"
                />
              </div>

              {/* Visibility Radio Options */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">Visibility</label>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      checked={missingVisibility === 'public'}
                      onChange={() => setMissingVisibility('public')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Public</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      checked={missingVisibility === 'private'}
                      onChange={() => setMissingVisibility('private')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Private</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      checked={missingVisibility === 'anonymous'}
                      onChange={() => setMissingVisibility('anonymous')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Anonymous</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Post Missing Report Button */}
            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/missing-person"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center block shadow-md shadow-blue-500/20 transition active:scale-98"
              >
                Post Missing Report
              </Link>
            </div>
          </div>

          {/* 7. Threat Monitoring */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Threat Monitoring</h3>
              <p className="text-xs text-slate-500 mt-0.5">Report suspicious activity, theft, violence, unsafe areas and find hotspots.</p>

              {/* Tabs */}
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl mt-3 text-xs font-semibold">
                <button
                  onClick={() => setThreatTab('reports')}
                  className={`py-1.5 rounded-lg transition ${
                    threatTab === 'reports' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Threat Reports
                </button>
                <button
                  onClick={() => setThreatTab('hotspots')}
                  className={`py-1.5 rounded-lg transition ${
                    threatTab === 'hotspots' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hotspot Map
                </button>
              </div>
            </div>

            {/* Feed List */}
            <div className="divide-y divide-slate-100 my-auto py-2">
              {threats.map((threat, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-1 rounded transition">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${threat.color} shrink-0`} />
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-tight">{threat.title}</div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{threat.location}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{threat.time}</span>
                </div>
              ))}
            </div>

            {/* Footer Link */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <Link
                href="/security-report"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
              >
                Log New Threat Incident <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* 8. Volunteer Coordination */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Volunteer Coordination</h3>
              <p className="text-xs text-slate-500 mt-0.5">Find nearby volunteers and assign for quick response.</p>

              {/* Tabs */}
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl mt-3 text-xs font-semibold">
                <button
                  onClick={() => setVolunteerTab('available')}
                  className={`py-1.5 rounded-lg transition ${
                    volunteerTab === 'available' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Available Volunteers
                </button>
                <button
                  onClick={() => setVolunteerTab('assigned')}
                  className={`py-1.5 rounded-lg transition ${
                    volunteerTab === 'assigned' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Assigned
                </button>
              </div>
            </div>

            {/* Volunteers List */}
            <div className="space-y-2.5 my-auto py-2">
              {volunteers.map((vol) => {
                const isAssigned = assignedVols[vol.id];
                return (
                  <div
                    key={vol.id}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{vol.id}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                          <span>{vol.zone}</span>
                          <span>•</span>
                          <span>{vol.dist}</span>
                          <span>•</span>
                          <span className={vol.busy ? 'text-amber-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                            {vol.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAssignedVols((prev) => ({ ...prev, [vol.id]: !prev[vol.id] }));
                        addNotification({
                          type: 'INFO',
                          title: 'Volunteer Status Updated',
                          message: `${vol.id} status updated to ${isAssigned ? 'Standby' : 'Dispatched to Zone B'}`,
                          actionLink: '/volunteers',
                        });
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition shadow-2xs ${
                        isAssigned
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isAssigned ? 'Assigned' : 'Assign'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Link */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <Link
                href="/volunteers"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
              >
                Open Volunteer Command Map <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* 9. Family Safety */}
          <FamilySafetyCard />

          {/* 10. Alert Center */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Alert Center</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time alerts for quick action.</p>

              {/* Multi-priority filter pills */}
              <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 text-[11px] font-semibold">
                {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAlertFilter(filter)}
                    className={`px-2 py-0.5 rounded-full capitalize transition whitespace-nowrap ${
                      alertFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter === 'ALL' ? 'All' : filter.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert items list */}
            <div className="divide-y divide-slate-100 my-auto py-2">
              {filteredAlerts.map((alert, i) => (
                <div key={i} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${alert.dot} shrink-0`} />
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{alert.text}</div>
                      <div className="text-[10px] text-slate-400">{alert.time}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${alert.badge}`}>
                    {alert.level}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Link */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <Link
                href="/incidents"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
              >
                View Master Audit Stream <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            ROW 3: System Architecture, Key Features & Brand Banner
            11. System Architecture (6-box Connected Pipeline)
            12. Key Features (12-point Checklist)
            13. SECUREMESH Brand Banner
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4.5 items-stretch">
          {/* 11. System Architecture (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">System Architecture</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                AI-powered, connected, and built for real-time coordination.
              </p>
            </div>

            {/* 6 Connected Steps Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4">
              {architectureSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between group hover:border-blue-400 hover:bg-blue-50/30 transition shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                          {step.step}
                        </div>
                        <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                      </div>
                      <h4 className="text-[11px] font-bold text-slate-900 leading-tight mb-2">
                        {step.title}
                      </h4>
                      <ul className="space-y-1 text-[9.5px] text-slate-600">
                        {step.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-blue-500 font-bold">•</span>
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Blue Arrow pointing to next step */}
                    {idx < 5 && (
                      <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-blue-400 font-bold text-xs">
                        →
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Latency: &lt;180ms End-to-End</span>
              <span className="font-medium">Data Integrity: Cryptographically Signed Audit Ledger</span>
            </div>
          </div>

          {/* 12. Key Features (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Key Features</h3>
              <p className="text-xs text-slate-500 mt-0.5">As per your plan</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-2 my-auto pt-2 text-xs">
              {keyFeatures.map((feat, i) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-medium leading-tight">{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
                ✓ 100% Implemented &amp; Live
              </span>
            </div>
          </div>

          {/* 13. SECUREMESH Brand Banner (2 cols) */}
          <div className="lg:col-span-2 bg-[#0B1528] rounded-2xl border border-slate-800 p-5 text-white shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-cyan-400 fill-cyan-400/30" />
                </div>
                <span className="font-black text-lg tracking-wider text-white">SECUREMESH</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                From scattered reports to a connected, verified and actionable response — for safer communities.
              </p>
            </div>

            {/* 4 Step Process Icons */}
            <div className="py-4">
              <div className="flex items-center justify-between text-[10px] text-cyan-300 font-semibold">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-center mb-1">
                    📄
                  </div>
                  <span>Report</span>
                </div>
                <span>→</span>
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-center mb-1">
                    🔍
                  </div>
                  <span>Analyze</span>
                </div>
                <span>→</span>
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-center mb-1">
                    🔗
                  </div>
                  <span>Connect</span>
                </div>
                <span>→</span>
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-center mb-1">
                    🛡️
                  </div>
                  <span>Respond</span>
                </div>
              </div>
            </div>

            <Link
              href="/control-room"
              className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs text-center block shadow-md shadow-cyan-500/20 transition"
            >
              Enter Control Room →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
