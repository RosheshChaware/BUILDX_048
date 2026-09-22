'use client';

import { surakshaStore } from './store';

class SimulationEngine {
  private timer: NodeJS.Timeout | null = null;
  private scenarioRunning: boolean = false;

  public start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.tick();
    }, 3500);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private tick() {
    const state = surakshaStore.getState();
    if (!state.simulationActive) return;

    surakshaStore.updateSimulationState((s) => {
      // 1. Micro-jitter volunteer GPS locations (walking patrols)
      s.volunteers = s.volunteers.map((v) => {
        if (v.status === 'OFFLINE') return v;
        const latDelta = (Math.random() - 0.5) * 0.00015;
        const lngDelta = (Math.random() - 0.5) * 0.00015;
        return {
          ...v,
          coords: [v.coords[0] + latDelta, v.coords[1] + lngDelta],
        };
      });

      // 2. Fluctuate crowd counts slightly
      s.crowdZones = s.crowdZones.map((z) => {
        const delta = Math.floor((Math.random() - 0.48) * 35);
        const newCount = Math.max(100, z.currentCount + delta);
        return {
          ...z,
          currentCount: newCount,
          densityLevel:
            newCount > z.maxSafeCapacity * 1.1
              ? 'CRITICAL'
              : newCount > z.maxSafeCapacity * 0.8
              ? 'HIGH'
              : newCount > z.maxSafeCapacity * 0.4
              ? 'MODERATE'
              : 'LOW',
          riskColor:
            newCount > z.maxSafeCapacity * 1.1
              ? 'RED'
              : newCount > z.maxSafeCapacity * 0.8
              ? 'ORANGE'
              : newCount > z.maxSafeCapacity * 0.4
              ? 'YELLOW'
              : 'GREEN',
        };
      });

      // 3. Fluctuate camera people counts
      s.cctvCameras = s.cctvCameras.map((cam) => {
        const countDelta = Math.floor((Math.random() - 0.5) * 12);
        return {
          ...cam,
          personCount: Math.max(20, cam.personCount + countDelta),
        };
      });

      // 4. Minor vehicle position progression
      s.vehicleTrips = s.vehicleTrips.map((trip) => {
        if (trip.status === 'SAFE_COMPLETED') return trip;
        const latStep = (Math.random() - 0.2) * 0.0001;
        const lngStep = (Math.random() - 0.2) * 0.0001;
        return {
          ...trip,
          currentPosition: [trip.currentPosition[0] + latStep, trip.currentPosition[1] + lngStep],
          routeHistory: [...trip.routeHistory, [trip.currentPosition[0] + latStep, trip.currentPosition[1] + lngStep]],
        };
      });
    });
  }

  // --- SCRIPTED DEMO SCENARIOS FOR HACKATHON PRESENTATION ---

  public async triggerScenario1_ChildRescue(onStep?: (msg: string) => void) {
    if (this.scenarioRunning) return;
    this.scenarioRunning = true;

    try {
      onStep?.('Step 1/5: Citizen reports missing child (Aarav, 6yo)...');
      const { incident } = surakshaStore.reportMissingPerson({
        name: 'Aarav Patil',
        age: 6,
        gender: 'MALE',
        category: 'CHILD',
        clothingDescription: 'Yellow t-shirt, blue shorts, red sandals',
        lastKnownLocation: 'Near Annadanam Hall Gate 2',
        contactPerson: 'Suresh Patil',
        contactNumber: '+91 98234 56789',
        medicalNotes: 'Asthma inhaler pouch around neck',
      });

      await new Promise((r) => setTimeout(r, 2000));
      onStep?.('Step 2/5: AI CCTV Scanner detects 89% match on CAM-04 (East Gate Walk)...');
      surakshaStore.addNotification({
        type: 'WARNING',
        title: 'AI Facial Match on CAM-04',
        message: 'Aarav Patil match confidence: 89%. Verification requested.',
        incidentId: incident.id,
        actionLink: '/sighting',
      });

      await new Promise((r) => setTimeout(r, 2200));
      onStep?.('Step 3/5: Pilgrim submits live sighting; Operator marks VERIFIED...');
      const sighting = surakshaStore.submitSighting({
        incidentId: incident.id,
        missingPersonName: 'Aarav Patil',
        reporterName: 'Pravin Godghate',
        reporterType: 'CITIZEN',
        location: 'Ice cream cart behind East Gate 2',
        description: 'Small boy in yellow shirt crying near the soft drink kiosk looking for his father.',
      });

      await new Promise((r) => setTimeout(r, 1800));
      surakshaStore.verifySighting(
        sighting.id,
        'VERIFIED',
        'Facial & apparel match confirmed with CAM-04 video frame.',
        'Control Room Inspector'
      );

      await new Promise((r) => setTimeout(r, 2000));
      onStep?.('Step 4/5: Proximity Smart Assignment -> Volunteer V-012 dispatched (420m away)...');
      surakshaStore.assignResponder(
        incident.id,
        {
          id: 'V-012',
          name: 'Lata Vaidya (Volunteer)',
          type: 'VOLUNTEER',
          phone: '+91 98221 11012',
          distanceMeters: 420,
        },
        'Smart AI Dispatch'
      );

      await new Promise((r) => setTimeout(r, 2500));
      onStep?.('Step 5/5: Child located safely! Reunited with father. Case RESOLVED.');
      surakshaStore.updateIncidentStatus(
        incident.id,
        'RESOLVED',
        'Volunteer V-012 secured child at East Gate Help Desk 2 and reunited with father Suresh Patil.',
        'Lata Vaidya (Volunteer)'
      );

      surakshaStore.addNotification({
        type: 'SUCCESS',
        title: 'SCENARIO 1 COMPLETE: Child Reunited!',
        message: 'Aarav Patil safely reunited with family in under 4 minutes. Incident CLOSED.',
        incidentId: incident.id,
        actionLink: `/incidents/${incident.id}`,
      });
    } finally {
      this.scenarioRunning = false;
    }
  }

  public async triggerScenario2_CrowdSurge(onStep?: (msg: string) => void) {
    if (this.scenarioRunning) return;
    this.scenarioRunning = true;

    try {
      onStep?.('Step 1/4: Simulating sudden crowd surge at Exit Gate 3 (Laxmi Nagar)...');
      surakshaStore.updateSimulationState((s) => {
        s.exitGates = s.exitGates.map((eg) =>
          eg.id === 'EXIT-03'
            ? {
                ...eg,
                currentCrowd: 8200,
                congestionPct: 98,
                riskLevel: 'CRITICAL',
                recommendedAction: 'CRITICAL: Halt incoming flow! Divert pilgrims towards Exit 02 and Gate 4 immediately.',
              }
            : eg
        );
        s.crowdZones = s.crowdZones.map((z) =>
          z.id === 'ZONE-03'
            ? {
                ...z,
                currentCount: 8900,
                densityLevel: 'CRITICAL',
                riskColor: 'RED',
              }
            : z
        );
      });

      surakshaStore.addNotification({
        type: 'CRITICAL',
        title: 'CRITICAL SURGE: Exit 03 Exceeded Safe Limits',
        message: 'Sensor alert: 8,200 pilgrims / 5,000 capacity. Severe stampede risk detected.',
        actionLink: '/crowd',
      });

      await new Promise((r) => setTimeout(r, 2500));
      onStep?.('Step 2/4: Crowd AI generates emergency diversion recommendation...');
      surakshaStore.addNotification({
        type: 'WARNING',
        title: 'AI Crowd Diversion Plan Ready',
        message: 'Recommended: Divert 60% of influx to East Gate 2 & Ring Road Gate 4.',
        actionLink: '/crowd',
      });

      await new Promise((r) => setTimeout(r, 2000));
      onStep?.('Step 3/4: Control Room orders barricade repositioning & volunteer deployment...');
      surakshaStore.executeCrowdDiversion('EXIT-03');

      await new Promise((r) => setTimeout(r, 2200));
      onStep?.('Step 4/4: Gate 3 normalized! Pedestrian flow balanced across Gate 2 and Gate 4.');
      surakshaStore.addNotification({
        type: 'SUCCESS',
        title: 'SCENARIO 2 COMPLETE: Crowd Danger Averted',
        message: 'Gate 3 density reduced to 45% (Safe Green). No injuries reported.',
        actionLink: '/crowd',
      });
    } finally {
      this.scenarioRunning = false;
    }
  }

  public async triggerScenario3_VehicleSafety(onStep?: (msg: string) => void) {
    if (this.scenarioRunning) return;
    this.scenarioRunning = true;

    try {
      onStep?.('Step 1/3: Shared-Auto MH-31-AZ-4921 deviates 1.45km off designated route...');
      surakshaStore.updateSimulationState((s) => {
        s.vehicleTrips = s.vehicleTrips.map((vt) =>
          vt.id === 'TRIP-2026-809'
            ? {
                ...vt,
                isDeviated: true,
                deviationDistanceMeters: 1650,
                status: 'DEVIATED_ALERT',
              }
            : vt
        );
      });

      surakshaStore.addNotification({
        type: 'CRITICAL',
        title: 'Passenger Safety Alert: Auto Deviation',
        message: 'Trip TRIP-2026-809 deviated >1.5km from authorized transit corridor.',
        actionLink: '/vehicle-safety',
      });

      await new Promise((r) => setTimeout(r, 2500));
      onStep?.('Step 2/3: Control Room calls driver & dispatches nearby PCR mobile unit PP-07...');
      surakshaStore.flagVehicleTrip('TRIP-2026-809', 'CONTACT_DRIVER');

      await new Promise((r) => setTimeout(r, 2500));
      onStep?.('Step 3/3: Driver confirms taking detour due to road construction. Passenger safe!');
      surakshaStore.flagVehicleTrip('TRIP-2026-809', 'SAFE_RESOLVED');
      surakshaStore.addNotification({
        type: 'SUCCESS',
        title: 'SCENARIO 3 COMPLETE: Route Deviation Cleared',
        message: 'Passenger safety confirmed. Detour logged in transit safety register.',
        actionLink: '/vehicle-safety',
      });
    } finally {
      this.scenarioRunning = false;
    }
  }
}

export const simulationEngine = new SimulationEngine();
