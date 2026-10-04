// Sample readings shown until real sensors report in. Only plant types with
// their own data get any; every other type gets no rows (no "similar cactus"
// fallback).
import { parseCsv } from './parseCsv';
import pincushionDayCsv from './pincushion_cactus_15min_tracking.csv?raw';
import pincushionWeekCsv from './pincushion_cactus_weekly_tracking.csv?raw';
import mammillariaDayCsv from './mammillaria_15min_tracking.csv?raw';
import mammillariaWeekCsv from './mammillaria_weekly_tracking.csv?raw';
import pachycereusDayCsv from './pachycereus_15min_tracking.csv?raw';
import pachycereusWeekCsv from './pachycereus_weekly_tracking.csv?raw';

// "HH:MM" -> minutes since 00:00. The files run 15:00 -> 00:00, so once the
// clock goes backwards we've passed midnight and add 1440 to keep it last.
function withMinutes(rows) {
  let prev = -1;
  let offset = 0;
  return rows
    .map((row) => {
      const [h, m] = row.label.split(':').map(Number);
      let minutes = h * 60 + m + offset;
      if (minutes < prev) {
        offset += 1440;
        minutes += 1440;
      }
      prev = minutes;
      return { ...row, minutes };
    })
    .sort((a, b) => a.minutes - b.minutes);
}

function series(dayCsv, weekCsv) {
  return { day: withMinutes(parseCsv(dayCsv)), week: parseCsv(weekCsv) };
}

// Each Add Plant type maps to its own files (botanical genus noted alongside)
const SERIES_BY_TYPE = {
  'pincushion cactus': series(pincushionDayCsv, pincushionWeekCsv),
  'thimble cactus': series(mammillariaDayCsv, mammillariaWeekCsv), // Mammillaria
  'elephant cactus': series(pachycereusDayCsv, pachycereusWeekCsv), // Pachycereus
};

// The weekly files say "Day 1 (Oct 1)" etc. Relabel them as the last 7 days
// ending today, e.g. "Sun 4".
function relabelWeek(rows) {
  const today = new Date();
  return rows.map((row, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (rows.length - 1 - i));
    const weekday = d.toLocaleDateString(undefined, { weekday: 'short' });
    return { ...row, label: `${weekday} ${d.getDate()}` };
  });
}

export function getSampleSeries(plantType, range) {
  const data = SERIES_BY_TYPE[plantType?.trim().toLowerCase()];
  if (!data) return { rows: [], reason: 'type' };

  if (range === 'day') return { rows: data.day, reason: null };
  if (range === 'week') return { rows: relabelWeek(data.week), reason: null };
  return { rows: [], reason: 'range' };
}
