'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Building2,
  Send,
  UserPlus,
  RefreshCw,
  Phone,
  FileText,
  Radio,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import DynamicSecurityMap from '@/components/map/DynamicSecurityMap';
import { IncidentStatus } from '@/types';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { state, updateIncidentStatus, assignResponder, transferIncident } = useSuraksha();

  const incident = state.incidents.find((i) => i.id === id);

  const [noteText, setNoteText] = useState('');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
  const [selectedDeskId, setSelectedDeskId] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  if (!incident) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Incident Not Found</h2>
        <p className="text-xs text-slate-400">No incident found with reference ID &quot;{id}&quot;.</p>
        <Link
          href="/incidents"
          className="inline-block px-4 py-2 rounded-lg bg-cyan-600 text-white text-xs font-semibold"
        >
          Return to Incident Registry
        </Link>
      </div>
    );
  }

  const handleStatusUpdate = (newStatus: IncidentStatus) => {
    updateIncidentStatus(
      incident.id,
      newStatus,
      `Status transitioned to ${newStatus} by ${state.currentRole} Operator.`
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    updateIncidentStatus(incident.id, incident.status, noteText.trim());
    setNoteText('');
  };

  const handleAssignVolunteer = () => {
    const vol = state.volunteers.find((v) => v.id === selectedVolunteerId);
    if (!vol) return;

    assignResponder(
      incident.id,
      {
        id: vol.id,
        name: vol.name,
        type: 'VOLUNTEER',
        phone: vol.phone,
        distanceMeters: Math.floor(80 + Math.random() * 450),
      },
      'Control Room Lead'
    );
    setShowAssignModal(false);
  };

  const handleTransfer = () => {
    if (!selectedDeskId || !transferReason.trim()) return;
    transferIncident(incident.id, selectedDeskId, transferReason.trim());
    setShowTransferModal(false);
    setTransferReason('');
  };

  const nearbyCctvs = state.cctvCameras.filter((c) => incident.nearbyCctvIds?.includes(c.id));
  const nearbyDesk = state.helpDesks.find((h) => h.id === incident.nearbyHelpDeskId);
  const availableVolunteers = state.volunteers.filter((v) => v.status === 'AVAILABLE');

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-400">Incident Reference:</span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 font-mono font-bold text-xs text-cyan-400">
            {incident.id}
          </span>
        </div>
      </div>

      {/* Incident Dossier Header */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  incident.severity === 'CRITICAL'
                    ? 'bg-red-950 text-red-300 border-red-800'
                    : incident.severity === 'HIGH'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-blue-950 text-blue-300 border-blue-800'
                }`}
              >
                {incident.severity} PRIORITY
              </span>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                {incident.type}
              </span>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                VERIFICATION: {incident.verificationStatus}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white">{incident.title}</h1>
          </div>

          {/* Current Status Pill */}
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-0.5">
              Current Stage
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-black font-mono text-cyan-300">
              {incident.status}
            </span>
          </div>
        </div>

        {/* Status Pipeline Step Indicator */}
        <div className="pt-2 border-t border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Incident Lifecycle Pipeline
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 text-[10px] font-mono text-center">
            {[
              'REPORTED',
              'UNDER_REVIEW',
              'VERIFIED',
              'ASSIGNED',
              'RESPONDING',
              'RESOLVED',
              'CLOSED',
            ].map((st, idx) => {
              const isCurrent = incident.status === st;
              const isPast =
                [
                  'REPORTED',
                  'UNDER_REVIEW',
                  'VERIFIED',
                  'ASSIGNED',
                  'RESPONDING',
                  'RESOLVED',
                  'CLOSED',
                ].indexOf(incident.status) >= idx;

              return (
                <button
                  key={st}
                  onClick={() => handleStatusUpdate(st as IncidentStatus)}
                  className={`py-1.5 px-1 rounded border transition ${
                    isCurrent
                      ? 'bg-cyan-600 text-white font-bold border-cyan-400 shadow-md'
                      : isPast
                      ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800/60'
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Details (Left 7) vs Actions & Map (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Summary, Evidence, Activity Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Incident Details Card */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Incident Information</span>
            </h2>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Location</span>
                <span className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {incident.location}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Reported Timestamp</span>
                <span className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {incident.timestamp}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Reporter</span>
                <span className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {incident.reporter.name} ({incident.reporter.role})
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Contact Number</span>
                <span className="text-slate-200 font-mono flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {incident.reporter.phone}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-slate-500 text-[11px] block mb-1">Description</span>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                {incident.description}
              </p>
            </div>

            {/* Evidence & Photo section */}
            {incident.evidence?.photoUrls && incident.evidence.photoUrls.length > 0 && (
              <div className="pt-2">
                <span className="text-slate-500 text-[11px] block mb-2">Attached Photo Evidence</span>
                <div className="flex gap-3">
                  {incident.evidence.photoUrls.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Incident Evidence"
                      className="w-28 h-28 object-cover rounded-xl border border-slate-700 shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {incident.tags && incident.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {incident.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Full Audit Activity Timeline</span>
            </h2>

            <div className="space-y-4 pl-2 border-l-2 border-slate-800 ml-2">
              {incident.timeline.map((evt) => (
                <div key={evt.id} className="relative pl-5">
                  <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-cyan-500 border-2 border-slate-950"></div>
                  <div className="flex items-center justify-between text-[11px] mb-0.5">
                    <span className="font-bold text-slate-200">{evt.title}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{evt.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-400">{evt.description}</p>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                    Actor: {evt.actor}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="pt-4 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Append operational log note or update..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Log</span>
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Action Dispatch, Assigned Responders, Nearby CCTV & Map */}
        <div className="lg:col-span-5 space-y-6">
          {/* Assigned Personnel Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Assigned Field Responder</span>
              </h3>
              <button
                onClick={() => setShowAssignModal(true)}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3" />
                <span>{incident.assignedResponder ? 'Reassign' : 'Assign'}</span>
              </button>
            </div>

            {incident.assignedResponder ? (
              <div className="p-3 rounded-lg bg-slate-950/80 border border-cyan-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white">
                    {incident.assignedResponder.name}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {incident.assignedResponder.type}
                  </span>
                </div>
                <div className="text-xs text-slate-300 flex items-center justify-between">
                  <span>Phone: {incident.assignedResponder.phone}</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    {incident.assignedResponder.distanceMeters
                      ? `${incident.assignedResponder.distanceMeters}m away`
                      : 'On site'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Dispatched at: {incident.assignedResponder.assignedAt}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-400 text-xs">
                <p>No responder currently assigned.</p>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="mt-2 px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                >
                  Dispatch Nearest Volunteer
                </button>
              </div>
            )}
          </div>

          {/* Nearby Help Desk & Transfer Action */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>Associated Help Desk</span>
              </h3>
              <button
                onClick={() => setShowTransferModal(true)}
                className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Transfer Case</span>
              </button>
            </div>

            {nearbyDesk ? (
              <div className="p-3 rounded-lg bg-slate-950/80 border border-purple-900/50 text-xs space-y-1">
                <div className="font-bold text-white">{nearbyDesk.name}</div>
                <div className="text-slate-300">Lead: {nearbyDesk.leadOperator}</div>
                <div className="text-slate-400">Phone: {nearbyDesk.phone}</div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">Help Desk ID: {incident.nearbyHelpDeskId}</div>
            )}
          </div>

          {/* Nearby CCTV Feeds */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Nearby CCTV Feeds</span>
              </h3>
              <Link href="/cctv" className="text-[11px] text-cyan-400 hover:underline">
                View Feeds →
              </Link>
            </div>

            <div className="space-y-2">
              {nearbyCctvs.map((cam) => (
                <div
                  key={cam.id}
                  className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-200">{cam.name}</span>
                    <span className="text-[10px] text-slate-400 block">
                      Live crowd count: {cam.personCount} pax
                    </span>
                  </div>
                  <Link
                    href={`/cctv?camera=${cam.id}`}
                    className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-cyan-400 hover:bg-slate-700"
                  >
                    Inspect Cam
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Tactical GIS Map */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Incident Map Locus
            </span>
            <DynamicSecurityMap
              height="280px"
              focusedCoords={incident.coords}
              zoom={17}
              interactive={true}
            />
          </div>
        </div>
      </div>

      {/* Modal: Dispatch Volunteer */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Smart Proximity Volunteer Dispatch</h3>
            <p className="text-xs text-slate-400">
              Select an available volunteer near {incident.location}:
            </p>

            <select
              value={selectedVolunteerId}
              onChange={(e) => setSelectedVolunteerId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">Select Volunteer...</option>
              {availableVolunteers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.zone}) - Battery: {v.batteryPct}%
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignVolunteer}
                disabled={!selectedVolunteerId}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold"
              >
                Dispatch Responder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Transfer Case */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Transfer Incident to Another Help Desk</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Help Desk</label>
              <select
                value={selectedDeskId}
                onChange={(e) => setSelectedDeskId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="">Select Help Desk...</option>
                {state.helpDesks.map((hd) => (
                  <option key={hd.id} value={hd.id}>
                    {hd.name} (Active: {hd.activeCasesCount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Transfer Reason</label>
              <textarea
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                placeholder="Explain reason for transferring case across gates..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500 h-20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={!selectedDeskId || !transferReason.trim()}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
