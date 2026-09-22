'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Camera,
  Search,
  Users,
  Sparkles,
  Maximize2,
  Radio,
  Play,
  Pause,
  AlertTriangle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import { CCTVCamera } from '@/types';

function CctvSurveillanceContent() {
  const searchParams = useSearchParams();
  const focusedCameraId = searchParams.get('camera') || '';

  const { state } = useSuraksha();

  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedCamera, setSelectedCamera] = useState<CCTVCamera | null>(
    state.cctvCameras.find((c) => c.id === focusedCameraId) || state.cctvCameras[0]
  );

  // AI Person Search Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [searchQueryPerson, setSearchQueryPerson] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState(state.missingPersons[0]?.id || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchMatches, setSearchMatches] = useState<any[]>([]);

  const filteredCameras = state.cctvCameras.filter((cam) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!cam.id.toLowerCase().includes(q) && !cam.name.toLowerCase().includes(q) && !cam.zone.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedZone !== 'ALL' && !cam.zone.includes(selectedZone)) {
      return false;
    }
    return true;
  });

  const runAiSearch = () => {
    setIsSearching(true);
    const target = state.missingPersons.find((m) => m.id === selectedPersonId) || state.missingPersons[0];

    setTimeout(() => {
      setIsSearching(false);
      setSearchMatches([
        {
          cameraId: 'CAM-04',
          cameraLocation: 'East Gate 2 Stupa Approach Walk',
          timestamp: '10:42 AM',
          confidence: 89,
          photoUrl: target?.photoUrl,
          notes: 'Color pattern and height profile matches ' + target?.name,
        },
        {
          cameraId: 'CAM-09',
          cameraLocation: 'Central Stupa Dome Tier 1',
          timestamp: '10:35 AM',
          confidence: 78,
          photoUrl: target?.photoUrl,
          notes: 'Partial facial silhouette detected in circumambulation line.',
        },
      ]);
    }, 1800);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">
              CCTV Surveillance Operations Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            15 active IP cameras with computer-vision crowd density analytics and biometric face/garment scanning.
          </p>
        </div>

        <button
          onClick={() => setShowAiModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950 flex items-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>AI Biometric Face & Clothing Search</span>
        </button>
      </div>

      {/* Selected Featured Camera Large Monitor */}
      {selectedCamera && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-mono font-bold text-xs text-white">
                LIVE FEED: {selectedCamera.id} - {selectedCamera.name}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                {selectedCamera.streamType}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span>FPS: 30.0</span>
              <span>BITRATE: 4.8 Mbps</span>
              <span className="text-emerald-400 font-bold">PTZ ONLINE</span>
            </div>
          </div>

          {/* Video Canvas Simulation */}
          <div className="relative w-full h-80 sm:h-96 rounded-xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center scanline-effect">
            {/* Background CCTV Imagery Grid Simulation */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative text-center space-y-2 z-10 select-none">
              <div className="font-mono text-2xl sm:text-3xl font-black text-cyan-400/80 tracking-widest">
                [LIVE CCTV STREAM // {selectedCamera.id}]
              </div>
              <div className="text-xs font-mono text-slate-400">
                ZONE: {selectedCamera.zone.toUpperCase()} • DEEKSHABHOOMI PERIMETER
              </div>
              <div className="pt-2 flex items-center justify-center gap-2">
                <span className="px-3 py-1 rounded bg-slate-900/80 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold shadow">
                  PEDESTRIAN COUNT: {selectedCamera.personCount} PAX
                </span>
                <span
                  className={`px-3 py-1 rounded text-xs font-mono font-bold shadow ${
                    selectedCamera.density === 'CRITICAL'
                      ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                      : selectedCamera.density === 'HIGH'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  DENSITY: {selectedCamera.density}
                </span>
              </div>
            </div>

            {/* Top-Right Timestamp HUD Overlay */}
            <div className="absolute top-3 right-3 font-mono text-xs text-emerald-400/90 bg-black/60 px-2.5 py-1 rounded border border-emerald-900/60">
              REC ● 2026-09-22 10:46:12 IST
            </div>

            {/* Bottom-Left Camera Details HUD */}
            <div className="absolute bottom-3 left-3 font-mono text-[11px] text-slate-300 bg-black/60 px-2.5 py-1 rounded border border-slate-800">
              AI INFERENCE: OBJECT_TRACKING_V4 (LATENCY: 18ms)
            </div>
          </div>

          {/* Camera Detection Events Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold text-[11px] uppercase">
                Recent Vision Detections:
              </span>
              {selectedCamera.recentDetections.map((det, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-mono"
                >
                  {det.label} ({det.confidence}%)
                </span>
              ))}
            </div>

            <button
              onClick={() => runAiSearch()}
              className="text-cyan-400 hover:text-cyan-300 font-bold text-xs flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Detection Scan</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cameras by ID or location..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'North Gate', 'East Gate', 'South Gate', 'West Gate', 'Central Stupa'].map(
            (z) => (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedZone === z
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {z}
              </button>
            )
          )}
        </div>
      </div>

      {/* 15 Camera Feeds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {filteredCameras.map((cam) => {
          const isSelected = selectedCamera?.id === cam.id;
          const isCritical = cam.density === 'CRITICAL';

          return (
            <div
              key={cam.id}
              onClick={() => setSelectedCamera(cam)}
              className={`rounded-xl border p-3 cursor-pointer transition relative group ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-500 ring-1 ring-cyan-400 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Simulated mini preview canvas */}
              <div className="relative h-24 w-full rounded-lg bg-black border border-slate-800 overflow-hidden mb-2 flex items-center justify-center">
                <span className="font-mono text-xs text-slate-500 font-bold">{cam.id}</span>
                <span className="absolute top-1 left-1.5 flex items-center gap-1 text-[9px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> LIVE
                </span>
                <span className="absolute bottom-1 right-1.5 text-[9px] font-mono text-slate-400">
                  {cam.personCount} pax
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono font-bold text-xs text-white">{cam.id}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono ${
                    isCritical
                      ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                      : cam.density === 'HIGH'
                      ? 'bg-amber-950 text-amber-300'
                      : 'bg-emerald-950 text-emerald-300'
                  }`}
                >
                  {cam.density}
                </span>
              </div>

              <div className="text-[11px] font-semibold text-slate-300 truncate">{cam.name}</div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">{cam.zone}</div>
            </div>
          );
        })}
      </div>

      {/* AI Person Search Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">AI Biometric Face & Garment Search</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select an active missing person reference dossier or specify physical descriptors to scan all 15 CCTV feeds.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Select Missing Person Reference Dossier
              </label>
              <select
                value={selectedPersonId}
                onChange={(e) => setSelectedPersonId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
              >
                {state.missingPersons.map((mp) => (
                  <option key={mp.id} value={mp.id}>
                    {mp.name} ({mp.age}yo, {mp.category}) - Clothing: {mp.clothingDescription.slice(0, 40)}...
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={runAiSearch}
              disabled={isSearching}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Radio className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
              <span>{isSearching ? 'Scanning 15 Video Streams...' : 'Execute AI Search Across 15 Cameras'}</span>
            </button>

            {/* Results */}
            {searchMatches.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Candidate Matches ({searchMatches.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {searchMatches.map((m, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950 border border-cyan-800/60 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white">{m.cameraId}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {m.confidence}% Match
                        </span>
                      </div>
                      <div className="text-slate-300 font-semibold">{m.cameraLocation}</div>
                      <div className="text-[11px] text-slate-400">{m.notes}</div>
                      <div className="pt-2 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                        <Link
                          href={`/sighting`}
                          onClick={() => setShowAiModal(false)}
                          className="text-[11px] font-bold text-emerald-400 hover:underline"
                        >
                          Generate Sighting Lead →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CctvSurveillancePage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          Loading CCTV Feeds...
        </div>
      }
    >
      <CctvSurveillanceContent />
    </Suspense>
  );
}
