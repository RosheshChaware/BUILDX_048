'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Camera,
  MapPin,
  UserCheck,
  Shield,
  Building2,
  Users,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useSuraksha } from '@/hooks/useSuraksha';

interface NodeData {
  id: string;
  label: string;
  sublabel: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  textColor: string;
  x: number;
  y: number;
  details: string;
  link?: string;
}

export function IncidentGraph({ incidentId }: { incidentId?: string }) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const { state } = useSuraksha();

  // Pick active incident from store or match by ID
  const activeIncident =
    (incidentId ? state.incidents.find((i) => i.id === incidentId) : null) ||
    state.incidents.find((i) => i.status !== 'RESOLVED') ||
    state.incidents[0];

  const currentId = activeIncident ? activeIncident.id : (incidentId || 'INC-2048');
  const incidentTitle = activeIncident ? activeIncident.title : 'Incident Dispatch Correlation';
  const incidentType = activeIncident ? activeIncident.type.replace('_', ' ') : 'Security';
  const cctvId = activeIncident?.nearbyCctvIds?.[0] || 'CCTV-12';
  const locationName = activeIncident?.location || 'Zone B';
  const helpDeskId = activeIncident?.nearbyHelpDeskId || 'Desk-3';
  const responder = activeIncident?.assignedResponder;

  const nodes: NodeData[] = [
    {
      id: 'cctv',
      label: cctvId,
      sublabel: 'Optical Grid',
      icon: Camera,
      color: '#38BDF8',
      bg: 'bg-sky-950/80',
      border: 'border-sky-700/80',
      textColor: 'text-sky-400',
      x: 0,
      y: -85,
      details: `Optical sensor ${cctvId} correlated with ${locationName}. Stream telemetry active.`,
      link: '/cctv',
    },
    {
      id: 'location',
      label: locationName.split('-')[0].trim().slice(0, 10),
      sublabel: 'Sector Zone',
      icon: MapPin,
      color: '#2DD4BF',
      bg: 'bg-teal-950/80',
      border: 'border-teal-700/80',
      textColor: 'text-teal-400',
      x: 85,
      y: -42,
      details: `Sector: ${locationName}. Active search and containment perimeter enforced.`,
      link: '/incidents',
    },
    {
      id: 'volunteer',
      label: responder ? responder.name.split(' ')[0] : 'Volunteers',
      sublabel: responder?.distanceMeters ? `${responder.distanceMeters}m Away` : (responder ? 'On Scene' : 'Standby'),
      icon: UserCheck,
      color: '#34D399',
      bg: 'bg-emerald-950/80',
      border: 'border-emerald-700/80',
      textColor: 'text-emerald-400',
      x: 80,
      y: 52,
      details: responder
        ? `Assigned responder ${responder.name} (${responder.type}). Direct comms active.`
        : 'Field volunteers available in adjacent perimeter sector.',
      link: '/volunteers',
    },
    {
      id: 'police',
      label: 'Police Post',
      sublabel: 'Sector Unit',
      icon: Shield,
      color: '#818CF8',
      bg: 'bg-indigo-950/80',
      border: 'border-indigo-700/80',
      textColor: 'text-indigo-400',
      x: 0,
      y: 88,
      details: 'Nagpur Police Sector Chowki alerted. Perimeter monitoring active.',
      link: '/police',
    },
    {
      id: 'desk',
      label: helpDeskId,
      sublabel: 'Command Kiosk',
      icon: Building2,
      color: '#C084FC',
      bg: 'bg-purple-950/80',
      border: 'border-purple-700/80',
      textColor: 'text-purple-400',
      x: -80,
      y: 52,
      details: `Case registered and tracked through ${helpDeskId} field terminal.`,
      link: '/help-desks',
    },
    {
      id: 'sightings',
      label: 'Sightings',
      sublabel: 'Field Reports',
      icon: Users,
      color: '#FBBF24',
      bg: 'bg-amber-950/80',
      border: 'border-amber-700/80',
      textColor: 'text-amber-400',
      x: -85,
      y: -42,
      details: 'Citizen sighting reports and field witness statements linked to incident record.',
      link: '/sighting',
    },
  ];

  const activeNodeData = nodes.find((n) => n.id === selectedNode);

  return (
    <div className="bg-[#0E172B] rounded-lg border border-[#1C273E] p-3 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1C273E]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            AI Entity Correlation: {currentId}
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400">STATUS:</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-800 text-cyan-300 uppercase">
            {activeIncident?.verificationStatus || 'VERIFIED'}
          </span>
        </div>
      </div>

      {/* Verification Checklist Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 py-2 text-[10px] text-slate-400 font-medium">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">Unique ID Logged</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">Visual Evidence Linked</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">GIS Zone Verified</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">{cctvId} Correlated</span>
        </div>
      </div>

      {/* Radial Interactive Graph Area */}
      <div className="relative my-1 h-[210px] flex items-center justify-center select-none bg-[#090F1E] rounded-md border border-[#172239]">
        {/* SVG Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 210">
          {nodes.map((node) => {
            const cx = 150;
            const cy = 105;
            const targetX = cx + node.x * 1.25;
            const targetY = cy + node.y * 0.95;
            const isHighlighted = selectedNode === node.id;

            return (
              <g key={node.id}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={targetX}
                  y2={targetY}
                  stroke={isHighlighted ? '#06B6D4' : '#22324F'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeDasharray={isHighlighted ? 'none' : '2 2'}
                />
                <circle
                  cx={cx + (targetX - cx) * 0.5}
                  cy={cy + (targetY - cy) * 0.5}
                  r={isHighlighted ? 3 : 1.5}
                  fill={isHighlighted ? '#06B6D4' : '#475569'}
                />
              </g>
            );
          })}
        </svg>

        {/* Central Node */}
        <div
          onClick={() => setSelectedNode(null)}
          className="relative z-20 cursor-pointer w-16 h-16 rounded-full bg-cyan-950/90 border-2 border-cyan-500 flex flex-col items-center justify-center text-white shadow-md hover:scale-105 transition"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-cyan-400 mb-0.5" />
          <span className="font-mono font-bold text-[10px] leading-none text-cyan-100">
            {currentId}
          </span>
          <span className="text-[8px] text-cyan-300 font-medium truncate max-w-[50px]">
            {incidentType}
          </span>
        </div>

        {/* 6 Radial Satellite Nodes */}
        {nodes.map((node) => {
          const Icon = node.icon;
          const isSelected = selectedNode === node.id;

          const leftPercent = 50 + (node.x / 150) * 44;
          const topPercent = 50 + (node.y / 105) * 44;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(isSelected ? null : node.id)}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute z-10 flex flex-col items-center cursor-pointer transition ${
                isSelected ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center shadow-xs border transition ${
                  node.bg
                } ${node.border} ${
                  isSelected ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-900' : ''
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${node.textColor}`} />
              </div>
              <div className="mt-0.5 text-center whitespace-nowrap bg-[#0B1324]/90 px-1 py-0.2 rounded border border-[#1E293B]">
                <div className="text-[9px] font-bold text-slate-200 leading-tight">
                  {node.label}
                </div>
                <div className="text-[8px] text-slate-500 font-mono leading-tight">
                  {node.sublabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Telemetry Drawer */}
      <div className="p-2 rounded bg-[#090F1E] border border-[#172239] text-xs">
        {activeNodeData ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <activeNodeData.icon className={`w-3 h-3 ${activeNodeData.textColor}`} />
              <span className="font-bold text-white">{activeNodeData.label}:</span>
              <span className="text-slate-400">{activeNodeData.details}</span>
            </div>
            {activeNodeData.link && (
              <Link
                href={activeNodeData.link}
                className="text-[10px] text-cyan-400 hover:underline font-mono shrink-0 ml-2 flex items-center gap-0.5"
              >
                Inspect <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Click any correlated entity node above to inspect dispatch link.</span>
            <span className="text-slate-500 font-mono text-[10px]">6 Nodes Synced</span>
          </div>
        )}
      </div>
    </div>
  );
}
