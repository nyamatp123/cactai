// Sends the chat to the backend, which calls Gemini. Never call Gemini directly
// from the browser: the API key lives only on the backend.

import { API_URL } from './client';
import { isThirsty, lightLabel } from '../pages/dashboard/plantStatus';

function buildContext(plant, readings) {
  const { latestMoisture: moisture, latestLux: lux, avgMoisture, avgLux } = readings ?? {};
  const soil = moisture == null ? null : isThirsty(moisture) ? 'Dry' : 'Moist';
  const light = lux == null ? null : lightLabel(lux);
  return {
    name: plant?.name ?? null,
    species: plant?.species ?? null,
    moisture_percent: moisture ?? null,
    lux: lux ?? null,
    avg_moisture_today_percent: avgMoisture ?? null,
    avg_lux_today: avgLux ?? null,
    health: soil && light ? `Soil ${soil}, Light ${light}` : null,
  };
}

export async function askCactai({ question, plant, readings, history }) {
  const res = await fetch(`${API_URL}/chat`, {
    // Backend gives up on Gemini after 30s; this is a backstop so the chat never spins forever
    signal: AbortSignal.timeout(40000),
    method: 'POST',
    credentials: 'include', // send the login cookie; /chat requires login
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: question,
      history,
      context: buildContext(plant, readings),
    }),
  });
  if (!res.ok) throw new Error(`Chat request failed (${res.status})`);
  const data = await res.json();
  return { reply: data.reply, showStats: Boolean(data.show_stats) };
}
