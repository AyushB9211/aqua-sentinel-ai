import React, { createContext, useContext, useState } from 'react';
import { SonarDetection, BoundingBox, AnalysisState, SonarScanMetadata, InferenceDebugInfo } from '../types/marine';
import { analyzeSonarFile, DETECTOR_PROCESSING_STAGES } from '../services/sonarDetectorService';

export interface DemoContextType {
  uploadedFile: File | null;
  analysisState: AnalysisState;
  processingProgress: number;
  processingStageText: string;
  scanMetadata: SonarScanMetadata;
  detections: SonarDetection[];
  boundingBoxes: BoundingBox[];
  debugInfo: InferenceDebugInfo | null;
  selectedDetectionId: string | null;
  selectedDetection: SonarDetection | null;
  runAnalysis: () => void;
  resetAnalysis: () => void;
  loadUploadedFile: (metadata: SonarScanMetadata, file?: File) => void;
  selectDetection: (id: string) => void;
  toggleVerifyDetection: (id: string) => void;
}

const DEFAULT_READY_METADATA: SonarScanMetadata = {
  id: 'scan-ready-001',
  scanId: 'SSS-READY',
  mediaType: 'procedural',
  surveyCode: 'MS-0048',
  vessel: 'RV Samudra Nidhi',
  waterDepth: 142.6,
  sonarFrequencyKhz: 900,
  rangeMeters: 150,
  resolution: '1920 × 1080 px',
  fileSizeMb: 14.8,
  dateCreated: '21 May 2025, 10:24 AM',
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStageText, setProcessingStageText] = useState(DETECTOR_PROCESSING_STAGES[0]);
  const [scanMetadata, setScanMetadata] = useState<SonarScanMetadata>(DEFAULT_READY_METADATA);
  const [detections, setDetections] = useState<SonarDetection[]>([]);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [debugInfo, setDebugInfo] = useState<InferenceDebugInfo | null>(null);
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null);

  const selectedDetection =
    detections.find((d) => d.id === selectedDetectionId) || (detections.length > 0 ? detections[0] : null);

  const runAnalysis = async () => {
    setAnalysisState('processing');
    setProcessingProgress(0);
    setProcessingStageText(DETECTOR_PROCESSING_STAGES[0]);
    setSelectedDetectionId(null);

    try {
      // Call the clean detector service passing the user's actual uploaded file
      const response = await analyzeSonarFile(
        uploadedFile,
        scanMetadata,
        (progress, stageText) => {
          setProcessingProgress(progress);
          setProcessingStageText(stageText);
        }
      );

      setDetections(response.detections);
      setBoundingBoxes(response.boundingBoxes);
      setDebugInfo(response.debugInfo || null);
      setAnalysisState('complete');
      setSelectedDetectionId(response.detections[0]?.id || null);
    } catch (err) {
      console.error('Detection error:', err);
      setAnalysisState('idle');
    }
  };

  const resetAnalysis = () => {
    if (scanMetadata.imageUrl && scanMetadata.imageUrl.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(scanMetadata.imageUrl);
      } catch (e) {
        // ignore
      }
    }
    setUploadedFile(null);
    setScanMetadata(DEFAULT_READY_METADATA);
    setAnalysisState('idle');
    setProcessingProgress(0);
    setDetections([]);
    setBoundingBoxes([]);
    setDebugInfo(null);
    setSelectedDetectionId(null);
  };

  const loadUploadedFile = (newMeta: SonarScanMetadata, file?: File) => {
    if (file) {
      setUploadedFile(file);
    }
    setScanMetadata(newMeta);
    setAnalysisState('idle');
    setProcessingProgress(0);
    setDetections([]);
    setBoundingBoxes([]);
    setDebugInfo(null);
    setSelectedDetectionId(null);
  };

  const selectDetection = (id: string) => {
    setSelectedDetectionId(id);
  };

  const toggleVerifyDetection = (id: string) => {
    setDetections((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              isVerified: !d.isVerified,
              processingStatus: !d.isVerified ? 'Verified' : 'AI Analyzed',
            }
          : d
      )
    );
  };

  return (
    <DemoContext.Provider
      value={{
        uploadedFile,
        analysisState,
        processingProgress,
        processingStageText,
        scanMetadata,
        detections,
        boundingBoxes,
        debugInfo,
        selectedDetectionId,
        selectedDetection,
        runAnalysis,
        resetAnalysis,
        loadUploadedFile,
        selectDetection,
        toggleVerifyDetection,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = (): DemoContextType => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
