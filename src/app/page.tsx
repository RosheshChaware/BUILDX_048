'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Radio,
  Eye,
  Flame,
  ArrowRight,
  Maximize2,
  Search,
  ExternalLink,
  ChevronRight,
  Send,
  DoorOpen,
  Filter,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import dynamic from 'next/dynamic';
import { IncidentType, Severity } from '@/types';
import { IncidentGraph } from '@/components/incidents/IncidentGraph';

const WebcamCrowdAnalyticsMap = dynamic(
  () => import('@/components/map/WebcamCrowdAnalyticsMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] bg-[#0E172B] border border-[#1C273E] rounded-lg flex items-center justify-center text-slate-400 text-xs">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-mono">INITIALIZING TACTICAL CROWD ANALYTICS...</span>
        </div>
      </div>
    ),
  }
);

export default function SOCDashboardPage() {
  const {
    state,
    createIncident,
    addNotification,
    assignResponder,
    triggerSos,
    executeCrowdDiversion,
  } = useSuraksha();

  // Quick Report Form State
  const [quickType, setQuickType] = useState<IncidentType>('MISSING_PERSON');
  const [quickLocation, setQuickLocation] = useState('Zone B - Main Pathway');
  const [quickDetails, setQuickDetails] = useState('');
  const [quickSeverity, setQuickSeverity] = useState<Severity>('HIGH');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Incident Feed Filter State
  const [feedFilter, setFeedFilter] = useState<'ALL' | 'CRITICAL' | 'MISSING' | 'SECURITY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Active incidents & KPI calculations
  const activeIncidents = state.incidents.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED'
  );
  const criticalCount = activeIncidents.filter((i) => i.severity === 'CRITICAL').length;
  const highCount = activeIncidents.filter((i) => i.severity === 'HIGH').length;
  const missingCount = state.missingPersons.filter(
    (mp) => mp.status === 'SEARCHING' || mp.status === 'SIGHTED'
  ).length;
  const activeVolunteers = state.volunteers.filter((v) => v.status !== 'OFFLINE').length;
  const onSceneVolunteers = state.volunteers.filter(
    (v) => v.status === 'RESPONDING' || v.status === 'ASSIGNED'
  ).length;
  const crowdAlertsCount = state.crowdZones.filter(
    (z) => z.riskColor === 'RED' || z.riskColor === 'ORANGE'
  ).length;
  const sosCount = state.incidents.filter((i) => i.type === 'SOS' && i.status !== 'RESOLVED').length;

  // Filtered incidents for feed
  const filteredFeed = state.incidents.filter((inc) => {
    if (feedFilter === 'CRITICAL' && inc.severity !== 'CRITICAL') return false;
    if (feedFilter === 'MISSING' && inc.type !== 'MISSING_PERSON') return false;
    if (
      feedFilter === 'SECURITY' &&
      inc.type !== 'THEFT' &&
      inc.type !== 'SUSPICIOUS_ACTIVITY' &&
      inc.type !== 'HARASSMENT'
    )
      return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle Quick Incident Intake
  const handleQuickReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newInc = createIncident({
      title: `${quickType.replace('_', ' ')}: ${quickLocation}`,
      type: quickType,
      location: quickLocation,
      description: quickDetails || 'Report logged directly from SOC intake terminal.',
      severity: quickSeverity,
      verificationStatus: 'UNDER_REVIEW',
      coords: [21.12785, 79.0669],
      nearbyCctvIds: ['CCTV-12'],
      nearbyHelpDeskId: 'Desk-3',
      tags: [quickType, 'SOC Intake', 'Deekshabhoomi'],
      reporter: {
        name: 'Control Room Operator',
        phone: '+91 712 256 0101',
        role: 'CONTROL_ROOM',
      },
    });

    addNotification({
      type: quickSeverity === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
      title: `Incident ${newInc.id} Registered`,
      message: `${newInc.title} assigned to nearest responders.`,
      incidentId: newInc.id,
      actionLink: `/incidents/${newInc.id}`,
    });

    setReportSubmitted(true);
    setQuickDetails('');
    setTimeout(() => setReportSubmitted(false), 3000);
  };

  // Quick SOS Beacon Trigger
  const handleTriggerEmergencySos = () => {
    triggerSos({
      category: 'POLICE',
      locationName: 'Zone B - Main Pathway (Central Concourse)',
      coords: [21.12785, 79.0669],
      userName: 'SOC Operator (Manual Override)',
      userPhone: '112 / +91 712 256 0101',
      description: 'Immediate Police QRT deployment triggered from SOC dashboard.',
    });
    addNotification({
      type: 'CRITICAL',
      title: 'Emergency SOS Deployed',
      message: 'Police QRT Mobile Unit 1 dispatched to Zone B Main Pathway.',
      actionLink: '/sos',
    });
  };

  return (
    <div className="p-3 sm:p-4 space-y-3.5 max-w-[1780px] mx-auto bg-[#090E1A] text-slate-200">
      {/* =========================================================================
          1. SOC Operational Status Ribbon
         ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-md bg-[#0C1424] border border-[#1C273E] text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono font-bold text-slate-100 uppercase tracking-wider text-[11px]">
              SOC MONITORING: NORMAL OPS
            </span>
          </div>
          <span className="text-slate-600 font-mono hidden sm:inline">|</span>
          <div className="text-slate-400 text-[11px] hidden sm:flex items-center gap-1.5">
            <span>SECTOR:</span>
            <strong className="text-slate-200 font-mono">NAGPUR POLICE GRID (ZONES A-D)</strong>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-slate-400">
            OPTICAL FEED: <strong className="text-emerald-400">CAM-01 READY</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            INCIDENT STATE: <strong className="text-cyan-400">{activeIncidents.length} ACTIVE</strong>
          </span>
        </div>
      </div>

      {/* =========================================================================
          2. Compact SOC KPI Metrics Bar (6 Cards)
         ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5">
        {/* 1. Active Incidents */}
        <Link
          href="/incidents"
          className="p-2.5 rounded-lg bg-[#0E172B] border border-[#1C273E] border-l-3 border-l-red-500 hover:border-slate-600 transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold uppercase tracking-tight">Active Incidents</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-white leading-none">
              {activeIncidents.length}
            </span>
            <span className="text-[10px] text-red-400 font-medium">{criticalCount} Critical</span>
          </div>
        </Link>

        {/* 2. High Priority */}
        <Link
          href="/incidents?severity=HIGH"
          className="p-2.5 rounded-lg bg-[#0E172B] border border-[#1C273E] border-l-3 border-l-amber-500 hover:border-slate-600 transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold uppercase tracking-tight">High Priority</span>
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-white leading-none">
              {highCount}
            </span>
            <span className="text-[10px] text-amber-400 font-medium">
              {highCount > 0 ? `${highCount} P1 Action` : 'None Pending'}
            </span>
          </div>
        </Link>

        {/* 3. Missing Persons */}
        <Link
          href="/missing-person"
          className="p-2.5 rounded-lg bg-[#0E172B] border border-[#1C273E] border-l-3 border-l-blue-500 hover:border-slate-600 transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold uppercase tracking-tight">Missing Persons</span>
            <UserX className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-white leading-none">
              {missingCount}
            </span>
            <span className="text-[10px] text-blue-400 font-medium">
              {missingCount > 0 ? `${missingCount} Cases Active` : 'All Resolved'}
            </span>
          </div>
        </Link>

        {/* 4. Active Volunteers */}
        <Link
          href="/volunteers"
          className="p-2.5 rounded-lg bg-[#0E172B] border border-[#1C273E] border-l-3 border-l-emerald-500 hover:border-slate-600 transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold uppercase tracking-tight">Volunteers Active</span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-white leading-none">
              {activeVolunteers}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">
              {onSceneVolunteers} On Scene
            </span>
          </div>
        </Link>

        {/* 5. Crowd Alerts */}
        <Link
          href="/crowd"
          className="p-2.5 rounded-lg bg-[#0E172B] border border-[#1C273E] border-l-3 border-l-orange-500 hover:border-slate-600 transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold uppercase tracking-tight">Crowd Alerts</span>
            <Flame className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-white leading-none">
              {crowdAlertsCount}
            </span>
            <span className="text-[10px] text-orange-400 font-medium">
              {crowdAlertsCount > 0 ? `${crowdAlertsCount} Zones Warning` : 'Normal Flow'}
            </span>
          </div>
        </Link>

        {/* 6. SOS Requests */}
        <Link
          href="/sos"
          className="p-2.5 rounded-lg bg-[#0E172B] border border-[#1C273E] border-l-3 border-l-rose-500 hover:border-slate-600 transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold uppercase tracking-tight">SOS Requests</span>
            <Radio className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-white leading-none">
              {sosCount}
            </span>
            <span className="text-[10px] text-rose-400 font-medium">
              {sosCount > 0 ? `${sosCount} Active Alarms` : 'Standby'}
            </span>
          </div>
        </Link>
      </div>

      {/* =========================================================================
          3. Core Operations Grid: Visual Focus on Map & Incident Feed
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* =========================================================================
            LEFT COLUMN (7 cols): Tactical GIS Map + Crowd Flux & CCTV Telemetry
           ========================================================================= */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Main Visual Anchor: Live Tactical Security Map & Real Webcam Crowd Analytics */}
          <WebcamCrowdAnalyticsMap />

          {/* Lower Split: Crowd Bottlenecks & CCTV Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Exit Bottleneck & Flow Control */}
            <div className="p-3 rounded-lg bg-[#0E172B] border border-[#1C273E] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#1C273E]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <DoorOpen className="w-3.5 h-3.5 text-orange-400" />
                    <span>EXIT GATES &amp; PERIMETER EGRESS</span>
                  </div>
                  <Link
                    href="/crowd"
                    className="text-[10px] text-cyan-400 hover:underline font-mono"
                  >
                    Details →
                  </Link>
                </div>

                <div className="space-y-2 text-xs">
                  {state.exitGates.map((gate) => {
                    const isCritical = gate.riskLevel === 'CRITICAL';
                    return (
                      <div
                        key={gate.id}
                        className={`p-2 rounded border flex items-center justify-between ${
                          isCritical
                            ? 'bg-red-950/40 border-red-700/80 text-red-200'
                            : 'bg-[#090F1E] border-[#172239] text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-[11px] leading-tight">{gate.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Cap: {gate.capacity} • {gate.recommendedAction}
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                              isCritical
                                ? 'bg-red-950 border-red-800 text-red-300'
                                : gate.riskLevel === 'HIGH'
                                ? 'bg-amber-950 border-amber-800 text-amber-300'
                                : 'bg-[#0C1424] border-[#1E2B45] text-slate-300'
                            }`}
                          >
                            {gate.riskLevel} FLOW
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => executeCrowdDiversion('EXIT-03')}
                className="mt-2.5 w-full py-1.5 rounded bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
              >
                <span>Divert Flow to Gates 2 &amp; 4 (Gate 3 Relief)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* CCTV Telemetry Streams */}
            <div className="p-3 rounded-lg bg-[#0E172B] border border-[#1C273E] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#1C273E]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CCTV SENSOR GRID TELEMETRY</span>
                  </div>
                  <Link
                    href="/cctv"
                    className="text-[10px] text-cyan-400 hover:underline font-mono"
                  >
                    {state.cctvCameras.length} Feeds →
                  </Link>
                </div>

                <div className="space-y-2 text-xs">
                  {state.cctvCameras.slice(0, 3).map((cam) => {
                    const isOnline = cam.status === 'ONLINE';
                    return (
                      <div
                        key={cam.id}
                        className="p-2 rounded bg-[#090F1E] border border-[#172239] flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono font-bold text-[11px] text-slate-200 flex items-center gap-1.5">
                            <span>{cam.id}</span>
                            <span className="text-slate-500 font-normal">({cam.streamType})</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                            {cam.name} • {cam.zone}
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                              isOnline
                                ? 'bg-emerald-950 border-emerald-800 text-emerald-400'
                                : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}
                          >
                            {cam.status}
                          </span>
                          <div className="text-[9px] text-slate-500 mt-0.5">
                            RTSP • Feed 1
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#1C273E] flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>SENSOR GRID: {state.cctvCameras.filter((c) => c.status === 'ONLINE').length}/{state.cctvCameras.length} ONLINE</span>
                <span className="text-emerald-400">STREAM: ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (5 cols): Live Incident Feed, AI Verification Graph & Actions
           ========================================================================= */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Panel 1: Live Incident Feed & Triage */}
          <div className="bg-[#0E172B] rounded-lg border border-[#1C273E] p-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#1C273E]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Incident Feed ({filteredFeed.length})
                </h2>
              </div>
              <Link
                href="/incidents"
                className="text-[10px] text-cyan-400 hover:underline font-mono"
              >
                Master Registry →
              </Link>
            </div>

            {/* Filter Toolbar */}
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
              {(['ALL', 'CRITICAL', 'MISSING', 'SECURITY'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFeedFilter(f)}
                  className={`px-2 py-0.5 rounded font-semibold transition ${
                    feedFilter === f
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                      : 'bg-[#090F1E] text-slate-400 border border-[#172239] hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}

              <div className="relative flex-1 min-w-[120px] ml-auto">
                <Search className="absolute left-2 top-1.5 w-3 h-3 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID/Zone..."
                  className="w-full pl-6 pr-2 py-0.5 rounded bg-[#090F1E] border border-[#172239] text-[10px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            {/* Incident Items List */}
            <div className="mt-2 divide-y divide-[#172239] max-h-[260px] overflow-y-auto">
              {filteredFeed.map((inc) => {
                const isCritical = inc.severity === 'CRITICAL';
                const isHigh = inc.severity === 'HIGH';

                return (
                  <Link
                    key={inc.id}
                    href={`/incidents/${inc.id}`}
                    className="py-2 px-1 block hover:bg-[#0B1324] rounded transition group"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[11px] text-cyan-400">
                          {inc.id}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${
                            isCritical
                              ? 'bg-red-950 text-red-300 border-red-800'
                              : isHigh
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-blue-950 text-blue-300 border-blue-800'
                          }`}
                        >
                          {inc.severity}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{inc.timestamp}</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                      {inc.title}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-2.5 h-2.5 text-slate-500" />
                        <span className="truncate">{inc.location}</span>
                      </span>
                      <span className="font-mono text-slate-400 font-medium">
                        {inc.assignedResponder ? inc.assignedResponder.name.split(' ')[0] : 'Unassigned'}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Panel 2: AI Verification & Entity Correlation Graph */}
          <IncidentGraph incidentId={filteredFeed[0]?.id || activeIncidents[0]?.id} />

          {/* Panel 3: Quick Action Hub (Intake, SOS Override, Volunteer Dispatch) */}
          <div className="p-3 rounded-lg bg-[#0E172B] border border-[#1C273E] space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1C273E]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>RAPID INTAKE &amp; EMERGENCY DISPATCH</span>
              </div>
              <button
                onClick={handleTriggerEmergencySos}
                className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] shadow transition flex items-center gap-1"
              >
                <Radio className="w-2.5 h-2.5 animate-ping" />
                <span>Trigger Emergency SOS</span>
              </button>
            </div>

            {/* Quick Report Form */}
            <form onSubmit={handleQuickReport} className="space-y-2 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Category</label>
                  <select
                    value={quickType}
                    onChange={(e) => setQuickType(e.target.value as any)}
                    className="w-full px-2 py-1 rounded bg-[#090F1E] border border-[#172239] text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="MISSING_PERSON">Missing Person</option>
                    <option value="THEFT">Theft / Snatching</option>
                    <option value="SUSPICIOUS_ACTIVITY">Suspicious Activity</option>
                    <option value="CROWD_SURGE">Crowd Issue</option>
                    <option value="SOS">Emergency / SOS</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Location</label>
                  <input
                    type="text"
                    value={quickLocation}
                    onChange={(e) => setQuickLocation(e.target.value)}
                    className="w-full px-2 py-1 rounded bg-[#090F1E] border border-[#172239] text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Severity</label>
                  <select
                    value={quickSeverity}
                    onChange={(e) => setQuickSeverity(e.target.value as any)}
                    className="w-full px-2 py-1 rounded bg-[#090F1E] border border-[#172239] text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="CRITICAL">Critical (P1)</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={quickDetails}
                  onChange={(e) => setQuickDetails(e.target.value)}
                  placeholder="Describe incident or suspect description..."
                  className="w-full px-2 py-1 rounded bg-[#090F1E] border border-[#172239] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400 font-mono">
                  {reportSubmitted ? '✓ Incident registered & logged to audit ledger' : 'Assigns nearest available volunteers'}
                </span>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow flex items-center gap-1"
                >
                  <span>Dispatch Incident</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </form>

            {/* Volunteer Proximity Roster */}
            <div className="pt-2 border-t border-[#1C273E]">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Nearby Available Volunteers (Zone B)</span>
                <Link href="/volunteers" className="text-cyan-400 hover:underline">
                  All {state.volunteers.length} →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {state.volunteers
                  .filter((v) => v.status === 'AVAILABLE')
                  .slice(0, 2)
                  .map((vol) => {
                    const targetIncidentId = filteredFeed[0]?.id || activeIncidents[0]?.id || 'INC-2048';
                    return (
                      <div
                        key={vol.id}
                        className="p-1.5 rounded bg-[#090F1E] border border-[#172239] flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-[11px] text-slate-200 leading-tight">
                            {vol.id} - {vol.name.split(' ')[0]}
                          </div>
                          <div className="text-[9px] text-slate-500 font-mono">
                            {vol.zone} • {vol.assignedDistanceMeters ? `${vol.assignedDistanceMeters}m away` : 'Standby'}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            assignResponder(
                              targetIncidentId,
                              {
                                id: vol.id,
                                name: vol.name,
                                type: 'VOLUNTEER',
                                phone: vol.phone,
                                distanceMeters: vol.assignedDistanceMeters || 0,
                              },
                              'Control Room'
                            )
                          }
                          className="px-2 py-0.5 rounded bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-[10px] font-bold transition"
                        >
                          Assign
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
