'use client';

import React, { useState } from 'react';
import { Sparkles, Play, CheckCircle2, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { simulationEngine } from '@/services/simulation';
import { useSuraksha } from '@/hooks/useSuraksha';

export function SimulationBanner() {
  const { state, resetToDefaults } = useSuraksha();
  const [activeScenario, setActiveScenario] = useState<number | null>(null);
  const [scenarioStepText, setScenarioStepText] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const runScenario = async (num: number) => {
    setActiveScenario(num);
    setScenarioStepText('Starting automated presentation scenario...');

    if (num === 1) {
      await simulationEngine.triggerScenario1_ChildRescue((step) => {
        setScenarioStepText(step);
      });
    } else if (num === 2) {
      await simulationEngine.triggerScenario2_CrowdSurge((step) => {
        setScenarioStepText(step);
      });
    } else if (num === 3) {
      await simulationEngine.triggerScenario3_VehicleSafety((step) => {
        setScenarioStepText(step);
      });
    }

    setTimeout(() => {
      setActiveScenario(null);
      setScenarioStepText('');
    }, 4000);
  };

  return (
    <div className="w-full bg-slate-900/90 border-b border-cyan-900/40 text-slate-300 text-xs px-4 py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
        {/* Left: Simulation Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 font-semibold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>HACKATHON DEMO ENGINE</span>
          </div>

          <span className="text-slate-400 hidden sm:inline text-[11px]">
            One-click triggers for the 3 presentation scenarios:
          </span>
        </div>

        {/* Center / Right: Scenario Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => runScenario(1)}
            disabled={activeScenario !== null}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1.5 transition ${
              activeScenario === 1
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-md animate-pulse'
                : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-cyan-500/50'
            }`}
            title="Citizen reports child -> AI CCTV match -> Sighting verified -> Volunteer dispatched -> Reunited"
          >
            {activeScenario === 1 ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Play className="w-3 h-3 text-cyan-400" />
            )}
            <span>Story 1: Missing Child Rescue</span>
          </button>

          <button
            onClick={() => runScenario(2)}
            disabled={activeScenario !== null}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1.5 transition ${
              activeScenario === 2
                ? 'bg-red-600 text-white border-red-500 shadow-md animate-pulse'
                : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-red-500/50'
            }`}
            title="Exit 3 sudden surge -> Critical Red Alert -> AI diversion recommendation -> Deployed -> Normal"
          >
            {activeScenario === 2 ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Play className="w-3 h-3 text-red-400" />
            )}
            <span>Story 2: Gate 3 Crowd Surge</span>
          </button>

          <button
            onClick={() => runScenario(3)}
            disabled={activeScenario !== null}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1.5 transition ${
              activeScenario === 3
                ? 'bg-amber-600 text-white border-amber-500 shadow-md animate-pulse'
                : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-amber-500/50'
            }`}
            title="Shared-auto route deviation detected -> Safety alert -> PCR check -> Safe confirmation"
          >
            {activeScenario === 3 ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Play className="w-3 h-3 text-amber-400" />
            )}
            <span>Story 3: Vehicle Route Deviation</span>
          </button>

          <button
            onClick={resetToDefaults}
            className="p-1 rounded-md bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600"
            title="Reset Simulation State"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Active step readout banner when executing a scenario */}
      {scenarioStepText && (
        <div className="mt-2 py-1 px-3 rounded bg-cyan-950/60 border border-cyan-800/70 text-[11px] text-cyan-200 flex items-center gap-2 animate-fadeIn">
          <Loader2 className="w-3 h-3 animate-spin text-cyan-400 shrink-0" />
          <span className="font-mono font-medium">{scenarioStepText}</span>
        </div>
      )}
    </div>
  );
}
