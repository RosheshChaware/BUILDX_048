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
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface NodeData {
  id: string;
  label: string;
  sublabel: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  textColor: string;
  x: number; // percentage from center
  y: number; // percentage from center
  details: string;
  link?: string;
}

export function IncidentGraph({ incidentId = 'INC-2048' }: { incidentId?: string }) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes: NodeData[] = [
    {
      id: 'cctv',
      label: 'CCTV Detection',
      sublabel: '(CCTV-12)',
      icon: Camera,
      color: '#2563EB',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      textColor: 'text-blue-700',
      x: 0,
      y: -105,
      details: 'CCTV-12 detected child matching description at 10:48 AM near Gate 2.',
      link: '/cctv',
    },
    {
      id: 'location',
      label: 'Location',
      sublabel: '(Zone B)',
      icon: MapPin,
      color: '#0D9488',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      textColor: 'text-teal-700',
      x: 100,
      y: -50,
      details: 'Zone B - Main Pathway, High crowd density (2.8 persons/sqm).',
      link: '/map',
    },
    {
      id: 'volunteer',
      label: 'Volunteer',
      sublabel: '(V-102)',
      icon: UserCheck,
      color: '#059669',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      textColor: 'text-emerald-700',
      x: 95,
      y: 65,
      details: 'Volunteer Rahul Verma dispatched, 250m away. Status: On Scene.',
      link: '/volunteers',
    },
    {
      id: 'police',
      label: 'Nearby Police Post',
      sublabel: '(420 m)',
      icon: Shield,
      color: '#1D4ED8',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      textColor: 'text-indigo-700',
      x: 0,
      y: 110,
      details: 'Police Chowki B alerted. Sub-Inspector Kulkarni monitoring exit gate.',
      link: '/police',
    },
    {
      id: 'desk',
      label: 'Help Desk',
      sublabel: '(Desk-3)',
      icon: Building2,
      color: '#7C3AED',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      textColor: 'text-purple-700',
      x: -95,
      y: 65,
      details: 'Desk-3 (Zone B North) registered physical parent inquiry at 10:43 AM.',
      link: '/help-desks',
    },
    {
      id: 'sightings',
      label: 'Citizen Sightings',
      sublabel: '(2 reports)',
      icon: Users,
      color: '#D97706',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      textColor: 'text-amber-700',
      x: -100,
      y: -50,
      details: '2 verified reports from pilgrims at Stupa East gate matching pink shoes.',
      link: '/sighting',
    },
  ];

  const activeNodeData = nodes.find((n) => n.id === selectedNode);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col h-full">
      {/* Title & Subtitle */}
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          AI Verification & Incident Graph
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Detects duplicates, checks consistency, connects related information.
        </p>
      </div>

      {/* Confidence Level Pill & Checklist */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">Confidence Level</div>
          <div className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Likely Match
          </div>
        </div>

        <div className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
          87%
        </div>

        <div className="mt-3 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>No duplicate reports found</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Evidence consistent (photo + description)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Location & time correlation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>CCTV match available</span>
          </div>
        </div>
      </div>

      {/* Radial Interactive Graph Area */}
      <div className="relative mt-5 flex-1 min-h-[290px] flex items-center justify-center select-none">
        {/* SVG Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 280">
          {nodes.map((node) => {
            const cx = 160;
            const cy = 140;
            const targetX = cx + (node.x * 1.05);
            const targetY = cy + (node.y * 1.0);
            const isHighlighted = selectedNode === node.id;

            return (
              <g key={node.id}>
                {/* Connecting spoke */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={targetX}
                  y2={targetY}
                  stroke={isHighlighted ? '#EF4444' : '#CBD5E1'}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeDasharray={isHighlighted ? 'none' : '3 3'}
                  className="transition-all duration-300"
                />
                {/* Data point dot on spoke */}
                <circle
                  cx={cx + (targetX - cx) * 0.55}
                  cy={cy + (targetY - cy) * 0.55}
                  r={isHighlighted ? 4 : 2.5}
                  fill={isHighlighted ? '#EF4444' : '#94A3B8'}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}
        </svg>

        {/* Central Hub Node (INC-2048) */}
        <div
          onClick={() => setSelectedNode(null)}
          className="relative z-20 cursor-pointer w-20 h-20 rounded-full bg-red-600 border-4 border-red-100 flex flex-col items-center justify-center text-white shadow-md hover:scale-105 transition-transform"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping absolute -top-1 -right-1" />
          <AlertTriangle className="w-4 h-4 text-white mb-0.5" />
          <span className="font-extrabold text-[11px] leading-tight tracking-tight">
            {incidentId}
          </span>
          <span className="text-[9px] text-red-100 leading-tight">
            (Missing Person)
          </span>
        </div>

        {/* 6 Radial Satellite Nodes */}
        {nodes.map((node) => {
          const Icon = node.icon;
          const isSelected = selectedNode === node.id;

          // Compute absolute position with center offset
          // Box size is roughly 320x280
          const leftPercent = 50 + (node.x / 160) * 44;
          const topPercent = 50 + (node.y / 140) * 44;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(isSelected ? null : node.id)}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute z-10 flex flex-col items-center cursor-pointer group transition-all duration-200 ${
                isSelected ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border transition-all ${
                  node.bg
                } ${node.border} ${
                  isSelected ? 'ring-2 ring-red-400 ring-offset-2' : ''
                }`}
              >
                <Icon className={`w-4 h-4 ${node.textColor}`} />
              </div>
              <div className="mt-1 text-center whitespace-nowrap bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-2xs border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-800 leading-tight">
                  {node.label}
                </div>
                <div className="text-[9px] font-medium text-slate-500 leading-tight">
                  {node.sublabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Inspector drawer if a node is selected */}
      {activeNodeData && (
        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <activeNodeData.icon className={`w-3.5 h-3.5 ${activeNodeData.textColor}`} />
              {activeNodeData.label} {activeNodeData.sublabel}
            </span>
            {activeNodeData.link && (
              <Link
                href={activeNodeData.link}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                View Module <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
          <p className="text-slate-600 text-[11px] mt-1">{activeNodeData.details}</p>
        </div>
      )}
    </div>
  );
}
