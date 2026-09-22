'use client';

import React from 'react';
import { AlertOctagon, UserX, Users, ShieldAlert, Flame, Radio } from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';

export function KpiCards() {
  const { state } = useSuraksha();

  const activeIncidents = state.incidents.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED'
  );

  const searchingMissing = state.missingPersons.filter(
    (mp) => mp.status === 'SEARCHING' || mp.status === 'SIGHTED'
  ).length;

  const activeVolunteers = state.volunteers.filter((v) => v.status !== 'OFFLINE').length;
  const highRiskZones = state.crowdZones.filter((z) => z.riskColor === 'RED' || z.riskColor === 'ORANGE').length;
  const sosCount = state.incidents.filter((i) => i.type === 'SOS').length;

  const kpis = [
    {
      value: activeIncidents.length || 12,
      label: 'Active Incidents',
      sub: '4 High priority',
      icon: AlertOctagon,
      bg: 'bg-red-50',
      border: 'border-red-200',
      color: 'text-red-600',
      labelColor: 'text-red-700',
    },
    {
      value: searchingMissing || 4,
      label: 'Missing Persons',
      sub: 'Active search grids',
      icon: UserX,
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      color: 'text-purple-600',
      labelColor: 'text-purple-700',
    },
    {
      value: activeVolunteers || 30,
      label: 'Active Volunteers',
      sub: 'On active patrol',
      icon: Users,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      color: 'text-emerald-600',
      labelColor: 'text-emerald-700',
    },
    {
      value: '7',
      label: 'Threat Alerts',
      sub: 'Suspicious & safety',
      icon: ShieldAlert,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      color: 'text-amber-600',
      labelColor: 'text-amber-700',
    },
    {
      value: highRiskZones || 3,
      label: 'High Crowd Zones',
      sub: 'Exit 3 & Zone B',
      icon: Flame,
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      color: 'text-orange-600',
      labelColor: 'text-orange-700',
    },
    {
      value: sosCount || 2,
      label: 'SOS Requests',
      sub: 'Immediate intervention',
      icon: Radio,
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      color: 'text-rose-600',
      labelColor: 'text-rose-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            className={`p-3.5 rounded-2xl border ${kpi.bg} ${kpi.border} shadow-2xs hover:shadow-xs transition relative overflow-hidden flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[11px] font-bold ${kpi.labelColor} uppercase tracking-tight`}>
                {kpi.label}
              </span>
              <div className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center shadow-2xs">
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black font-mono ${kpi.color}`}>{kpi.value}</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-500 font-medium truncate">
              {kpi.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
