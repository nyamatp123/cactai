// Tiny CSV parser for the sample files: no quoting, no missing values.
// Columns are matched by header so the order in the file doesn't matter.
const KEY_BY_HEADER = {
  'time': 'label',
  'date': 'label',
  'moisture (%)': 'moisture',
  'humidity (%)': 'humidity',
  'light (lux)': 'light',
  'temp (°c)': 'temp',
  'health score': 'health',
};

export function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
  if (lines.length === 0) return [];

  const keys = lines[0].split(',').map((h) => KEY_BY_HEADER[h.trim().toLowerCase()] ?? null);

  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const row = {};
    keys.forEach((key, i) => {
      if (!key) return;
      const cell = cells[i]?.trim() ?? '';
      row[key] = key === 'label' ? cell : Number(cell);
    });
    return row;
  });
}
