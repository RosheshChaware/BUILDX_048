'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import L from 'leaflet';
import { useSuraksha } from '@/hooks/useSuraksha';
import { Layers, Eye, Shield, Users, Radio, AlertCircle, Building2, UserX, Camera } from 'lucide-react';

interface SecurityMapProps {
  height?: string;
  selectedIncidentId?: string;
  focusedCoords?: [number, number];
  zoom?: number;
  interactive?: boolean;
}

export default function SecurityMap({
  height = '560px',
  selectedIncidentId,
  focusedCoords,
  zoom = 16,
  interactive = true,
}: SecurityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});

  const { state } = useSuraksha();

  // Layer filter toggles
  const [showIncidents, setShowIncidents] = useState(true);
  const [showMissing, setShowMissing] = useState(true);
  const [showSightings, setShowSightings] = useState(true);
  const [showHelpDesks, setShowHelpDesks] = useState(true);
  const [showPolice, setShowPolice] = useState(true);
  const [showVolunteers, setShowVolunteers] = useState(true);
  const [showCctv, setShowCctv] = useState(false);
  const [showCrowdHeat, setShowCrowdHeat] = useState(true);
  const [showExits, setShowExits] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on Deekshabhoomi, Nagpur
    const initialCenter: [number, number] = focusedCoords || [21.12785, 79.06690];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: zoom,
      zoomControl: interactive,
      attributionControl: false,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      dragging: interactive,
    });

    mapInstanceRef.current = map;

    // Tactical CartoDB Dark Matter tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Create Layer Groups
    layerGroupsRef.current = {
      incidents: L.layerGroup().addTo(map),
      missing: L.layerGroup().addTo(map),
      sightings: L.layerGroup().addTo(map),
      helpDesks: L.layerGroup().addTo(map),
      police: L.layerGroup().addTo(map),
      volunteers: L.layerGroup().addTo(map),
      cctv: L.layerGroup().addTo(map),
      crowd: L.layerGroup().addTo(map),
      exits: L.layerGroup().addTo(map),
    };

    // Add perimeter ring for Deekshabhoomi sacred zone
    L.circle([21.12785, 79.06690], {
      radius: 360,
      color: '#06b6d4',
      weight: 1.5,
      dashArray: '4, 8',
      fillColor: '#0891b2',
      fillOpacity: 0.04,
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center if focusedCoords change
  useEffect(() => {
    if (mapInstanceRef.current && focusedCoords) {
      mapInstanceRef.current.setView(focusedCoords, 17, { animate: true });
    }
  }, [focusedCoords]);

  // Re-render markers whenever state or toggles change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const layers = layerGroupsRef.current;
    if (!layers.incidents) return;

    // Clear existing
    Object.values(layers).forEach((lg) => lg.clearLayers());

    // 1. CROWD HEAT ZONES
    if (showCrowdHeat) {
      state.crowdZones.forEach((zone) => {
        const color =
          zone.riskColor === 'RED'
            ? '#ef4444'
            : zone.riskColor === 'ORANGE'
            ? '#f97316'
            : zone.riskColor === 'YELLOW'
            ? '#eab308'
            : '#10b981';

        const circle = L.circle(zone.coords, {
          radius: zone.riskColor === 'RED' ? 120 : 90,
          color: color,
          weight: 1,
          fillColor: color,
          fillOpacity: zone.riskColor === 'RED' ? 0.28 : 0.16,
        });

        circle.bindPopup(`
          <div class="text-xs p-1">
            <div class="font-bold text-slate-100 flex items-center justify-between gap-2">
              <span>${zone.name}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold" style="background:${color}33; color:${color}">
                ${zone.densityLevel}
              </span>
            </div>
            <div class="mt-1 text-slate-300">
              Current Count: <strong class="text-white">${zone.currentCount.toLocaleString()}</strong> / ${zone.maxSafeCapacity.toLocaleString()} safe limit
            </div>
            <div class="text-[11px] text-slate-400 mt-1">Trend: <strong>${zone.trend}</strong></div>
          </div>
        `);

        circle.addTo(layers.crowd);
      });
    }

    // 2. EXIT GATES
    if (showExits) {
      state.exitGates.forEach((exit) => {
        const isCritical = exit.riskLevel === 'CRITICAL';
        const color = isCritical ? '#ef4444' : exit.riskLevel === 'ELEVATED' ? '#f59e0b' : '#10b981';

        const exitIcon = L.divIcon({
          className: 'custom-exit-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] shadow-lg border" style="background:#0f172a; border-color:${color}; color:${color}">
                ${exit.id.replace('EXIT-0', 'E')}
              </div>
              ${isCritical ? '<div class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping"></div>' : ''}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(exit.coords, { icon: exitIcon });
        marker.bindPopup(`
          <div class="text-xs p-1">
            <div class="font-bold text-slate-100 flex items-center justify-between">
              <span>${exit.name}</span>
              <span class="font-bold text-[10px]" style="color:${color}">${exit.congestionPct}% Full</span>
            </div>
            <p class="text-[11px] text-slate-300 mt-1">${exit.recommendedAction}</p>
            <div class="mt-2 text-[10px] text-slate-400">Flow: ${exit.entryFlowPerMin}/m in | ${exit.exitFlowPerMin}/m out</div>
          </div>
        `);
        marker.addTo(layers.exits);
      });
    }

    // 3. INCIDENTS (Critical 🔴 & Security 🟠)
    if (showIncidents) {
      state.incidents.forEach((inc) => {
        if (inc.type === 'MISSING_PERSON') return; // Handled under Missing Persons layer
        const isCritical = inc.severity === 'CRITICAL';
        const color = isCritical ? '#ef4444' : inc.severity === 'HIGH' ? '#f97316' : '#eab308';

        const incidentIcon = L.divIcon({
          className: 'custom-incident-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 ${
                isCritical ? 'animate-pulse' : ''
              }" style="background:${color}; border-color:#ffffff">
                !
              </div>
              ${isCritical ? '<div class="absolute inset-0 rounded-full animate-ping opacity-75" style="background:' + color + '"></div>' : ''}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker(inc.coords, { icon: incidentIcon });
        marker.bindPopup(`
          <div class="text-xs p-1 min-w-[180px]">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="font-mono font-bold text-cyan-400">${inc.id}</span>
              <span class="px-1.5 py-0.2 rounded text-[9px] font-bold text-white" style="background:${color}">
                ${inc.severity}
              </span>
            </div>
            <div class="font-semibold text-slate-100 mb-1">${inc.title}</div>
            <div class="text-[11px] text-slate-300 mb-2">${inc.location}</div>
            <a href="/incidents/${inc.id}" class="inline-block text-[11px] font-bold text-cyan-400 hover:text-cyan-300 hover:underline">
              Inspect Incident Dossier →
            </a>
          </div>
        `);
        marker.addTo(layers.incidents);
      });
    }

    // 4. MISSING PERSONS (🔵 Blue)
    if (showMissing) {
      state.missingPersons.forEach((mp) => {
        const isChild = mp.category === 'CHILD';
        const mpIcon = L.divIcon({
          className: 'custom-mp-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-lg border-2" style="background:#2563eb; border-color:#60a5fa">
                ${isChild ? '👶' : '🧓'}
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker(mp.coords, { icon: mpIcon });
        marker.bindPopup(`
          <div class="text-xs p-1 min-w-[200px]">
            <div class="flex items-center gap-2 mb-1">
              <img src="${mp.photoUrl}" class="w-8 h-8 rounded-full object-cover border border-slate-600" />
              <div>
                <div class="font-bold text-slate-100">${mp.name} (${mp.age}yo)</div>
                <div class="text-[10px] text-blue-400 font-mono">${mp.status}</div>
              </div>
            </div>
            <p class="text-[11px] text-slate-300 mt-1 line-clamp-2">${mp.clothingDescription}</p>
            <div class="mt-2 flex justify-between items-center">
              <span class="text-[10px] text-slate-400">${mp.lastSeenTime}</span>
              <a href="/incidents/${mp.incidentId}" class="text-[11px] font-bold text-cyan-400 hover:underline">
                View Case →
              </a>
            </div>
          </div>
        `);
        marker.addTo(layers.missing);
      });
    }

    // 5. VERIFIED & UNVERIFIED SIGHTINGS (🟢 Green / Amber)
    if (showSightings) {
      state.sightings.forEach((s) => {
        const isVerified = s.verificationStatus === 'VERIFIED';
        const color = isVerified ? '#10b981' : '#f59e0b';

        const sIcon = L.divIcon({
          className: 'custom-sighting-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg border" style="background:${color}; border-color:#ffffff">
                👁️
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(s.coords, { icon: sIcon });
        marker.bindPopup(`
          <div class="text-xs p-1">
            <div class="flex items-center justify-between mb-1">
              <span class="font-bold text-slate-100">${s.id} Sighting</span>
              <span class="px-1.5 py-0.2 rounded text-[9px] font-bold text-white" style="background:${color}">
                ${s.verificationStatus}
              </span>
            </div>
            <p class="text-[11px] text-slate-300 mt-1">${s.description}</p>
            <div class="mt-1 text-[10px] text-cyan-400">AI Confidence: ${s.aiConfidence} (${s.aiSimilarityScore}%)</div>
            <div class="mt-2">
              <a href="/sighting" class="text-[11px] font-bold text-cyan-400 hover:underline">Verify Sighting →</a>
            </div>
          </div>
        `);
        marker.addTo(layers.sightings);
      });
    }

    // 6. HELP DESKS (🟣 Purple)
    if (showHelpDesks) {
      state.helpDesks.forEach((hd) => {
        const hdIcon = L.divIcon({
          className: 'custom-hd-marker',
          html: `
            <div class="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shadow-lg border" style="background:#7c3aed; border-color:#a78bfa">
              H
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(hd.coords, { icon: hdIcon });
        marker.bindPopup(`
          <div class="text-xs p-1">
            <div class="font-bold text-slate-100">${hd.name}</div>
            <div class="text-[11px] text-slate-300 mt-1">Active Cases: <strong class="text-white">${hd.activeCasesCount}</strong> | Staff: ${hd.operatorsCount}</div>
            <div class="text-[10px] text-slate-400 mt-1">Lead: ${hd.leadOperator} (${hd.phone})</div>
            <a href="/help-desks" class="inline-block mt-2 text-[11px] font-bold text-purple-400 hover:underline">Manage Desk →</a>
          </div>
        `);
        marker.addTo(layers.helpDesks);
      });
    }

    // 7. POLICE POSTS (👮 Dark Blue)
    if (showPolice) {
      state.policePosts.forEach((pp) => {
        const ppIcon = L.divIcon({
          className: 'custom-pp-marker',
          html: `
            <div class="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shadow-lg border" style="background:#1e3a8a; border-color:#60a5fa">
              👮
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(pp.coords, { icon: ppIcon });
        marker.bindPopup(`
          <div class="text-xs p-1">
            <div class="font-bold text-slate-100">${pp.name}</div>
            <div class="text-[11px] text-slate-300 mt-1">Personnel: ${pp.officersCount} Officers | PCR Vehicles: ${pp.vehicleUnits}</div>
            <div class="text-[10px] text-slate-400 mt-1">In-Charge: ${pp.inCharge}</div>
            <a href="/police" class="inline-block mt-2 text-[11px] font-bold text-blue-400 hover:underline">Police Command →</a>
          </div>
        `);
        marker.addTo(layers.police);
      });
    }

    // 8. VOLUNTEERS (👤 Cyan)
    if (showVolunteers) {
      state.volunteers.forEach((v) => {
        const isAssigned = v.status === 'ASSIGNED' || v.status === 'RESPONDING';
        const vIcon = L.divIcon({
          className: 'custom-volunteer-marker',
          html: `
            <div class="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow border transition-transform duration-500" style="background:${isAssigned ? '#f59e0b' : '#0891b2'}; border-color:#ffffff">
              V
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker(v.coords, { icon: vIcon });
        marker.bindPopup(`
          <div class="text-xs p-1">
            <div class="font-bold text-slate-100">${v.name} (${v.id})</div>
            <div class="text-[11px] text-slate-300">Status: <strong class="text-cyan-400">${v.status}</strong></div>
            <div class="text-[10px] text-slate-400">Zone: ${v.zone} | Battery: ${v.batteryPct}%</div>
            <div class="text-[10px] text-slate-400">Skills: ${v.skills.join(', ')}</div>
            <a href="/volunteers" class="inline-block mt-1 text-[11px] font-bold text-cyan-400 hover:underline">Dispatch Roster →</a>
          </div>
        `);
        marker.addTo(layers.volunteers);
      });
    }

    // 9. CCTV CAMERAS (📷 Gray/Cyan)
    if (showCctv) {
      state.cctvCameras.forEach((cam) => {
        const cIcon = L.divIcon({
          className: 'custom-cctv-marker',
          html: `
            <div class="w-5 h-5 rounded flex items-center justify-center text-white text-[9px] font-bold shadow border" style="background:#334155; border-color:#38bdf8">
              📷
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker(cam.coords, { icon: cIcon });
        marker.bindPopup(`
          <div class="text-xs p-1">
            <div class="font-bold text-slate-100">${cam.id} - ${cam.name}</div>
            <div class="text-[11px] text-slate-300 mt-1">Live Count: ${cam.personCount} people | Stream: ${cam.streamType}</div>
            <a href="/cctv" class="inline-block mt-1 text-[11px] font-bold text-cyan-400 hover:underline">View Feed & AI Search →</a>
          </div>
        `);
        marker.addTo(layers.cctv);
      });
    }
  }, [
    state.incidents,
    state.missingPersons,
    state.sightings,
    state.volunteers,
    state.crowdZones,
    state.exitGates,
    showIncidents,
    showMissing,
    showSightings,
    showHelpDesks,
    showPolice,
    showVolunteers,
    showCctv,
    showCrowdHeat,
    showExits,
  ]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-[#080c14] shadow-xl">
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ height }} className="w-full z-10" />

      {/* Floating Tactical Layer Controls */}
      {interactive && (
        <div className="absolute top-3 right-3 z-20 max-w-xs bg-slate-950/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 shadow-2xl text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-300 pb-1 border-b border-slate-800 text-[11px]">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>GIS Layer Toggles</span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={showIncidents}
                onChange={(e) => setShowIncidents(e.target.checked)}
                className="rounded accent-red-500 w-3 h-3"
              />
              <span className="flex items-center gap-1">🔴 Incidents</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={showMissing}
                onChange={(e) => setShowMissing(e.target.checked)}
                className="rounded accent-blue-500 w-3 h-3"
              />
              <span className="flex items-center gap-1">🔵 Missing</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={showSightings}
                onChange={(e) => setShowSightings(e.target.checked)}
                className="rounded accent-emerald-500 w-3 h-3"
              />
              <span className="flex items-center gap-1">🟢 Sightings</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={showHelpDesks}
                onChange={(e) => setShowHelpDesks(e.target.checked)}
                className="rounded accent-purple-500 w-3 h-3"
              />
              <span className="flex items-center gap-1">🟣 Help Desks</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={showPolice}
                onChange={(e) => setShowPolice(e.target.checked)}
                className="rounded accent-blue-800 w-3 h-3"
              />
              <span className="flex items-center gap-1">👮 Police</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={showVolunteers}
                onChange={(e) => setShowVolunteers(e.target.checked)}
                className="rounded accent-cyan-500 w-3 h-3"
              />
              <span className="flex items-center gap-1">👤 Volunteers</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={showCrowdHeat}
                onChange={(e) => setShowCrowdHeat(e.target.checked)}
                className="rounded accent-yellow-500 w-3 h-3"
              />
              <span className="flex items-center gap-1">🟡 Crowd Heat</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={showExits}
                onChange={(e) => setShowExits(e.target.checked)}
                className="rounded accent-orange-500 w-3 h-3"
              />
              <span className="flex items-center gap-1">🚪 Exits</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white col-span-2 pt-0.5">
              <input
                type="checkbox"
                checked={showCctv}
                onChange={(e) => setShowCctv(e.target.checked)}
                className="rounded accent-slate-400 w-3 h-3"
              />
              <span className="flex items-center gap-1">📷 CCTV Cameras (15)</span>
            </label>
          </div>
        </div>
      )}

      {/* Floating Tactical Coordinate Bar */}
      <div className="absolute bottom-2 left-3 z-20 px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center gap-3">
        <span>📍 DEEKSHABHOOMI (21.1278°N, 79.0669°E)</span>
        <span className="text-cyan-400">ZOOM: {zoom}</span>
        <span className="text-emerald-400">STATUS: ACTIVE SENSORS</span>
      </div>
    </div>
  );
}
