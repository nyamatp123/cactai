// Summary numbers for the stat cards, worked out from a series of rows.

// "day": the row closest to the current time of day (wrapping midnight).
// "week": the most recent row.
export function currentReading(rows, range) {
  if (!rows?.length) return null;
  if (range !== 'day') return rows[rows.length - 1];

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let best = rows[0];
  let bestDist = Infinity;
  for (const row of rows) {
    const diff = Math.abs((row.minutes % 1440) - nowMinutes);
    const dist = Math.min(diff, 1440 - diff);
    if (dist < bestDist) {
      best = row;
      bestDist = dist;
    }
  }
  return best;
}

export function averages(rows) {
  if (!rows?.length) return { moisture: null, light: null };
  const mean = (key) => rows.reduce((sum, r) => sum + r[key], 0) / rows.length;
  return {
    moisture: Math.round(mean('moisture') * 10) / 10,
    light: Math.round(mean('light')),
  };
}
