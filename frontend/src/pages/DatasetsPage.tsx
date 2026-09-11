import React from 'react';
import { Database, Download, HardDrive, FileText, Layers, RefreshCw, Sparkles, Filter } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const DatasetsPage: React.FC = () => {
  const datasets = [
    {
      id: 'DS-26057-ARABIAN-01',
      title: 'Arabian Sea Sector 4 Side-Scan Sonar Raw & Annotated Dataset',
      size: '4.8 GB',
      scans: '1,248 GeoTIFF / JSF Files',
      targets: '243 Verified Debris Targets',
      format: 'EdgeTech JSF / PostGIS GeoJSON',
      lastUpdated: '21 May 2025',
    },
    {
      id: 'DS-26057-MANNAR-02',
      title: 'Gulf of Mannar Coral Reef Benthic Debris Corpus',
      size: '2.4 GB',
      scans: '640 Sonar Swath Strips',
      targets: '118 Ghost Nets & Plastic Debris',
      format: 'GeoTIFF / Pascal VOC / COCO',
      lastUpdated: '02 May 2025',
    },
    {
      id: 'DS-26057-ANOMALY-03',
      title: 'MoES Synthetic & Field Sonar Anomaly Validation Benchmark',
      size: '1.2 GB',
      scans: '320 Acoustic Anomaly Crops',
      targets: '48 Geometric & Pipeline Anomalies',
      format: 'HDF5 / Numpy Array / GeoJSON',
      lastUpdated: '24 Apr 2025',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-lg bg-marine-900/90 border border-cyan-500/30 backdrop-blur-md corner-brackets">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
              DATASET REPOSITORY
            </span>
            <span className="text-xs font-mono text-slate-400">8.4 GB TOTAL ARCHIVE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
            Side-Scan Sonar Datasets & Hydrographic Corpus
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => alert('Synced dataset catalog with NIOT Cloud.')}>
            Sync Datasets
          </Button>
        </div>
      </div>

      {/* Dataset Cards Grid */}
      <div className="space-y-4">
        {datasets.map((ds) => (
          <Card key={ds.id} className="p-4 sm:p-5 space-y-3 bg-marine-900/90 border-marine-800" cornerBrackets>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-marine-800/80 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-marine-850 border border-marine-750 text-cyan-400">
                  <Database size={18} />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-300">{ds.id}</span>
                  <h3 className="text-sm sm:text-base font-bold text-white font-mono">{ds.title}</h3>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-500/40 shrink-0">
                {ds.size}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300">
              <div className="p-2 rounded bg-marine-950 border border-marine-800/80">
                <span className="text-slate-400 text-[10px]">SCANS & SWATHS</span>
                <div className="text-white font-semibold mt-0.5">{ds.scans}</div>
              </div>

              <div className="p-2 rounded bg-marine-950 border border-marine-800/80">
                <span className="text-slate-400 text-[10px]">ANNOTATED TARGETS</span>
                <div className="text-cyan-300 font-semibold mt-0.5">{ds.targets}</div>
              </div>

              <div className="p-2 rounded bg-marine-950 border border-marine-800/80">
                <span className="text-slate-400 text-[10px]">DATA FORMAT</span>
                <div className="text-teal-300 font-semibold mt-0.5">{ds.format}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-mono text-slate-400">Last updated: {ds.lastUpdated}</span>
              <Button variant="outline" size="xs" icon={Download} onClick={() => alert(`Downloading ${ds.id} dataset bundle...`)}>
                Download GeoPackage (ZIP)
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
