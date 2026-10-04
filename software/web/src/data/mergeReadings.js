// Merges sample CSV rows (history) with live sensor rows from the backend.
// Every merged row has the same keys. Live values are moisture/light/weight/
// health and sample values are sampleMoisture/sampleLight/sampleHealth, so
// the two never share a key and the charts can draw them as separate series.

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

// Day: CSV history fills whatever room the live rows leave in the window,
// then the live rows follow (labelled with local HH:mm).
export function mergeDay(sampleRows = [], sensorRows = [], slots = 96) {
  const live = sensorRows.slice(-slots);
  const room = slots - live.length;
  // slice(-0) would return everything, so check room first
  const history = live.length === 0 ? sampleRows : room > 0 ? sampleRows.slice(-room) : [];

  const rows = history.map((s, i) => withSample(emptyRow(i, s.label, s.minutes), s));
  const liveStartIndex = rows.length;

  live.forEach((r, i) => {
    const d = new Date(r.t);
    const label = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const minutes = d.getHours() * 60 + d.getMinutes();
    rows.push(withLive(emptyRow(liveStartIndex + i, label, minutes), r));
  });

  return { rows, hasLive: live.length > 0, liveStartIndex: live.length > 0 ? liveStartIndex : -1 };
}

// Week: the last `days` calendar days ending today. A day with a live row uses
// it; days before the first live day use the CSV (matched from the end, like
// the relabelled sample week); days after it with no live row stay empty.
export function mergeWeek(sampleRows = [], sensorRows = [], days = 7) {
  const liveByDay = new Map(sensorRows.map((r) => [r.t, r]));
  const today = new Date();

  let firstLive = -1;
  let rows = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1 - i));
    const live = liveByDay.get(dateKey(d));
    let row = emptyRow(i, weekLabel(d));
    if (live) {
      if (firstLive === -1) firstLive = i;
      row = withLive(row, live);
    } else if (firstLive === -1) {
      const sample = sampleRows[sampleRows.length - days + i];
      if (sample) row = withSample(row, sample);
    }
    rows.push(row);
  }

  if (sampleRows.length === 0) {
    // No CSV: drop the empty days before the first live day
    rows = firstLive === -1 ? [] : rows.slice(firstLive).map((r, i) => ({ ...r, idx: i }));
    if (firstLive !== -1) firstLive = 0;
  }

  return { rows, hasLive: firstLive !== -1, liveStartIndex: firstLive };
}
