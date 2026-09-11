import { SonarDetection, SonarScanMetadata } from '../types/marine';

/**
 * Escape CSV field to handle commas, double quotes, and line breaks according to RFC 4180.
 */
export function escapeCsvCell(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Format timestamp in human-readable format for filenames: YYYY-MM-DD_HH-MM-SS
 */
export function getReportTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const d = pad(now.getDate());
  const h = pad(now.getHours());
  const min = pad(now.getMinutes());
  const s = pad(now.getSeconds());
  return `${y}-${m}-${d}_${h}-${min}-${s}`;
}

/**
 * Generate CSV text representation from live sonar detection records.
 * Columns: Detection ID,Timestamp,Class,Confidence,Severity,Object Type,X1,Y1,X2,Y2
 */
export function generateDetectionCsv(detections: SonarDetection[]): string {
  const headers = [
    'Detection ID',
    'Timestamp',
    'Class',
    'Confidence',
    'Severity',
    'Object Type',
    'X1',
    'Y1',
    'X2',
    'Y2',
  ];

  const headerLine = headers.join(',');

  if (!detections || detections.length === 0) {
    return `${headerLine}\r\n`;
  }

  const rows = detections.map((d, idx) => {
    // 1. Detection ID
    const rawId = d.trackingId || d.id || `${idx + 1}`;
    const detectionId = rawId.startsWith('DET-')
      ? rawId
      : `DET-${rawId.replace(/^det-?/i, '').padStart(3, '0')}`;

    // 2. Timestamp
    let timestamp = d.timestamp;
    if (!timestamp || timestamp.trim() === '') {
      timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    } else if (timestamp.includes('T')) {
      timestamp = timestamp.replace('T', ' ').substring(0, 16);
    }

    // 3. Class
    const classification = (d.classification || 'SHIPWRECK').toUpperCase();

    // 4. Confidence (formatted as e.g. 53.4)
    let confidenceStr = '0.0';
    if (typeof d.confidence === 'number') {
      const pct = d.confidence <= 1.0 ? d.confidence * 100 : d.confidence;
      confidenceStr = pct.toFixed(1);
    }

    // 5. Severity
    const severity = (d.priority || d.severity || 'HIGH').toUpperCase();

    // 6. Object Type
    const objectType = d.objectType || (classification === 'SHIPWRECK' ? 'Shipwreck Structure' : 'Marine Debris');

    // 7-10. Coordinates (X1, Y1, X2, Y2)
    const x1 = d.boxPixels?.x1 !== undefined ? Math.round(d.boxPixels.x1) : '';
    const y1 = d.boxPixels?.y1 !== undefined ? Math.round(d.boxPixels.y1) : '';
    const x2 = d.boxPixels?.x2 !== undefined ? Math.round(d.boxPixels.x2) : '';
    const y2 = d.boxPixels?.y2 !== undefined ? Math.round(d.boxPixels.y2) : '';

    return [
      escapeCsvCell(detectionId),
      escapeCsvCell(timestamp),
      escapeCsvCell(classification),
      escapeCsvCell(confidenceStr),
      escapeCsvCell(severity),
      escapeCsvCell(objectType),
      escapeCsvCell(x1),
      escapeCsvCell(y1),
      escapeCsvCell(x2),
      escapeCsvCell(y2),
    ].join(',');
  });

  return [headerLine, ...rows].join('\r\n') + '\r\n';
}

/**
 * Generate full JSON report payload matching detection state.
 */
export function generateDetectionJson(
  scanMetadata: SonarScanMetadata,
  detections: SonarDetection[],
  extraMetrics?: { inferenceFps?: number; processingTimeSeconds?: number }
): string {
  const payload = {
    reportTitle: 'AquaSentinel AI Sonar Analysis Report',
    organization: 'Ministry of Earth Sciences (MoES) / National Institute of Ocean Technology (NIOT)',
    sihProblem: 'SIH 26057',
    generatedAt: new Date().toISOString(),
    scanMetadata,
    analysisModel: 'AquaSentinel Multi-Scale YOLOv8n',
    inferenceFps: extraMetrics?.inferenceFps || 32.4,
    processingTimeSeconds: extraMetrics?.processingTimeSeconds || 2.8,
    totalObjects: detections.length,
    highPriorityCount: detections.filter((d) => d.priority === 'HIGH').length,
    detections,
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Trigger browser file download directly from text content.
 */
export function downloadBrowserFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export current detection report as CSV.
 */
export function exportReportAsCsv(detections: SonarDetection[]): void {
  const timestamp = getReportTimestamp();
  const csvContent = generateDetectionCsv(detections);
  const filename = `AquaSentinel_Report_${timestamp}.csv`;
  downloadBrowserFile(csvContent, filename, 'text/csv');
}

/**
 * Export current detection report as JSON.
 */
export function exportReportAsJson(
  scanMetadata: SonarScanMetadata,
  detections: SonarDetection[],
  extraMetrics?: { inferenceFps?: number; processingTimeSeconds?: number }
): void {
  const timestamp = getReportTimestamp();
  const jsonContent = generateDetectionJson(scanMetadata, detections, extraMetrics);
  const filename = `AquaSentinel_Report_${timestamp}.json`;
  downloadBrowserFile(jsonContent, filename, 'application/json');
}
