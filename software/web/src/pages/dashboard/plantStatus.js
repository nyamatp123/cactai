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
