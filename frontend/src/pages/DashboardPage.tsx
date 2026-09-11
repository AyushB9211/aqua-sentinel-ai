import React, { useState } from 'react';
import { HeroSection } from '../components/dashboard/HeroSection';
import { KPIStats } from '../components/dashboard/KPIStats';
import { SonarImageViewer } from '../components/dashboard/SonarImageViewer';
import { RecentDetectionsFeed } from '../components/dashboard/RecentDetectionsFeed';
import { SurveyMapCard } from '../components/dashboard/SurveyMapCard';
import { DetectionsByTypeDonut } from '../components/dashboard/DetectionsByTypeDonut';
import { ConfidenceDistributionBar } from '../components/dashboard/ConfidenceDistributionBar';
import { DetectionDetailsCard } from '../components/dashboard/DetectionDetailsCard';
import { StartMissionModal } from '../components/dashboard/StartMissionModal';
import { DetectionDetailModal } from '../components/dashboard/DetectionDetailModal';
import { RECENT_DETECTIONS, SONAR_VIEWER_OBJECTS } from '../data/mockData';
import { SonarDetection, BoundingBox } from '../types/marine';

export interface DashboardPageProps {
  onNavigate: (routeId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [selectedDetection, setSelectedDetection] = useState<SonarDetection>(RECENT_DETECTIONS[0]);
  const [selectedObjectId, setSelectedObjectId] = useState<string>('box-shipwreck');
  const [isStartMissionOpen, setIsStartMissionOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeModalDetection, setActiveModalDetection] = useState<SonarDetection | null>(null);

  // Sync selection from Sonar Viewer click
  const handleSelectSonarObject = (box: BoundingBox) => {
    setSelectedObjectId(box.id);
    const matched = RECENT_DETECTIONS.find(
      (d) =>
        d.classification.toLowerCase() === box.label.toLowerCase() ||
        box.label.toLowerCase().includes(d.classification.toLowerCase())
    );
    if (matched) {
      setSelectedDetection(matched);
    }
  };

  // Sync selection from Recent Detections click
  const handleSelectDetection = (det: SonarDetection) => {
    setSelectedDetection(det);
    const matchedBox = SONAR_VIEWER_OBJECTS.find(
      (b) =>
        b.label.toLowerCase() === det.classification.toLowerCase() ||
        det.classification.toLowerCase().includes(b.label.toLowerCase())
    );
    if (matchedBox) {
      setSelectedObjectId(matchedBox.id);
    }
  };

  // Sync selection from Survey Map point click
  const handleSelectMapPoint = (detectionId: string) => {
    const matched = RECENT_DETECTIONS.find((d) => d.id === detectionId);
    if (matched) {
      handleSelectDetection(matched);
    }
  };

  const handleMoreInfo = (det: SonarDetection) => {
    setActiveModalDetection(det);
    setIsDetailModalOpen(true);
  };

  const handleAddToReport = (det: SonarDetection) => {
    alert(`Target ${det.trackingId} (${det.classification}) added to Sagar Hydrographic Survey Report.`);
  };

  return (
    <div className="space-y-3 sm:space-y-4 pb-8">
      {/* 1. Hero Section Banner */}
      <HeroSection
        onStartMission={() => onNavigate('sonar-analysis')}
        onViewMissions={() => onNavigate('missions')}
      />

      {/* 2. Compact 5-Card KPI Row */}
      <KPIStats onNavigate={onNavigate} />

      {/* 3. Upper Centerpiece Core Grid: Sonar Image Viewer (7.5 cols) + Recent Detections (4.5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* Sonar Image Viewer (Centerpiece: 7 cols on lg, 8 on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <SonarImageViewer
            selectedObjectId={selectedObjectId}
            onSelectObject={handleSelectSonarObject}
          />
        </div>

        {/* Recent Detections Feed (5 cols on lg, 4 on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <RecentDetectionsFeed
            selectedDetectionId={selectedDetection?.id}
            onSelectDetection={handleSelectDetection}
            onViewAllDetections={() => onNavigate('detections')}
          />
        </div>
      </div>

      {/* 4. Lower Tactical GIS & Analytics Grid: Survey Map + Donut + Bar + Detection Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* Survey Map (4 cols) */}
        <div className="xl:col-span-4 flex flex-col">
          <SurveyMapCard
            onOpenFullMap={() => onNavigate('marine-map')}
            onSelectMapPoint={handleSelectMapPoint}
          />
        </div>

        {/* Detections by Type Donut (3 cols) */}
        <div className="xl:col-span-3 flex flex-col">
          <DetectionsByTypeDonut />
        </div>

        {/* Confidence Distribution Bar (2 cols) */}
        <div className="xl:col-span-2 flex flex-col">
          <ConfidenceDistributionBar />
        </div>

        {/* Detection Details Inspector Card (3 cols) */}
        <div className="xl:col-span-3 flex flex-col">
          <DetectionDetailsCard
            detection={selectedDetection}
            onViewOnMap={() => onNavigate('marine-map')}
            onAddToReport={handleAddToReport}
            onMoreInfo={handleMoreInfo}
          />
        </div>
      </div>

      {/* Dialog Modals */}
      <StartMissionModal
        isOpen={isStartMissionOpen}
        onClose={() => setIsStartMissionOpen(false)}
        onLaunch={() => onNavigate('missions')}
      />

      <DetectionDetailModal
        detection={activeModalDetection}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setActiveModalDetection(null);
        }}
        onVerify={() => {}}
      />
    </div>
  );
};
