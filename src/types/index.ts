export type IncidentType =
  | 'MISSING_PERSON'
  | 'SIGHTING'
  | 'SOS'
  | 'THEFT'
  | 'CROWD_SURGE'
  | 'MEDICAL'
  | 'VEHICLE_SAFETY'
  | 'HARASSMENT'
  | 'FIRE'
  | 'SUSPICIOUS_ACTIVITY'
  | 'OTHER';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'DUPLICATE';

export type IncidentStatus =
  | 'REPORTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'RESPONDING'
  | 'RESOLVED'
  | 'CLOSED';

export type UserRole =
  | 'CITIZEN'
  | 'VOLUNTEER'
  | 'HELP_DESK'
  | 'POLICE'
  | 'CONTROL_ROOM'
  | 'ADMIN';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  type: 'STATUS_CHANGE' | 'ASSIGNMENT' | 'VERIFICATION' | 'NOTE' | 'ALERT';
}

export interface Incident {
  id: string; // e.g. INC-2026-1048
  type: IncidentType;
  title: string;
  reporter: {
    name: string;
    phone: string;
    role: UserRole | 'CITIZEN';
    isAnonymous?: boolean;
  };
  location: string;
  coords: [number, number]; // [lat, lng]
  timestamp: string;
  description: string;
  evidence?: {
    photoUrls?: string[];
    videoNote?: string;
    suspectDescription?: string;
  };
  severity: Severity;
  verificationStatus: VerificationStatus;
  status: IncidentStatus;
  assignedDepartment?: string;
  assignedResponder?: {
    id: string;
    name: string;
    type: 'VOLUNTEER' | 'POLICE' | 'MEDICAL';
    phone: string;
    assignedAt: string;
    distanceMeters?: number;
  };
  timeline: TimelineEvent[];
  nearbyCctvIds: string[];
  nearbyHelpDeskId: string;
  tags: string[];
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface CctvMatch {
  cameraId: string;
  cameraLocation: string;
  timestamp: string;
  confidence: number; // 0 - 100
  status: 'PENDING' | 'CONFIRMED' | 'DISMISSED';
  frameUrl?: string;
}

export interface MissingPerson {
  id: string; // MP-101
  incidentId: string; // linked INC-2026-XXXX
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  category: 'CHILD' | 'ELDERLY' | 'ADULT';
  photoUrl: string;
  clothingDescription: string;
  lastKnownLocation: string;
  coords: [number, number];
  lastSeenTime: string;
  contactPerson: string;
  contactNumber: string;
  medicalNotes?: string;
  status: 'SEARCHING' | 'SIGHTED' | 'LOCATED' | 'REUNITED';
  matchedCctv: CctvMatch[];
}

export interface Sighting {
  id: string; // SGT-201
  incidentId: string; // linked INC-2026-XXXX
  missingPersonName?: string;
  reporterName: string;
  reporterType: 'CITIZEN' | 'VOLUNTEER' | 'POLICE' | 'CCTV_AI';
  reporterContact?: string;
  location: string;
  coords: [number, number];
  timestamp: string;
  description: string;
  photoUrl?: string;
  verificationStatus: VerificationStatus;
  aiConfidence: 'LOW' | 'MEDIUM' | 'HIGH';
  aiSimilarityScore: number; // 0 - 100
  consistencyCheck: {
    locationConsistent: boolean;
    timeConsistent: boolean;
    duplicateSuspected: boolean;
    notes: string;
  };
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface HelpDesk {
  id: string; // HD-01
  name: string;
  location: string;
  coords: [number, number];
  operatorsCount: number;
  activeCasesCount: number;
  capacity: number;
  status: 'ACTIVE' | 'OVERLOADED' | 'STANDBY';
  phone: string;
  leadOperator: string;
  zone: string;
}

export interface Volunteer {
  id: string; // V-001
  name: string;
  phone: string;
  coords: [number, number];
  status: 'AVAILABLE' | 'ASSIGNED' | 'RESPONDING' | 'BUSY' | 'OFFLINE';
  assignedIncidentId?: string;
  zone: string;
  skills: string[];
  batteryPct: number;
  lastActive: string;
  assignedDistanceMeters?: number;
}

export interface PolicePost {
  id: string; // PP-01
  name: string;
  location: string;
  coords: [number, number];
  officersCount: number;
  vehicleUnits: number;
  contact: string;
  activeResponses: number;
  inCharge: string;
  status: 'ACTIVE' | 'STANDBY';
}

export interface CCTVCamera {
  id: string; // CAM-01
  name: string;
  zone: string;
  coords: [number, number];
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  personCount: number;
  density: 'NORMAL' | 'HIGH' | 'CRITICAL';
  streamType: 'RGB' | 'THERMAL' | 'ANALYTICS';
  recentDetections: Array<{
    timestamp: string;
    label: string;
    confidence: number;
  }>;
}

export interface CrowdZone {
  id: string; // ZONE-01
  name: string;
  coords: [number, number];
  currentCount: number;
  maxSafeCapacity: number;
  densityLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskColor: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
}

export interface ExitGate {
  id: string; // EXIT-01
  name: string;
  coords: [number, number];
  capacity: number;
  currentCrowd: number;
  entryFlowPerMin: number;
  exitFlowPerMin: number;
  congestionPct: number;
  riskLevel: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  recommendedAction: string;
}

export interface VehicleTrip {
  id: string; // TRIP-2026-809
  vehicleNumber: string; // e.g. MH-31-AZ-4921
  vehicleType: 'SHARED_AUTO' | 'TAXI' | 'E_RICKSHAW';
  driverName: string;
  driverPhone: string;
  passengerName: string;
  passengerPhone: string;
  passengerCount: number;
  startPoint: string;
  destination: string;
  plannedRoute: Array<[number, number]>;
  currentPosition: [number, number];
  routeHistory: Array<[number, number]>;
  isDeviated: boolean;
  deviationDistanceMeters: number;
  status: 'NORMAL' | 'DEVIATED_ALERT' | 'INVESTIGATING' | 'SAFE_COMPLETED';
  startedAt: string;
  estimatedArrival: string;
}

export interface NotificationItem {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLink?: string;
  incidentId?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  targetId: string;
  details: string;
}
