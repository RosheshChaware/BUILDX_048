'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const SecurityMap = dynamic(() => import('./SecurityMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[560px] bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-xs animate-pulse">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Initializing Tactical Security GIS Map...</span>
      </div>
    </div>
  ),
});

export default SecurityMap;
