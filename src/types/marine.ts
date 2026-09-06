export type SeverityLevel = 'low' | 'medium' | 'high' | 'anomaly' | 'ai';

export type MissionStatus = 'active' | 'standby' | 'processing' | 'completed' | 'aborted' | 'in_progress';

export type AnalysisState = 'idle' | 'processing' | 'complete';

export type DebrisClassification =
  | 'Shipwreck'
  | 'Debris Net'
  | 'Pipe'
  | 'Cylinder'
  | 'Other Debris'
  | 'Unknown Anomaly'
  | 'Fishing Gear'
  | 'Ghost Fishing Net'
  | 'Rope / Net'
  | 'Plastic Debris'
  | 'Metallic Container'
  | 'Metal Object'
  | 'Sunken Vessel Section'
  | 'Discarded Tire / Rubber Cluster'
  | 'Submerged Pipeline Obstruction'
  | 'Plastic / Polymeric Debris Pile'
  | 'Unknown Object'
  | 'Unidentified Cylindrical Anomaly'
  | 'Biological / Coral Form'
  | 'Geological Rock Outcrop'
  | 'Unknown';

export interface BoundingBox {
  id: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage
  height: number; // percentage
  label: string;
  severity: SeverityLevel;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW' | 'ANOMALY';
  confidence: number;
  shadowLength: number;
  depth?: number;
}

export interface SonarEvidence {
  acousticReturn: string;
  acousticShadow: string;
  objectGeometry: string;
  sonarContrast: string;
}

export interface SonarDetection {
  id: string;
  trackingId: string; // e.g., "DET-2026-0842"
  surveyId?: string; // e.g., "SSS_2025_05_21_001"
  dateString?: string; // e.g., "21 May 2025"
  timestamp: string;
  timeString?: string;
  missionId: string;
  classification: string;
  severity: SeverityLevel;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'ANOMALY';
  confidence: number; // 0.00 to 1.00
  latitude: number;
  longitude: number;
  waterDepth: number; // meters
  altitude: number; // towfish altitude in meters
  acousticShadowLength: number; // meters
  regionText?: string; // e.g. "Right sonar swath", "Center-left"
  objectType?: string; // e.g. "Shipwreck", "Marine Debris"
  evidence?: SonarEvidence;
  evidenceChecklist?: string[];
  estimatedDimensions: {
    length: number;
    width: number;
    height: number;
  };
  sonarFrequency: number; // kHz
  processingStatus: 'AI Analyzed' | 'Pending Review' | 'Verified' | 'Flagged Anomaly' | 'Requires Verification';
  isVerified?: boolean;
  thumbnailUrl?: string;
  notes?: string;
}

export interface InferenceDebugInfo {
  fullImageDetections: number;
  tilesScanned: number;
  tileDetections: number;
  finalDetections: number;
  confidenceThreshold: number;
  inferenceEngine?: string;
}

export interface SonarScanMetadata {
  id: string;
  scanId: string; // e.g. "SSS_2025_05_21_001"
  fileName?: string; // e.g. "20260903_222603.mp4"
  imageUrl?: string; // Local Object URL (image or video)
  mediaType?: 'image' | 'video' | 'procedural';
  durationSeconds?: number;
  surveyCode: string; // e.g. "MS-0048"
  vessel: string; // e.g. "RV Samudra Nidhi"
  waterDepth: number; // -142.6 m
  sonarFrequencyKhz: number; // 900 kHz
  rangeMeters: number; // 150 m
  resolution: string; // "1920 × 1080"
  fileSizeMb?: number;
  dateCreated?: string;
}

export interface SurveyMission {
  id: string;
  code: string; // e.g. "MS-0048"
  name: string;
  vessel: string; // e.g., "RV Samudra Nidhi"
  operator: string;
  location: string;
  areaCoverageSqKm: number;
  status: MissionStatus;
  startTime: string;
  elapsedTime: string;
  endTime?: string;
  coveragePercentage: number;
  totalPings: number;
  detectionsCount: number;
  anomaliesCount: number;
  averageDepth: number;
  swathWidth: number; // meters
  towSpeedKnots: number;
}

export interface WeatherCondition {
  temperatureC: number;
  condition: string;
  windSpeedKnots: number;
  windDirection?: string;
  seaState: 'Calm' | 'Moderate' | 'Rough' | 'Very Rough';
  visibility: 'High' | 'Moderate' | 'Low';
  waveHeightMeters: number;
  waterSurfaceTempC: number;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  timeString: string;
  title: string;
  description?: string;
  severity?: SeverityLevel;
  type: 'detection' | 'anomaly' | 'model' | 'calibration' | 'coverage' | 'system';
}

export interface DetectionActivityDataPoint {
  hour: string; // e.g., "00:00", "04:00"
  debris: number;
  anomalies: number;
  highSeverity: number;
}

export interface DebrisTypeStat {
  category: DebrisClassification;
  count: number;
  percentage: number;
  color: string;
}

export interface ConfidenceBucket {
  range: string; // e.g. "0-20%", "20-40%"
  count: number;
  percentage: number;
}

export interface SurveyMapPoint {
  id: string;
  x: number; // percentage on map
  y: number; // percentage on map
  label: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'NORMAL';
  confidence: number;
  detectionId: string;
}

export interface TelemetryState {
  vesselName: string;
  gpsCoordinates: {
    lat: number;
    lon: number;
    displayString?: string;
  };
  towfishDepth: number;
  altitudeAboveSeafloor: number;
  waterTemperature: number; // deg C
  sonarPingRate: number; // Hz
  activeFrequencyKhz: number;
  swathRange: number; // meters per channel
  vesselSpeedKnots: number;
  headingDegrees: number;
  headingText?: string;
  aiInferenceFps: number;
  storageUsedGb: number;
  storageTotalGb: number;
  systemHealth: 'Operational' | 'Degraded' | 'Critical';
  connectionStatus: 'Connected' | 'Standby' | 'Disconnected';
}
