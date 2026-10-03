import csvRaw from '../../cactus_readings.csv?raw';

const allRows = (() => {
  const lines = csvRaw.trim().split('\n');
  return lines.slice(1).map(line => {
    const parts = line.split(',');
    return {
      ts: new Date(parts[1]),
      moisture: parseFloat(parts[2]),
      lux: parseFloat(parts[4]),
    };
  });
})();

function avg(arr) {
  return Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 10) / 10;
}

function bucket(rows, getKey, getLabel, field) {
  const map = new Map();
  for (const r of rows) {
    const key = getKey(r.ts);
    if (!map.has(key)) map.set(key, { label: getLabel(r.ts), values: [] });
    map.get(key).values.push(r[field]);
  }
  return [...map.values()].map(b => ({ label: b.label, [field]: avg(b.values) }));
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function dayKey(ts) {
  return `${ts.getFullYear()}-${ts.getMonth()}-${ts.getDate()}-${ts.getHours()}`;
}
function dayLabel(ts) {
  const h = ts.getHours();
  return `${h % 12 || 12}${h < 12 ? 'am' : 'pm'}`;
}
function calDayKey(ts) {
  return `${ts.getFullYear()}-${ts.getMonth()}-${ts.getDate()}`;
}

function sliceRows(range) {
  const latest = allRows[allRows.length - 1].ts;
  const MS = { day: 1, week: 7, month: 30 };
  const cutoff = new Date(+latest - MS[range] * 24 * 60 * 60 * 1000);
  return allRows.filter(r => r.ts >= cutoff);
}

function getKeyFns(range) {
  if (range === 'day') return [dayKey, dayLabel];
  if (range === 'week') return [calDayKey, ts => WEEK_DAYS[ts.getDay()]];
  return [calDayKey, ts => `${MONTH_NAMES[ts.getMonth()]} ${ts.getDate()}`];
}

export function getMoistureData(range) {
  const [getKey, getLabel] = getKeyFns(range);
  return bucket(sliceRows(range), getKey, getLabel, 'moisture');
}

export function getLightData(range) {
  const [getKey, getLabel] = getKeyFns(range);
  return bucket(sliceRows(range), getKey, getLabel, 'lux');
}
