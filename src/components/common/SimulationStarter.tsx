'use client';

import { useEffect } from 'react';
import { simulationEngine } from '@/services/simulation';

export function SimulationStarter() {
  useEffect(() => {
    simulationEngine.start();
    return () => {
      simulationEngine.stop();
    };
  }, []);

  return null;
}
