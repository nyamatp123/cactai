// Summary numbers for the stat cards, worked out from a series of merged rows
// (see mergeReadings.js). `source` says which values to read: "sensor" uses
// the live keys, "sample" the sample* keys.

const KEYS = {
  sensor: { moisture: 'moisture', light: 'light', health: 'health' },
  sample: { moisture: 'sampleMoisture', light: 'sampleLight', health: 'sampleHealth' },
};

function keysFor(source) {
  return KEYS[source] ?? KEYS.sample;
}

// Returns { label, moisture, light, health } or null.
// "sensor": the newest row with a live moisture or light value.
// "sample", day: the row closest to the current time of day (wrapping midnight).
// "sample", week: the most recent row.
export function currentReading(rows, range, source = 'sample') {
  if (!rows?.length) return null;
  const k = keysFor(source);
  const pick = (row) => ({
    label: row.label,
    moisture: row[k.moisture] ?? null,
    light: row[k.light] ?? null,
    health: row[k.health] ?? null,
  });

  if (source === 'sensor') {
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i].moisture != null || rows[i].light != null) return pick(rows[i]);
    }
    return null;
  }

  const sampleRows = rows.filter((r) => r[k.moisture] != null || r[k.light] != null);
  if (!sampleRows.length) return null;
  if (range !== 'day') return pick(sampleRows[sampleRows.length - 1]);

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let best = sampleRows[0];
  let bestDist = Infinity;
  for (const row of sampleRows) {
    const diff = Math.abs((row.minutes % 1440) - nowMinutes);
    const dist = Math.min(diff, 1440 - diff);
    if (dist < bestDist) {
      best = row;
      bestDist = dist;
    }
  }
  return pick(best);
}

// Means that skip nulls; null when there's nothing to average
export function averages(rows, source = 'sample') {
  const k = keysFor(source);
  const mean = (key) => {
    const values = (rows ?? []).map((r) => r[key]).filter((v) => v != null);
    return values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : null;
  };
  const moisture = mean(k.moisture);
  const light = mean(k.light);
  return {
    moisture: moisture == null ? null : Math.round(moisture * 10) / 10,
    light: light == null ? null : Math.round(light),
  };
}
