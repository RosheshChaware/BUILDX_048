'use client';

import React, { useState } from 'react';
import DynamicSecurityMap from '@/components/map/DynamicSecurityMap';
import { MapPin, Filter, Search, Shield, Users, Radio, AlertOctagon } from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';

export default function FullSecurityMapPage() {
  const { state } = useSuraksha();
  const [activeZoneFilter, setActiveZoneFilter] = useState('ALL');

  return (
    <div className="p-4 sm:p-6 max-w-[1800px] mx-auto space-y-4">
      {/* Top Map HUD Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white">
              Tactical GIS Security Map (Deekshabhoomi, Nagpur)
            </h1>
            <p className="text-xs text-slate-400">
              High-resolution spatial awareness tracking 9 operational layers in real-time.
            </p>
          </div>
        </div>

        {/* Quick Quick Status Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Active Incidents: <strong className="text-red-400">{state.incidents.length}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Volunteers: <strong className="text-cyan-400">20 on patrol</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            CCTV: <strong className="text-emerald-400">15 Online</strong>
          </div>
        </div>
      </div>

      {/* Full Size Tactical Map */}
      <div className="relative">
        <DynamicSecurityMap height="720px" zoom={16} interactive={true} />
      </div>
    </div>
  );
}
