import React, { useState } from 'react';
import {
  AlertOctagon,
  Search,
  Filter,
  Download,
  Eye,
  Sliders,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dropdown } from '../components/ui/Dropdown';
import { Tabs } from '../components/ui/Tabs';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ConfidenceMeter } from '../components/marine/ConfidenceMeter';
import { Table, Column } from '../components/ui/Table';
import { DetectionDetailModal } from '../components/dashboard/DetectionDetailModal';
import { RECENT_DETECTIONS } from '../data/mockData';
import { SonarDetection, SeverityLevel } from '../types/marine';
import { formatCoordinatesDec } from '../utils/formatters';

export const DetectionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSeverityTab, setActiveSeverityTab] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [selectedDetection, setSelectedDetection] = useState<SonarDetection | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filtered detections
  const filteredDetections = RECENT_DETECTIONS.filter((det) => {
    // Search matching
    const matchesSearch =
      det.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      det.classification.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (det.notes && det.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    // Severity tab matching
    const matchesSeverity =
      activeSeverityTab === 'all' ? true : det.severity === activeSeverityTab;

    // Classification dropdown matching
    const matchesClass =
      classFilter === 'all' ? true : det.classification.toLowerCase().includes(classFilter);

    return matchesSearch && matchesSeverity && matchesClass;
  });

  const columns: Column<SonarDetection>[] = [
    {
      key: 'trackingId',
      header: 'Tracking ID',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-bold text-cyan-300">{item.trackingId}</span>
      ),
    },
    {
      key: 'classification',
      header: 'Classification',
      sortable: true,
      render: (item) => (
        <div>
          <div className="font-bold text-white font-mono">{item.classification}</div>
          <div className="text-[10px] text-slate-400 font-mono">
            Shadow: {item.acousticShadowLength}m • {item.sonarFrequency} kHz
          </div>
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      render: (item) => <StatusBadge status={item.severity} size="sm" />,
    },
    {
      key: 'confidence',
      header: 'AI Confidence',
      sortable: true,
      render: (item) => (
        <div className="w-28">
          <ConfidenceMeter confidence={item.confidence} showLabel={false} size="sm" />
          <div className="text-[10px] font-mono text-right text-slate-400 mt-0.5">
            {(item.confidence * 100).toFixed(1)}%
          </div>
        </div>
      ),
    },
    {
      key: 'depth',
      header: 'Depth & Altitude',
      render: (item) => (
        <div className="font-mono text-xs">
          <div className="text-white font-bold">-{item.waterDepth.toFixed(1)} m</div>
          <div className="text-[10px] text-slate-400">Alt: {item.altitude.toFixed(1)}m</div>
        </div>
      ),
    },
    {
      key: 'coordinates',
      header: 'Coordinates',
      render: (item) => (
        <div className="font-mono text-xs text-slate-300">
          {formatCoordinatesDec(item.latitude, item.longitude, 4)}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) => (
        <Button
          variant="ghost"
          size="xs"
          icon={Eye}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDetection(item);
            setIsDetailModalOpen(true);
          }}
        >
          Inspect
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg bg-marine-900/90 border border-cyan-500/30 backdrop-blur-md corner-brackets">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
              DETECTION DATABASE
            </span>
            <span className="text-xs font-mono text-slate-400">87 TOTAL RECORDED</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
            Marine Debris & Sonar Anomaly Detections
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={() => alert('Exporting georeferenced detection dataset to CSV...')}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 space-y-4" cornerBrackets>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by ID, class, coordinates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />

          <Dropdown
            options={[
              { value: 'all', label: 'All Classifications' },
              { value: 'gear', label: 'Fishing Gear / Nets', badge: '14' },
              { value: 'unknown', label: 'Unknown Objects', badge: '6' },
              { value: 'rope', label: 'Ropes / Netting', badge: '11' },
              { value: 'plastic', label: 'Plastic Debris', badge: '23' },
            ]}
            value={classFilter}
            onChange={(val) => setClassFilter(val)}
          />

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">STATUS:</span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/30">
              POSTGIS SYNCED
            </span>
          </div>
        </div>

        {/* Severity Tabs */}
        <div className="pt-2 border-t border-marine-800">
          <Tabs
            variant="pills"
            size="sm"
            tabs={[
              { id: 'all', label: 'All Detections', badge: 87 },
              { id: 'high', label: 'High Severity', badge: 8 },
              { id: 'anomaly', label: 'Unknown Anomalies', badge: 14 },
              { id: 'medium', label: 'Medium Severity', badge: 42 },
              { id: 'low', label: 'Low Severity', badge: 23 },
            ]}
            activeTab={activeSeverityTab}
            onChange={(id) => setActiveSeverityTab(id)}
          />
        </div>
      </Card>

      {/* Detections Data Table */}
      <Table
        columns={columns}
        data={filteredDetections}
        keyExtractor={(item) => item.id}
        pageSize={6}
        onRowClick={(item) => {
          setSelectedDetection(item);
          setIsDetailModalOpen(true);
        }}
      />

      {/* Detail Inspection Modal */}
      <DetectionDetailModal
        detection={selectedDetection}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onVerify={(id) => alert(`Target ${id} verified and updated in database.`)}
      />
    </div>
  );
};
