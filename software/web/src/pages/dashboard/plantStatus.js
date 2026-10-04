export const THIRST_LINE = 15;
export const LIGHT_BRIGHT = 2500;
export const LIGHT_MEDIUM = 1000;

export function isThirsty(moisture) {
  return moisture != null && moisture < THIRST_LINE;
}

export function lightLabel(lux) {
  if (lux == null) return '—';
  if (lux > LIGHT_BRIGHT) return 'Bright';
  if (lux > LIGHT_MEDIUM) return 'Medium';
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
