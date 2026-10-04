// Readings for one plant: sample CSV history, live sensor rows, or both.
// VITE_DATA_MODE picks which (default "hybrid"):
//   "sample" -> CSV only, the backend is never called for readings
//   "hybrid" -> CSV history + live readings merged
//   "sensor" -> live readings only, no CSV
// Everything else reads { rows, reason, lightUnit, source, hasLive,
// liveStartIndex, latest, sensorError }.
import { API_URL } from './client';
import { getSampleSeries } from '../data/sample';
import { mergeDay, mergeWeek } from '../data/mergeReadings';

const MODES = ['sample', 'hybrid', 'sensor'];
const DATA_MODE = MODES.includes(import.meta.env.VITE_DATA_MODE)
  ? import.meta.env.VITE_DATA_MODE
  : 'hybrid';

async function fetchSensorReadings(plantId, range) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const params = new URLSearchParams({ range, tz });
  const res = await fetch(`${API_URL}/plants/${plantId}/readings?${params}`, {
    credentials: 'include', // send the auth cookie
  });
  if (!res.ok) {
    const err = new Error(`Couldn't load sensor readings (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

function result({ rows, hasLive, liveStartIndex }, { reason = null, latest = null, sensorError = false } = {}) {
  return {
    rows,
    reason: reason ?? (rows.length === 0 ? 'empty' : null),
    lightUnit: 'lux',
    source: hasLive ? 'sensor' : 'sample',
    hasLive,
    liveStartIndex,
    latest,
    sensorError,
  };
}

const NOTHING = { rows: [], hasLive: false, liveStartIndex: -1 };

export async function getReadings({ plantId, plantType, range }) {
  const sample = DATA_MODE === 'sensor' ? { rows: [], reason: null } : getSampleSeries(plantType, range);

  if (range !== 'day' && range !== 'week') {
    // The CSV-only app checked the type before the range; keep that in "sample"
    const reason = DATA_MODE === 'sample' && sample.reason === 'type' ? 'empty' : 'range';
    return result(NOTHING, { reason });
  }

  let sensorRows = [];
  let latest = null;
  let sensorError = false;
  if (DATA_MODE !== 'sample' && plantId != null) {
    try {
      const data = await fetchSensorReadings(plantId, range);
      sensorRows = data.rows ?? [];
      latest = data.latest ?? null;
    } catch (err) {
      // 401 goes up so the app can send the user to login. In hybrid mode any
      // other failure (backend down, network error) falls back to the CSV.
      if (err.status === 401 || DATA_MODE === 'sensor') throw err;
      sensorError = true;
    }
  }

  const merged = range === 'day' ? mergeDay(sample.rows, sensorRows) : mergeWeek(sample.rows, sensorRows);
  return result(merged, { latest, sensorError });
}
