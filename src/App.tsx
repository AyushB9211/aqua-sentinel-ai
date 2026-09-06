import React, { useState, useCallback } from 'react';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { SonarAnalysisPage } from './pages/SonarAnalysisPage';
import { DetectionsPage } from './pages/DetectionsPage';
import { MissionsPage } from './pages/MissionsPage';
import { MarineMapPage } from './pages/MarineMapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { ModelsPage } from './pages/ModelsPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';
import { DesignSystemPreview } from './pages/DesignSystemPreview';
import { LaunchScreen } from './components/launch/LaunchScreen';
import { DemoProvider } from './context/DemoContext';
import { BreadcrumbItem } from './types/navigation';
import { CURRENT_TELEMETRY, ACTIVE_MISSION } from './data/mockData';

export function App() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('dashboard');

  const handleLaunchComplete = useCallback(() => {
    setIsLaunched(true);
  }, []);

  const getBreadcrumbs = (route: string): BreadcrumbItem[] => {
    switch (route) {
      case 'dashboard':
        return [
          { label: 'SeaSentinel AI' },
          { label: 'Operational Dashboard', active: true },
        ];
      case 'missions':
        return [
          { label: 'SeaSentinel AI' },
          { label: 'Survey Missions', active: true },
        ];
      case 'sonar-analysis':
        return [
          { label: 'SeaSentinel AI' },
          { label: 'Sonar Analysis Deck', active: true },
        ];
      case 'detections':
        return [
          { label: 'SeaSentinel AI' },
          { label: 'Detections & Anomaly Pool', active: true },
        ];
      case 'marine-map':
        return [
          { label: 'SeaSentinel AI' },
          { label: 'Bathymetric & GIS Map', active: true },
        ];
      case 'analytics':
        return [
          { label: 'SeaSentinel AI' },
          { label: 'Oceanographic AI Analytics', active: true },
        ];
      case 'reports':
        return [
          { label: 'SeaSentinel AI' },
          { label: 'Survey Mission Reports', active: true },
        ];
      case 'datasets':
        return [
          { label: 'SeaSentinel AI' },
          { label: 'Hydrographic Datasets', active: true },
        ];
      case 'models':
        return [
          { label: 'SeaSentinel AI' },
          { label: 'AI Inference Models', active: true },
        ];
      case 'alerts':
        return [
          { label: 'SeaSentinel AI' },
          { label: 'Benthic Hazard Alerts', active: true },
        ];
      case 'settings':
        return [
          { label: 'SeaSentinel AI' },
          { label: 'System Parameters', active: true },
        ];
      case 'preview':
        return [
          { label: 'SeaSentinel AI' },
          { label: 'Design System & Component Kit', active: true },
        ];
      default:
        return [{ label: route, active: true }];
    }
  };

  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentRoute} />;
      case 'missions':
        return <MissionsPage />;
      case 'sonar-analysis':
        return <SonarAnalysisPage onNavigate={setCurrentRoute} />;
      case 'detections':
        return <DetectionsPage />;
      case 'marine-map':
        return <MarineMapPage onNavigate={setCurrentRoute} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'datasets':
        return <DatasetsPage />;
      case 'models':
        return <ModelsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'preview':
        return <DesignSystemPreview />;
      default:
        return <DashboardPage onNavigate={setCurrentRoute} />;
    }
  };

  return (
    <DemoProvider>
      {/* 1. Official SeaSentinel AI Launch / Splash Screen (Unmounted once completed) */}
      {!isLaunched && (
        <LaunchScreen
          durationMs={3000}
          onComplete={handleLaunchComplete}
        />
      )}

      {/* 2. Main Application Shell */}
      <AppShell
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        breadcrumbs={getBreadcrumbs(currentRoute)}
        telemetry={CURRENT_TELEMETRY}
        mission={ACTIVE_MISSION}
        onReplayLaunch={() => setIsLaunched(false)}
      >
        {renderCurrentView()}
      </AppShell>
    </DemoProvider>
  );
}

export default App;
