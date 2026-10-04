// To use Gemini later, replace the body of askCactai with a fetch to
// POST /api/cactai on your backend. Never call Gemini directly from the browser.
// The payload object below matches the expected API contract — only the transport changes.

import { isThirsty, lightLabel } from '../pages/dashboard/plantStatus';

export async function askCactai({ question, plant, readings, history }) {
  // Build the full payload in one place so only the transport changes later.
  const _payload = { question, plant, readings, history }; // eslint-disable-line no-unused-vars

  // Demo delay: 600–1200 ms
  await new Promise(r => setTimeout(r, 600 + Math.random() * 600));

  const q = (question ?? '').toLowerCase();
  const { latestMoisture: moisture, latestLux: lux, avgMoisture, avgLux } = readings ?? {};
  const thirsty = isThirsty(moisture);
  const luxLabel = lightLabel(lux);
  const avgLuxLabel = lightLabel(avgLux);
  const name = plant?.name ?? 'Your cactus';

  if (/health|healthy|how is|how are|doing|overall|fine|good|status/.test(q)) {
    const soilState = moisture == null
      ? 'unknown'
      : thirsty ? `dry at ${moisture}%` : `comfortable at ${moisture}%`;
    const lightState = lux == null
      ? 'unknown'
      : `${luxLabel.toLowerCase()} at ${lux} lux`;
    const verdict = thirsty ? 'could use some water soon' : 'looks healthy overall';
    return `${name} ${verdict}. Soil moisture is ${soilState}${thirsty ? ', just below the 15% comfort line' : ', which is fine for a cactus'}. Light is ${lightState}${luxLabel === 'Bright' ? ', which is ideal' : ''}.`;
  }

  if (/water|thirst|drink|dry out|wet/.test(q)) {
    if (moisture == null) return 'No moisture reading available right now. Check back once the sensor updates.';
    if (thirsty) {
      return `Yes, go ahead and water now. Moisture is at ${moisture}%, below the 15% threshold. Give it a thorough soak, then let the soil dry out fully before the next watering — cacti do best when the soil dries completely between drinks.`;
    }
    return `Not yet. Moisture is at ${moisture}%, still above the 15% threshold. Cacti prefer their soil to dry out fully between waterings, so hold off for now and check again in a day or two.`;
  }

  if (/light|sun|bright|lux|dark|shadow/.test(q)) {
    if (lux == null) return 'No light reading available right now. Try again once the sensor updates.';
    const suffix = luxLabel === 'Bright'
      ? 'The light level is great for a cactus!'
      : 'Consider moving it closer to a bright window — cacti thrive above 2500 lux.';
    return `Current light is ${lux} lux (${luxLabel.toLowerCase()}) and the daily average is ${avgLux ?? '—'} lux (${avgLuxLabel.toLowerCase()}). ${suffix}`;
  }

  return `In the full version I'll answer that using ${name}'s live data. For now, try asking about watering, light, or overall health.`;
}
