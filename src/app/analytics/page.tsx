'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { BarChart3, TrendingUp, Users, Clock, CheckCircle2, Shield } from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';

const CROWD_HOURLY_DATA = [
  { hour: '04:00 AM', pilgrims: 14200, capacity: 45000 },
  { hour: '06:00 AM', pilgrims: 26800, capacity: 45000 },
  { hour: '08:00 AM', pilgrims: 38900, capacity: 45000 },
  { hour: '10:00 AM', pilgrims: 51480, capacity: 45000 },
  { hour: '12:00 PM', pilgrims: 48600, capacity: 45000 },
  { hour: '02:00 PM', pilgrims: 42300, capacity: 45000 },
  { hour: '04:00 PM', pilgrims: 56200, capacity: 45000 },
  { hour: '06:00 PM', pilgrims: 64500, capacity: 45000 },
  { hour: '08:00 PM', pilgrims: 58000, capacity: 45000 },
];

const RESPONSE_TIME_DATA = [
  { hour: '05:00', target: 5.0, actual: 4.8 },
  { hour: '07:00', target: 5.0, actual: 4.2 },
  { hour: '09:00', target: 5.0, actual: 3.6 },
  { hour: '11:00', target: 5.0, actual: 3.4 },
  { hour: '13:00', target: 5.0, actual: 3.2 },
  { hour: '15:00', target: 5.0, actual: 3.5 },
];

const PIE_COLORS = ['#06b6d4', '#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'];

export default function AnalyticsPage() {
  const { state } = useSuraksha();
  const [timeFilter, setTimeFilter] = useState('TODAY');

  // Dynamic incident category tally
  const categoryCounts: { [key: string]: number } = {};
  state.incidents.forEach((inc) => {
    categoryCounts[inc.type] = (categoryCounts[inc.type] || 0) + 1;
  });

  const categoryChartData = Object.entries(categoryCounts).map(([name, count]) => ({
    name: name.replace('_', ' '),
    count,
  }));

  // Help desk workload tally
  const helpDeskChartData = state.helpDesks.map((hd) => ({
    name: hd.id,
    cases: hd.activeCasesCount,
    capacity: hd.capacity,
  }));

  // Missing person recovery stats
  const searchingCount = state.missingPersons.filter(
    (m) => m.status === 'SEARCHING' || m.status === 'SIGHTED'
  ).length;
  const reunitedCount = state.missingPersons.filter(
    (m) => m.status === 'REUNITED' || m.status === 'LOCATED'
  ).length;

  const recoveryPieData = [
    { name: 'Reunited / Found', value: reunitedCount || 5, color: '#10b981' },
    { name: 'Active Searching', value: searchingCount || 3, color: '#06b6d4' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Mass Gathering Security Analytics & Trends
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational KPIs, crowd accumulation curves, and rapid-response efficacy.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {['TODAY', 'DAY 1 PEAK', 'DAY 2 PEAK', 'FULL EVENT'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                timeFilter === t
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Child Recovery Rate
          </span>
          <div className="text-2xl font-black font-mono text-emerald-400">100%</div>
          <div className="text-[10px] text-slate-500 mt-1">Avg 32 mins to reunion</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Avg Volunteer Dispatch
          </span>
          <div className="text-2xl font-black font-mono text-cyan-400">3.4 mins</div>
          <div className="text-[10px] text-slate-500 mt-1">Smart proximity AI matching</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Sighting Accuracy
          </span>
          <div className="text-2xl font-black font-mono text-purple-400">89.4%</div>
          <div className="text-[10px] text-slate-500 mt-1">False sightings filtered</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Congestion Interventions
          </span>
          <div className="text-2xl font-black font-mono text-amber-400">4 Executed</div>
          <div className="text-[10px] text-slate-500 mt-1">Zero stampede occurrences</div>
        </div>
      </div>

      {/* Row 1: Crowd Density Over Time + Response Times */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Crowd Density Curve (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Crowd Accumulation Curve (Pilgrims vs Venue Safe Capacity)</span>
            </h2>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CROWD_HOURLY_DATA}>
                <defs>
                  <linearGradient id="colorPilgrims" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Area
                  type="monotone"
                  dataKey="pilgrims"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPilgrims)"
                />
                <Line
                  type="monotone"
                  dataKey="capacity"
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-500 text-center font-mono">
            Red Dashed Line = Threshold Safety Capacity (45,000)
          </div>
        </div>

        {/* Response Time Trends (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Response Time Progression (Minutes)</span>
            </h2>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RESPONSE_TIME_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} domain={[2, 6]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="actual" stroke="#38bdf8" strokeWidth={3} />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#64748b"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-500 text-center font-mono">
            Blue Line = Actual Dispatch Speed (avg 3.4m) vs Target (5.0m)
          </div>
        </div>
      </div>

      {/* Row 2: Incidents by Category + Help Desk Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incidents by Category (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Incidents by Classification
          </h2>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Help Desk Workload (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            10 Help Desks Active Case Load vs Capacity
          </h2>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={helpDeskChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="cases" fill="#a855f7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="capacity" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
