'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { surakshaStore, SurakshaState } from '@/services/store';

export function useSuraksha() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const state = useSyncExternalStore(
    surakshaStore.subscribe.bind(surakshaStore),
    surakshaStore.getState.bind(surakshaStore),
    surakshaStore.getState.bind(surakshaStore) // fallback for SSR
  );

  return {
    state,
    mounted,
    // Store Actions
    setRole: surakshaStore.setRole.bind(surakshaStore),
    toggleSimulation: surakshaStore.toggleSimulation.bind(surakshaStore),
    setSimulationSpeed: surakshaStore.setSimulationSpeed.bind(surakshaStore),
    resetToDefaults: surakshaStore.resetToDefaults.bind(surakshaStore),
    createIncident: surakshaStore.createIncident.bind(surakshaStore),
    updateIncidentStatus: surakshaStore.updateIncidentStatus.bind(surakshaStore),
    assignResponder: surakshaStore.assignResponder.bind(surakshaStore),
    reportMissingPerson: surakshaStore.reportMissingPerson.bind(surakshaStore),
    submitSighting: surakshaStore.submitSighting.bind(surakshaStore),
    verifySighting: surakshaStore.verifySighting.bind(surakshaStore),
    transferIncident: surakshaStore.transferIncident.bind(surakshaStore),
    triggerSos: surakshaStore.triggerSos.bind(surakshaStore),
    executeCrowdDiversion: surakshaStore.executeCrowdDiversion.bind(surakshaStore),
    flagVehicleTrip: surakshaStore.flagVehicleTrip.bind(surakshaStore),
    markNotificationRead: surakshaStore.markNotificationRead.bind(surakshaStore),
    markAllNotificationsRead: surakshaStore.markAllNotificationsRead.bind(surakshaStore),
    addNotification: surakshaStore.addNotification.bind(surakshaStore),
    addAuditLog: surakshaStore.addAuditLog.bind(surakshaStore),
  };
}
