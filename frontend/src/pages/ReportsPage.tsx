import React from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Ship,
  ShieldCheck,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ACTIVE_MISSION, RECENT_DETECTIONS } from '../data/mockData';
import { exportReportAsCsv, exportReportAsJson } from '../utils/exportUtils';

export const ReportsPage: React.FC = () => {
  const reports = [
    {
      id: 'NIOT-REP-26057-048',
      title: 'Mission MS-0048 Interim Hydrographic Survey Report',
      date: '10 May 2025',
      type: 'Benthic Debris Assessment',
      status: 'Verified (MoES NIOT)',
      pages: '18 Pages',
      fileSize: '4.2 MB',
    },
    {
      id: 'NIOT-REP-26057-047',
      title: 'Gulf of Mannar Deepwater Ghost Net Hazard Report',
      date: '02 May 2025',
      type: 'ROV Intervention Plan',
      status: 'Archived',
      pages: '24 Pages',
      fileSize: '6.8 MB',
    },
    {
      id: 'NIOT-REP-26057-046',
      title: 'Palk Strait Sonar Anomaly & Wreckage GeoJSON Archive',
      date: '24 Apr 2025',
      type: 'PostGIS Dataset Report',
      status: 'Synced',
      pages: '12 Pages',
      fileSize: '2.9 MB',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg bg-marine-900/90 border border-cyan-500/30 backdrop-blur-md corner-brackets">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
              OFFICIAL HYDROGRAPHIC REPORTS
            </span>
            <span className="text-xs font-mono text-slate-400">MoES / NIOT SAGAR PROTOCOL</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
            Survey Mission Reports & Compliance Logs
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Printer}
          onClick={() => alert('Generating formal MoES/NIOT survey report PDF...')}
        >
          Generate Official Report
        </Button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((rep) => (
          <Card key={rep.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4" cornerBrackets>
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded bg-marine-850 border border-marine-750 text-cyan-400 shrink-0 mt-0.5">
                <FileText size={22} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-300">{rep.id}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    {rep.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white font-mono">{rep.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                  <span>Type: {rep.type}</span>
                  <span>Date: {rep.date}</span>
                  <span>Size: {rep.fileSize}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={() => exportReportAsCsv(RECENT_DETECTIONS)}
              >
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Download}
                onClick={() =>
                  exportReportAsJson(
                    {
                      id: rep.id,
                      scanId: rep.id,
                      fileName: `${rep.id}_Survey_Report.png`,
                      imageUrl: '',
                      surveyCode: 'MS-0048',
                      vessel: 'ORV Sagar Nidhi',
                      waterDepth: 142.6,
                      sonarFrequencyKhz: 900,
                      rangeMeters: 150,
                      resolution: '1920x1080',
                    },
                    RECENT_DETECTIONS
                  )
                }
              >
                Export JSON
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
