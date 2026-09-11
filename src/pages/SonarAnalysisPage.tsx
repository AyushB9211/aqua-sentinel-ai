import React, { useState } from 'react';
import { Play, RotateCcw, Upload, Scan, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ScanInfoBar } from '../components/sonar/ScanInfoBar';
import { SonarAnalysisViewer } from '../components/sonar/SonarAnalysisViewer';
import { AIAnalysisPanel } from '../components/sonar/AIAnalysisPanel';
import { AnalysisResultBar } from '../components/sonar/AnalysisResultBar';
import { ImportScanModal } from '../components/sonar/ImportScanModal';
import { useDemo } from '../context/DemoContext';
import { SonarDetection } from '../types/marine';
import { exportReportAsCsv, exportReportAsJson } from '../utils/exportUtils';

export interface SonarAnalysisPageProps {
  onNavigate?: (routeId: string) => void;
}

export const SonarAnalysisPage: React.FC<SonarAnalysisPageProps> = ({ onNavigate }) => {
  const {
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
  } = useDemo();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleExportJson = () => {
    exportReportAsJson(scanMetadata, detections, {
      inferenceFps: 32.4,
      processingTimeSeconds: 2.8,
    });
  };

  const handleExportCsv = () => {
    exportReportAsCsv(detections);
  };

  const handleViewOnMap = (det: SonarDetection) => {
    selectDetection(det.id);
    onNavigate?.('marine-map');
  };

  const handleAddToReport = (det: SonarDetection) => {
    alert(`Target ${det.trackingId} (${det.classification}) successfully queued for Sagar Hydrographic Survey Report.`);
    onNavigate?.('reports');
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Page Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-lg bg-marine-900/90 border border-cyan-500/30 backdrop-blur-md corner-brackets select-none">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
              SONAR ANALYSIS
            </span>
            <span className="text-xs font-mono text-slate-400">SIH 26057 • AI INFERENCE WORKSPACE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
            Side-Scan Sonar Imagery AI Analysis
          </h1>
          <p className="text-xs text-slate-300 mt-0.5 font-normal">
            Analyze Side-Scan Sonar imagery or video using SeaSentinel AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="primary"
            size="sm"
            icon={Play}
            onClick={runAnalysis}
            disabled={analysisState === 'processing'}
            className="shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            {analysisState === 'complete' ? 'Re-run Analysis' : 'RUN AI ANALYSIS'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            onClick={resetAnalysis}
            disabled={analysisState === 'processing'}
          >
            RESET
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Upload}
            onClick={() => setIsImportModalOpen(true)}
          >
            Import Scan
          </Button>
        </div>
      </div>

      {/* 2. Compact Scan Telemetry Information Bar */}
      <ScanInfoBar metadata={scanMetadata} />

      {/* 3. 2-Column Core Analysis Workspace: Sonar Viewer (65-70%) + AI Analysis Panel (30-35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Sonar Image/Video Viewer (8 cols on lg/xl) */}
        <div className="lg:col-span-8 flex flex-col">
          <SonarAnalysisViewer
            scanId={scanMetadata.scanId}
            imageUrl={scanMetadata.imageUrl}
            mediaType={scanMetadata.mediaType}
            analysisState={analysisState}
            boundingBoxes={boundingBoxes}
            selectedDetectionId={selectedDetectionId}
            onSelectDetection={selectDetection}
          />
        </div>

        {/* Right: AI Analysis Panel (4 cols on lg/xl) */}
        <div className="lg:col-span-4 flex flex-col">
          <AIAnalysisPanel
            analysisState={analysisState}
            processingProgress={processingProgress}
            processingStageText={processingStageText}
            detections={detections}
            debugInfo={debugInfo}
            selectedDetection={selectedDetection}
            onSelectDetection={(det) => selectDetection(det.id)}
            onRunAnalysis={runAnalysis}
            onImportScan={() => setIsImportModalOpen(true)}
            onResetAnalysis={resetAnalysis}
            onMarkVerified={toggleVerifyDetection}
            onViewOnMap={handleViewOnMap}
            onAddToReport={handleAddToReport}
          />
        </div>
      </div>

      {/* 4. Bottom Result Bar (Rendered when complete) */}
      {analysisState === 'complete' && (
        <AnalysisResultBar
          detections={detections}
          onReRunAnalysis={runAnalysis}
          onExportResults={handleExportJson}
          onExportCsv={handleExportCsv}
        />
      )}

      {/* 5. Import Scan Modal */}
      <ImportScanModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onLoadScan={(newMeta, file) => loadUploadedFile(newMeta, file)}
      />
    </div>
  );
};
