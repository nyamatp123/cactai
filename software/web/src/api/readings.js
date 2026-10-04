// Readings for one plant. This is the one place to swap sample data for real
// sensor data; everything else reads { rows, reason, lightUnit, source }.
import { getSampleSeries } from '../data/sample';

// TODO: when sensors exist, replace the body with a fetch to
// `${API_URL}/plants/${plantId}/readings?range=${range}` with
// credentials: "include", and keep the same return shape, with
// lightUnit: "raw" (the sensor reports raw light values, not lux).
// Callers already pass plantId; read it here once the fetch needs it.
export async function getReadings({ plantType, range }) {
  const { rows, reason } = getSampleSeries(plantType, range);
  return { rows, reason, lightUnit: 'lux', source: 'sample' };
}
