// Merges sample CSV rows (history) with live sensor rows from the backend.
// Every merged row has the same keys. Live values are moisture/light/weight/
// health and sample values are sampleMoisture/sampleLight/sampleHealth, so
// the charts can draw them as separate series. Once a range has any live data
// the CSV is hidden: the series is all live, otherwise it is all CSV.

// The backend's day view buckets readings into BUCKET_MINUTES slots (main.py)
const BUCKET_MINUTES = 5;
const DAY_SLOTS = (24 * 60) / BUCKET_MINUTES; // 288

function pad(n) {
  return String(n).padStart(2, '0');
}

function dateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// e.g. "Sun 4", same as the relabelled sample week
function weekLabel(d) {
  return `${d.toLocaleDateString(undefined, { weekday: 'short' })} ${d.getDate()}`;
}

function emptyRow(idx, label, minutes = null) {
  return {
    idx, label, minutes,
    moisture: null, light: null, weight: null, health: null,
    sampleMoisture: null, sampleLight: null, sampleHealth: null,
  };
}

function withSample(row, sample) {
  return {
    ...row,
    sampleMoisture: sample.moisture ?? null,
    sampleLight: sample.light ?? null,
    sampleHealth: sample.health ?? null,
  };
}

function withLive(row, live) {
  return {
    ...row,
    moisture: live.moisture ?? null,
    light: live.light ?? null,
    weight: live.weight ?? null,
    health: live.health ?? null,
  };
}

// Day: with no live rows, the CSV history as-is. With any live rows, only
// those (labelled with local HH:mm) and no CSV.
export function mergeDay(sampleRows = [], sensorRows = [], slots = DAY_SLOTS) {
  if (sensorRows.length === 0) {
    const rows = sampleRows.map((s, i) => withSample(emptyRow(i, s.label, s.minutes), s));
    return { rows, hasLive: false, liveStartIndex: -1 };
  }

  const rows = sensorRows.slice(-slots).map((r, i) => {
    const d = new Date(r.t);
    const label = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const minutes = d.getHours() * 60 + d.getMinutes();
    return withLive(emptyRow(i, label, minutes), r);
  });
  return { rows, hasLive: true, liveStartIndex: 0 };
}

// Week: the last `days` calendar days ending today. With no live days, every
// day uses the CSV (matched from the end, like the relabelled sample week).
// With any live day, only live data: empty days at the start and end are
// trimmed, empty days in between stay as gaps, and no CSV is shown.
export function mergeWeek(sampleRows = [], sensorRows = [], days = 7) {
  const liveByDay = new Map(sensorRows.map((r) => [r.t, r]));
  const today = new Date();
  const dates = Array.from({ length: days }, (_, i) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1 - i)));
  const live = dates.map((d) => liveByDay.get(dateKey(d)));

  const first = live.findIndex(Boolean);
  if (first === -1) {
    if (sampleRows.length === 0) return { rows: [], hasLive: false, liveStartIndex: -1 };
    const rows = dates.map((d, i) => {
      const sample = sampleRows[sampleRows.length - days + i];
      const row = emptyRow(i, weekLabel(d));
      return sample ? withSample(row, sample) : row;
    });
    return { rows, hasLive: false, liveStartIndex: -1 };
  }

  const last = live.findLastIndex(Boolean);
  const rows = dates.slice(first, last + 1).map((d, i) => {
    const row = emptyRow(i, weekLabel(d));
    const r = live[first + i];
    return r ? withLive(row, r) : row;
  });
  return { rows, hasLive: true, liveStartIndex: 0 };
}
