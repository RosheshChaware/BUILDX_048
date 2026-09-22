'use client';

import {
  Incident,
  MissingPerson,
  Sighting,
  HelpDesk,
  Volunteer,
  PolicePost,
  CCTVCamera,
  CrowdZone,
  ExitGate,
  VehicleTrip,
  NotificationItem,
  AuditLogEntry,
  UserRole,
  IncidentStatus,
  Severity,
  VerificationStatus,
  IncidentType,
} from '@/types';
import {
  INITIAL_INCIDENTS,
  INITIAL_MISSING_PERSONS,
  INITIAL_SIGHTINGS,
  INITIAL_HELP_DESKS,
  INITIAL_VOLUNTEERS,
  INITIAL_POLICE_POSTS,
  INITIAL_CCTV,
  INITIAL_CROWD_ZONES,
  INITIAL_EXIT_GATES,
  INITIAL_VEHICLE_TRIPS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from './mockData';

export interface SurakshaState {
  currentRole: UserRole;
  simulationActive: boolean;
  simulationSpeed: number; // 1, 2, 5
  incidents: Incident[];
  missingPersons: MissingPerson[];
  sightings: Sighting[];
  helpDesks: HelpDesk[];
  volunteers: Volunteer[];
  policePosts: PolicePost[];
  cctvCameras: CCTVCamera[];
  crowdZones: CrowdZone[];
  exitGates: ExitGate[];
  vehicleTrips: VehicleTrip[];
  notifications: NotificationItem[];
  auditLogs: AuditLogEntry[];
}

const STORAGE_KEY = 'suraksha_net_state_v1';

class SurakshaStore {
  private state: SurakshaState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): SurakshaState {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            // ensure any new properties exist
            currentRole: parsed.currentRole || 'CONTROL_ROOM',
            simulationActive: parsed.simulationActive ?? true,
            simulationSpeed: parsed.simulationSpeed || 1,
          };
        }
      } catch (e) {
        console.warn('Failed to load SurakshaNet state from localStorage:', e);
      }
    }

    return {
      currentRole: 'CONTROL_ROOM',
      simulationActive: true,
      simulationSpeed: 1,
      incidents: INITIAL_INCIDENTS,
      missingPersons: INITIAL_MISSING_PERSONS,
      sightings: INITIAL_SIGHTINGS,
      helpDesks: INITIAL_HELP_DESKS,
      volunteers: INITIAL_VOLUNTEERS,
      policePosts: INITIAL_POLICE_POSTS,
      cctvCameras: INITIAL_CCTV,
      crowdZones: INITIAL_CROWD_ZONES,
      exitGates: INITIAL_EXIT_GATES,
      vehicleTrips: INITIAL_VEHICLE_TRIPS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
    };
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save SurakshaNet state to localStorage:', e);
      }
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): SurakshaState {
    return this.state;
  }

  // --- ACTIONS ---

  public setRole(role: UserRole) {
    this.state.currentRole = role;
    this.persist();
  }

  public toggleSimulation(active?: boolean) {
    this.state.simulationActive = active !== undefined ? active : !this.state.simulationActive;
    this.persist();
  }

  public setSimulationSpeed(speed: number) {
    this.state.simulationSpeed = speed;
    this.persist();
  }

  public resetToDefaults() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.state = {
      currentRole: 'CONTROL_ROOM',
      simulationActive: true,
      simulationSpeed: 1,
      incidents: INITIAL_INCIDENTS,
      missingPersons: INITIAL_MISSING_PERSONS,
      sightings: INITIAL_SIGHTINGS,
      helpDesks: INITIAL_HELP_DESKS,
      volunteers: INITIAL_VOLUNTEERS,
      policePosts: INITIAL_POLICE_POSTS,
      cctvCameras: INITIAL_CCTV,
      crowdZones: INITIAL_CROWD_ZONES,
      exitGates: INITIAL_EXIT_GATES,
      vehicleTrips: INITIAL_VEHICLE_TRIPS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
    };
    this.persist();
  }

  public addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) {
    const newNotif: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    this.state.notifications = [newNotif, ...this.state.notifications];
    this.persist();
  }

  public markNotificationRead(id: string) {
    this.state.notifications = this.state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.persist();
  }

  public markAllNotificationsRead() {
    this.state.notifications = this.state.notifications.map((n) => ({ ...n, read: true }));
    this.persist();
  }

  public addAuditLog(actor: string, role: UserRole, action: string, targetId: string, details: string) {
    const entry: AuditLogEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor,
      role,
      action,
      targetId,
      details,
    };
    this.state.auditLogs = [entry, ...this.state.auditLogs];
    this.persist();
  }

  public createIncident(
    data: Omit<Incident, 'id' | 'timestamp' | 'timeline' | 'status'> & {
      initialStatus?: IncidentStatus;
    }
  ): Incident {
    const newId = `INC-2026-${Math.floor(1060 + Math.random() * 8900)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const initialStatus = data.initialStatus || 'REPORTED';

    const newIncident: Incident = {
      ...data,
      id: newId,
      timestamp: timeStr,
      status: initialStatus,
      timeline: [
        {
          id: `TL-${Date.now()}`,
          timestamp: timeStr,
          title: 'Incident Reported',
          description: `Report filed by ${data.reporter.name} (${data.reporter.role}). Location: ${data.location}`,
          actor: data.reporter.name,
          type: 'STATUS_CHANGE',
        },
      ],
    };

    this.state.incidents = [newIncident, ...this.state.incidents];

    this.addNotification({
      type: data.severity === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
      title: `New Incident Created: ${newId}`,
      message: `${data.title} (${data.severity} priority)`,
      incidentId: newId,
      actionLink: `/incidents/${newId}`,
    });

    this.addAuditLog(
      data.reporter.name,
      (data.reporter.role as UserRole) || 'CITIZEN',
      'CREATE_INCIDENT',
      newId,
      `New incident registered: ${data.title}`
    );

    this.persist();
    return newIncident;
  }

  public updateIncidentStatus(
    id: string,
    newStatus: IncidentStatus,
    notes?: string,
    actorName: string = 'Control Room Operator'
  ) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.state.incidents = this.state.incidents.map((inc) => {
      if (inc.id === id) {
        const updatedTimeline = [
          ...inc.timeline,
          {
            id: `TL-${Date.now()}`,
            timestamp: timeStr,
            title: `Status Changed to ${newStatus}`,
            description: notes || `Status updated from ${inc.status} to ${newStatus}.`,
            actor: actorName,
            type: 'STATUS_CHANGE' as const,
          },
        ];

        return {
          ...inc,
          status: newStatus,
          timeline: updatedTimeline,
          resolvedAt: newStatus === 'RESOLVED' || newStatus === 'CLOSED' ? timeStr : inc.resolvedAt,
          resolutionNotes: notes || inc.resolutionNotes,
        };
      }
      return inc;
    });

    this.addNotification({
      type: newStatus === 'RESOLVED' ? 'SUCCESS' : 'INFO',
      title: `Incident ${id} Updated`,
      message: `Status updated to ${newStatus}.`,
      incidentId: id,
      actionLink: `/incidents/${id}`,
    });

    this.addAuditLog(
      actorName,
      this.state.currentRole,
      'UPDATE_STATUS',
      id,
      `Changed status to ${newStatus}. Notes: ${notes || 'None'}`
    );

    this.persist();
  }

  public assignResponder(
    incidentId: string,
    responder: {
      id: string;
      name: string;
      type: 'VOLUNTEER' | 'POLICE' | 'MEDICAL';
      phone: string;
      distanceMeters?: number;
    },
    actorName: string = 'Control Room Dispatcher'
  ) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.state.incidents = this.state.incidents.map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'ASSIGNED',
          assignedResponder: {
            ...responder,
            assignedAt: timeStr,
          },
          timeline: [
            ...inc.timeline,
            {
              id: `TL-${Date.now()}`,
              timestamp: timeStr,
              title: `Assigned to ${responder.name} (${responder.type})`,
              description: `Proximity dispatch initiated. Distance: ${responder.distanceMeters || 'Unknown'}m.`,
              actor: actorName,
              type: 'ASSIGNMENT',
            },
          ],
        };
      }
      return inc;
    });

    // If volunteer, update volunteer status
    if (responder.type === 'VOLUNTEER') {
      this.state.volunteers = this.state.volunteers.map((v) =>
        v.id === responder.id
          ? {
              ...v,
              status: 'ASSIGNED',
              assignedIncidentId: incidentId,
              assignedDistanceMeters: responder.distanceMeters,
            }
          : v
      );
    }

    this.addNotification({
      type: 'INFO',
      title: `Responder Dispatched for ${incidentId}`,
      message: `${responder.name} (${responder.type}) assigned to respond.`,
      incidentId,
      actionLink: `/incidents/${incidentId}`,
    });

    this.addAuditLog(
      actorName,
      this.state.currentRole,
      'ASSIGN_RESPONDER',
      incidentId,
      `Assigned ${responder.name} (${responder.id})`
    );

    this.persist();
  }

  public reportMissingPerson(data: {
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    category: 'CHILD' | 'ELDERLY' | 'ADULT';
    photoUrl?: string;
    clothingDescription: string;
    lastKnownLocation: string;
    coords?: [number, number];
    lastSeenTime?: string;
    contactPerson: string;
    contactNumber: string;
    medicalNotes?: string;
  }): { missingPerson: MissingPerson; incident: Incident } {
    const mpId = `MP-${Math.floor(110 + Math.random() * 880)}`;
    const timeStr = data.lastSeenTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const defaultCoords: [number, number] = data.coords || [21.12785, 79.06690];
    const defaultPhoto = data.photoUrl || (data.category === 'CHILD' 
      ? 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=400&q=80' 
      : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80');

    // 1. Create linked Incident
    const incident = this.createIncident({
      type: 'MISSING_PERSON',
      title: `Missing ${data.category === 'CHILD' ? 'Child' : data.category === 'ELDERLY' ? 'Elderly Person' : 'Adult'}: ${data.name} (${data.age}yo)`,
      reporter: {
        name: data.contactPerson,
        phone: data.contactNumber,
        role: 'CITIZEN',
      },
      location: data.lastKnownLocation,
      coords: defaultCoords,
      description: `Clothing: ${data.clothingDescription}. Last seen at ${timeStr}. ${data.medicalNotes ? `Medical Notes: ${data.medicalNotes}` : ''}`,
      evidence: {
        photoUrls: [defaultPhoto],
      },
      severity: data.category === 'CHILD' || (data.medicalNotes && data.medicalNotes.length > 0) ? 'HIGH' : 'MEDIUM',
      verificationStatus: 'VERIFIED',
      initialStatus: 'UNDER_REVIEW',
      nearbyCctvIds: ['CAM-03', 'CAM-04', 'CAM-09'],
      nearbyHelpDeskId: 'HD-02',
      tags: [data.category, data.gender, 'Missing Person Intake'],
    });

    // 2. Simulated instant CCTV initial match search
    const simulatedCctvMatch = {
      cameraId: 'CAM-04',
      cameraLocation: 'East Gate 2 Stupa Approach Walk',
      timestamp: timeStr,
      confidence: 87,
      status: 'PENDING' as const,
    };

    const newMp: MissingPerson = {
      id: mpId,
      incidentId: incident.id,
      name: data.name,
      age: data.age,
      gender: data.gender,
      category: data.category,
      photoUrl: defaultPhoto,
      clothingDescription: data.clothingDescription,
      lastKnownLocation: data.lastKnownLocation,
      coords: defaultCoords,
      lastSeenTime: timeStr,
      contactPerson: data.contactPerson,
      contactNumber: data.contactNumber,
      medicalNotes: data.medicalNotes,
      status: 'SEARCHING',
      matchedCctv: [simulatedCctvMatch],
    };

    this.state.missingPersons = [newMp, ...this.state.missingPersons];

    this.addNotification({
      type: 'WARNING',
      title: `AI Search Active for ${data.name}`,
      message: `Potential camera match (87%) detected on CAM-04 near East Gate. Verification required.`,
      incidentId: incident.id,
      actionLink: `/missing-person`,
    });

    this.persist();
    return { missingPerson: newMp, incident };
  }

  public submitSighting(data: {
    incidentId: string;
    missingPersonName?: string;
    reporterName: string;
    reporterType: 'CITIZEN' | 'VOLUNTEER' | 'POLICE' | 'CCTV_AI';
    reporterContact?: string;
    location: string;
    coords?: [number, number];
    description: string;
    photoUrl?: string;
  }): Sighting {
    const sId = `SGT-${Math.floor(210 + Math.random() * 780)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const defaultCoords: [number, number] = data.coords || [21.12785, 79.06800];

    // Simulate AI consistency check
    const aiSimilarity = Math.floor(75 + Math.random() * 23); // 75 - 98%
    const isConsistent = aiSimilarity > 80;

    const newSighting: Sighting = {
      id: sId,
      incidentId: data.incidentId,
      missingPersonName: data.missingPersonName,
      reporterName: data.reporterName,
      reporterType: data.reporterType,
      reporterContact: data.reporterContact,
      location: data.location,
      coords: defaultCoords,
      timestamp: timeStr,
      description: data.description,
      photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=400&q=80',
      verificationStatus: 'UNVERIFIED',
      aiConfidence: aiSimilarity >= 85 ? 'HIGH' : aiSimilarity >= 65 ? 'MEDIUM' : 'LOW',
      aiSimilarityScore: aiSimilarity,
      consistencyCheck: {
        locationConsistent: isConsistent,
        timeConsistent: true,
        duplicateSuspected: false,
        notes: `AI similarity scored at ${aiSimilarity}%. Proximity to last reported locus is within acceptable radius.`,
      },
    };

    this.state.sightings = [newSighting, ...this.state.sightings];

    this.addNotification({
      type: 'WARNING',
      title: `Unverified Sighting Submitted (${sId})`,
      message: `For Incident ${data.incidentId}. AI Confidence: ${newSighting.aiConfidence} (${aiSimilarity}%).`,
      incidentId: data.incidentId,
      actionLink: `/sighting`,
    });

    this.addAuditLog(
      data.reporterName,
      this.state.currentRole,
      'SUBMIT_SIGHTING',
      sId,
      `Submitted sighting for ${data.incidentId} at ${data.location}`
    );

    this.persist();
    return newSighting;
  }

  public verifySighting(
    sightingId: string,
    decision: 'VERIFIED' | 'REJECTED' | 'DUPLICATE',
    notes?: string,
    actorName: string = 'Control Room Verifier'
  ) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let linkedIncidentId: string | undefined;

    this.state.sightings = this.state.sightings.map((s) => {
      if (s.id === sightingId) {
        linkedIncidentId = s.incidentId;
        return {
          ...s,
          verificationStatus: decision,
          verifiedBy: actorName,
          verifiedAt: timeStr,
          consistencyCheck: {
            ...s.consistencyCheck,
            notes: notes || s.consistencyCheck.notes,
          },
        };
      }
      return s;
    });

    if (linkedIncidentId) {
      if (decision === 'VERIFIED') {
        // Update incident timeline & missing person status
        this.state.incidents = this.state.incidents.map((inc) => {
          if (inc.id === linkedIncidentId) {
            return {
              ...inc,
              verificationStatus: 'VERIFIED',
              status: inc.status === 'REPORTED' || inc.status === 'UNDER_REVIEW' ? 'VERIFIED' : inc.status,
              timeline: [
                ...inc.timeline,
                {
                  id: `TL-${Date.now()}`,
                  timestamp: timeStr,
                  title: `Sighting ${sightingId} VERIFIED`,
                  description: `Operator confirmed sighting. ${notes || ''}`,
                  actor: actorName,
                  type: 'VERIFICATION',
                },
              ],
            };
          }
          return inc;
        });

        this.state.missingPersons = this.state.missingPersons.map((mp) => {
          if (mp.incidentId === linkedIncidentId && mp.status === 'SEARCHING') {
            return { ...mp, status: 'SIGHTED' };
          }
          return mp;
        });

        this.addNotification({
          type: 'SUCCESS',
          title: `Sighting ${sightingId} VERIFIED!`,
          message: `Incident ${linkedIncidentId} escalated. High-priority search team alert sent.`,
          incidentId: linkedIncidentId,
          actionLink: `/incidents/${linkedIncidentId}`,
        });
      } else {
        this.addNotification({
          type: 'INFO',
          title: `Sighting ${sightingId} Marked ${decision}`,
          message: notes || 'Sighting dismissed based on verification check.',
          actionLink: `/sighting`,
        });
      }
    }

    this.addAuditLog(
      actorName,
      this.state.currentRole,
      'VERIFY_SIGHTING',
      sightingId,
      `Marked sighting as ${decision}. Notes: ${notes || 'None'}`
    );

    this.persist();
  }

  public transferIncident(
    incidentId: string,
    newHelpDeskId: string,
    reason: string,
    actorName: string = 'Help Desk Operator'
  ) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetDesk = this.state.helpDesks.find((h) => h.id === newHelpDeskId);

    this.state.incidents = this.state.incidents.map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          nearbyHelpDeskId: newHelpDeskId,
          timeline: [
            ...inc.timeline,
            {
              id: `TL-${Date.now()}`,
              timestamp: timeStr,
              title: `Case Transferred to ${targetDesk?.name || newHelpDeskId}`,
              description: `Reason: ${reason}`,
              actor: actorName,
              type: 'NOTE',
            },
          ],
        };
      }
      return inc;
    });

    // Update help desk counts
    this.state.helpDesks = this.state.helpDesks.map((hd) => {
      if (hd.id === newHelpDeskId) {
        return { ...hd, activeCasesCount: hd.activeCasesCount + 1 };
      }
      return hd;
    });

    this.addNotification({
      type: 'INFO',
      title: `Incident ${incidentId} Transferred`,
      message: `Reassigned to ${targetDesk?.name || newHelpDeskId}.`,
      incidentId,
      actionLink: `/incidents/${incidentId}`,
    });

    this.addAuditLog(actorName, this.state.currentRole, 'TRANSFER_INCIDENT', incidentId, `Transferred to ${newHelpDeskId}`);

    this.persist();
  }

  public triggerSos(data: {
    category: 'MEDICAL' | 'POLICE' | 'FIRE' | 'MISSING' | 'HARASSMENT' | 'OTHER';
    locationName: string;
    coords?: [number, number];
    userName: string;
    userPhone: string;
    description?: string;
  }): Incident {
    const defaultCoords: [number, number] = data.coords || [21.12785, 79.06690];
    const incident = this.createIncident({
      type: data.category === 'MEDICAL' ? 'MEDICAL' : data.category === 'HARASSMENT' ? 'HARASSMENT' : 'SOS',
      title: `SOS BEACON: ${data.category} Emergency at ${data.locationName}`,
      reporter: {
        name: data.userName,
        phone: data.userPhone,
        role: 'CITIZEN',
      },
      location: data.locationName,
      coords: defaultCoords,
      description: data.description || `Immediate citizen emergency beacon triggered for ${data.category}. Rapid intervention required.`,
      severity: 'CRITICAL',
      verificationStatus: 'VERIFIED',
      initialStatus: 'RESPONDING',
      assignedDepartment: data.category === 'MEDICAL' ? 'Emergency Medical Service' : 'Nagpur Police Quick Response Team',
      assignedResponder: {
        id: 'PP-08',
        name: 'Police QRT Mobile Unit 1',
        type: 'POLICE',
        phone: '+91 712 256 1008',
        assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        distanceMeters: 95,
      },
      nearbyCctvIds: ['CAM-01', 'CAM-09'],
      nearbyHelpDeskId: 'HD-01',
      tags: ['SOS', data.category, 'Urgent Response'],
    });

    this.persist();
    return incident;
  }

  public executeCrowdDiversion(exitId: string) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.state.exitGates = this.state.exitGates.map((eg) => {
      if (eg.id === exitId) {
        return {
          ...eg,
          congestionPct: 45,
          riskLevel: 'NORMAL',
          currentCrowd: 3200,
          recommendedAction: 'Traffic safely diverted towards Exit 02 & Gate 4. Flow normalized.',
        };
      }
      if (eg.id === 'EXIT-02') {
        return {
          ...eg,
          currentCrowd: eg.currentCrowd + 800,
          congestionPct: 70,
          recommendedAction: 'Receiving diverted flow. Gate staff operating at expanded capacity.',
        };
      }
      return eg;
    });

    this.state.crowdZones = this.state.crowdZones.map((z) => {
      if (z.id === 'ZONE-03') {
        return {
          ...z,
          currentCount: 4600,
          densityLevel: 'MODERATE',
          riskColor: 'GREEN',
          trend: 'DECREASING',
        };
      }
      return z;
    });

    this.addNotification({
      type: 'SUCCESS',
      title: 'Crowd Diversion Protocol Executed',
      message: `${exitId} bottleneck successfully relieved. Incoming stream redirected to Gate 2 & 4.`,
      actionLink: '/crowd',
    });

    this.addAuditLog(
      'Control Room Chief',
      this.state.currentRole,
      'CROWD_DIVERSION',
      exitId,
      'Executed dynamic exit diversion. Risk returned to NORMAL.'
    );

    this.persist();
  }

  public flagVehicleTrip(tripId: string, action: 'FLAG_ALERT' | 'CONTACT_DRIVER' | 'SAFE_RESOLVED') {
    this.state.vehicleTrips = this.state.vehicleTrips.map((trip) => {
      if (trip.id === tripId) {
        if (action === 'SAFE_RESOLVED') {
          return {
            ...trip,
            isDeviated: false,
            status: 'SAFE_COMPLETED',
          };
        }
        return {
          ...trip,
          status: 'INVESTIGATING',
        };
      }
      return trip;
    });

    this.addNotification({
      type: action === 'SAFE_RESOLVED' ? 'SUCCESS' : 'WARNING',
      title: `Vehicle Trip ${tripId} ${action === 'SAFE_RESOLVED' ? 'Cleared' : 'Under Investigation'}`,
      message: action === 'SAFE_RESOLVED' ? 'Driver and passengers verified safe.' : 'PCR mobile van contacted driver.',
      actionLink: '/vehicle-safety',
    });

    this.persist();
  }

  // Real-time tick updates (called by simulation engine)
  public updateSimulationState(updater: (state: SurakshaState) => void) {
    updater(this.state);
    this.persist();
  }
}

// Global singleton instance
export const surakshaStore = new SurakshaStore();
