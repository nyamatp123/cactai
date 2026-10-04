// Fallback for types not in THIRST_LINE_BY_TYPE (e.g. "toothpick plant")
export const THIRST_LINE = 10;

// Light thresholds per unit. "raw" is the Cactai sensor's raw value (~3000 in
// bright light); "lux" is for the sample data, which goes up to ~90,000 lux.
// The lux numbers are chosen starting points, not taken from the sensor.
export const LIGHT_THRESHOLDS = {
  raw: { bright: 2500, medium: 1000 },
  lux: { bright: 20000, medium: 2500 },
};
export const LIGHT_BRIGHT = LIGHT_THRESHOLDS.raw.bright;
export const LIGHT_MEDIUM = LIGHT_THRESHOLDS.raw.medium;

// Below this moisture % a cactus of this type needs water
const THIRST_LINE_BY_TYPE = {
  'barrel cactus': 8,
  'golden barrel': 8,
  'prickly pear': 10,
  'bunny ears cactus': 10,
  'moon cactus': 8,
  'old man cactus': 8,
  'elephant cactus': 8,
  'christmas cactus': 30,
  'saguaro': 10,
  'pincushion cactus': 10,
  'thimble cactus': 10,
  'not sure': 10,
};

export function thirstLineFor(type) {
  return THIRST_LINE_BY_TYPE[type?.trim().toLowerCase()] ?? THIRST_LINE;
}

export function isThirsty(moisture, type) {
  return moisture != null && moisture < thirstLineFor(type);
}

export function lightLabel(light, unit = 'raw') {
  if (light == null) return '—';
  const { bright, medium } = LIGHT_THRESHOLDS[unit] ?? LIGHT_THRESHOLDS.raw;
  if (light > bright) return 'Bright';
  if (light > medium) return 'Medium';
  return 'Low';
}

// Moisture defaults per cactus type, from the "Suggested Cactai thresholds"
// table in backend/knowledge/cactus-knowledge-base.md (keep the two in sync)
export const MOISTURE_RANGES_BY_TYPE = {
  'barrel cactus': { moistureMin: 8, moistureMax: 35 },
  'golden barrel': { moistureMin: 8, moistureMax: 35 },
  'prickly pear': { moistureMin: 10, moistureMax: 40 },
  'bunny ears cactus': { moistureMin: 10, moistureMax: 40 },
  'moon cactus': { moistureMin: 8, moistureMax: 30 },
  'old man cactus': { moistureMin: 8, moistureMax: 35 },
  'christmas cactus': { moistureMin: 30, moistureMax: 65 },
  'saguaro': { moistureMin: 10, moistureMax: 35 },
  'pincushion cactus': { moistureMin: 10, moistureMax: 35 },
  'thimble cactus': { moistureMin: 10, moistureMax: 35 },
  'elephant cactus': { moistureMin: 10, moistureMax: 35 },
  'not sure': { moistureMin: 10, moistureMax: 35 },
};

export function moistureRangeForType(type) {
  return MOISTURE_RANGES_BY_TYPE[type?.trim().toLowerCase()] ?? null;
}

// Uses the plant's own range when it has one, else the dashboard's thirst line
export function moistureLabel(moisture, ranges) {
  if (ranges?.moistureMin != null && ranges?.moistureMax != null) {
    if (moisture < ranges.moistureMin) return 'dry';
    if (moisture > ranges.moistureMax) return 'too wet';
    return 'comfortable';
  }
  if (moisture < THIRST_LINE) return 'mostly dry';
  if (moisture < 40) return 'comfortable';
  if (moisture < 60) return 'a bit wet';
  return 'too wet';
}
