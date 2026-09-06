/**
 * Format decimal coordinates to GPS Degrees Minutes Seconds (DMS)
 */
export function formatCoordinatesDMS(lat: number, lon: number): string {
  const formatDMS = (val: number, posChar: string, negChar: string) => {
    const direction = val >= 0 ? posChar : negChar;
    const absVal = Math.abs(val);
    const degrees = Math.floor(absVal);
    const minutesNotTruncated = (absVal - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);
    return `${degrees}°${minutes.toString().padStart(2, '0')}'${seconds.padStart(4, '0')}"${direction}`;
  };

  return `${formatDMS(lat, 'N', 'S')} ${formatDMS(lon, 'E', 'W')}`;
}

/**
 * Format decimal coordinates into compact telemetry string
 */
export function formatCoordinatesDec(lat: number, lon: number, precision = 4): string {
  const latStr = `${Math.abs(lat).toFixed(precision)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(lon).toFixed(precision)}° ${lon >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lonStr}`;
}

/**
 * Format depth in meters with optional altitude
 */
export function formatDepth(meters: number): string {
  return `${meters.toFixed(1)} m`;
}

/**
 * Format frequency (e.g. 450 kHz)
 */
export function formatFrequency(khz: number): string {
  return `${khz} kHz`;
}

/**
 * Format confidence percentage
 */
export function formatConfidence(score: number): string {
  const pct = score <= 1 ? score * 100 : score;
  return `${pct.toFixed(1)}%`;
}

/**
 * Format date time to ISO Marine survey timestamp
 */
export function formatSurveyTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return isoString;
  }
}
