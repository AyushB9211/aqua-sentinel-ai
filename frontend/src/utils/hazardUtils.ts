/**
 * Marine Hazard Classification Styling and Mapping
 * SeaSentinel AI - SIH 26057
 *
 * Provides synchronized color palettes, labels, and badges across
 * SonarAnalysisViewer, AIAnalysisPanel, and export utilities.
 */

export interface HazardClassStyle {
  id: number;
  name: string;
  label: string;
  shortLabel: string;
  stroke: string;
  fill: string;
  fillHover: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const HAZARD_STYLES: Record<string, HazardClassStyle> = {
  SHIPWRECK: {
    id: 2,
    name: 'shipwreck',
    label: 'Shipwreck',
    shortLabel: 'SHIPWRECK',
    stroke: '#ef4444',
    fill: 'rgba(239, 68, 68, 0.12)',
    fillHover: 'rgba(239, 68, 68, 0.28)',
    badgeBg: 'bg-red-950/80',
    badgeText: 'text-red-400',
    badgeBorder: 'border-red-500/60',
  },
  SUBMARINE_PIPELINE: {
    id: 1,
    name: 'submarine_pipeline',
    label: 'Submarine Pipeline',
    shortLabel: 'PIPELINE',
    stroke: '#06b6d4',
    fill: 'rgba(6, 182, 212, 0.12)',
    fillHover: 'rgba(6, 182, 212, 0.28)',
    badgeBg: 'bg-cyan-950/80',
    badgeText: 'text-cyan-400',
    badgeBorder: 'border-cyan-500/60',
  },
  GHOST_NET: {
    id: 3,
    name: 'ghost_net',
    label: 'Ghost Net',
    shortLabel: 'GHOST NET',
    stroke: '#10b981',
    fill: 'rgba(16, 185, 129, 0.12)',
    fillHover: 'rgba(16, 185, 129, 0.28)',
    badgeBg: 'bg-emerald-950/80',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/60',
  },
  MINE_CYLINDER: {
    id: 4,
    name: 'mine_cylinder',
    label: 'Mine Cylinder',
    shortLabel: 'MINE CYLINDER',
    stroke: '#d946ef',
    fill: 'rgba(217, 70, 239, 0.12)',
    fillHover: 'rgba(217, 70, 239, 0.28)',
    badgeBg: 'bg-fuchsia-950/80',
    badgeText: 'text-fuchsia-400',
    badgeBorder: 'border-fuchsia-500/60',
  },
  CRAB_POT: {
    id: 0,
    name: 'crab_pot',
    label: 'Crab Pot',
    shortLabel: 'CRAB POT',
    stroke: '#f97316',
    fill: 'rgba(249, 115, 22, 0.12)',
    fillHover: 'rgba(249, 115, 22, 0.28)',
    badgeBg: 'bg-orange-950/80',
    badgeText: 'text-orange-400',
    badgeBorder: 'border-orange-500/60',
  },
  ANOMALY: {
    id: -1,
    name: 'anomaly',
    label: 'Acoustic Anomaly',
    shortLabel: 'ANOMALY',
    stroke: '#94a3b8',
    fill: 'rgba(148, 163, 184, 0.12)',
    fillHover: 'rgba(148, 163, 184, 0.28)',
    badgeBg: 'bg-slate-900/80',
    badgeText: 'text-slate-300',
    badgeBorder: 'border-slate-600/60',
  },
};

/**
 * Resolve styling properties for a given classification or class ID.
 * Defaults to ANOMALY (Slate Gray) if unspecified or unrecognized.
 * Never defaults to SHIPWRECK silently.
 */
export function getHazardStyle(classification?: string, classId?: number): HazardClassStyle {
  if (classId !== undefined && classId !== null) {
    switch (classId) {
      case 0:
        return HAZARD_STYLES.CRAB_POT;
      case 1:
        return HAZARD_STYLES.SUBMARINE_PIPELINE;
      case 2:
        return HAZARD_STYLES.SHIPWRECK;
      case 3:
        return HAZARD_STYLES.GHOST_NET;
      case 4:
        return HAZARD_STYLES.MINE_CYLINDER;
    }
  }

  const key = (classification || '').toUpperCase();
  if (key.includes('PIPE')) return HAZARD_STYLES.SUBMARINE_PIPELINE;
  if (key.includes('NET')) return HAZARD_STYLES.GHOST_NET;
  if (key.includes('MINE') || key.includes('CYLINDER')) return HAZARD_STYLES.MINE_CYLINDER;
  if (key.includes('CRAB') || key.includes('POT') || key.includes('TRAP')) return HAZARD_STYLES.CRAB_POT;
  if (key.includes('WRECK') || key.includes('SHIP')) return HAZARD_STYLES.SHIPWRECK;

  return HAZARD_STYLES.ANOMALY;
}
