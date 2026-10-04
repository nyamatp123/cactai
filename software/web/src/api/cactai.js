// Sends the chat to the backend, which calls Gemini. Never call Gemini directly
// from the browser: the API key lives only on the backend.

import { API_URL } from './client';
import { lightLabel, moistureLabel } from '../pages/dashboard/plantStatus';

function buildContext(plant, readings) {
  const { latestMoisture: moisture, latestLux: light, avgMoisture, avgLux } = readings ?? {};
  // Same labels as the readings card, so the reply and the card agree
  const soil = moisture == null ? null : moistureLabel(moisture, plant?.idealRanges);
  const lightLevel = light == null ? null : lightLabel(light);
  return {
    name: plant?.name ?? null,
    type: plant?.type ?? null, // matches an entry in the knowledge base
    moisture_percent: moisture ?? null,
    light_level: light ?? null, // raw sensor number, not lux
    avg_moisture_today_percent: avgMoisture ?? null,
    avg_light_level_today: avgLux ?? null,
    health: soil && lightLevel ? `Soil ${soil}, Light ${lightLevel}` : null,
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
