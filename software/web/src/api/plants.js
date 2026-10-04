// Plant CRUD for the logged-in user. The backend uses snake_case and "species";
// the dashboard uses camelCase and "type", so map between them here.
import { API_URL } from "./client";

async function request(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include", // send the auth cookie
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the server. Check that the backend is running.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = Array.isArray(data.detail) ? data.detail[0]?.msg : data.detail;
    const err = new Error(detail || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

function fromApi(p) {
  return {
    id: p.id,
    name: p.name,
    type: p.species,
    deviceId: p.device_id,
    location: p.location,
    drainage: p.drainage,
    acquiredAt: p.acquired_at,
    readings: null,
  };
}

export async function listPlants() {
  const plants = await request("/plants");
  return plants.map(fromApi);
}

export function deletePlant(id) {
  return request(`/plants/${id}`, { method: "DELETE" });
}

export async function createPlant(data) {
  const plant = await request("/plants", {
    method: "POST",
    body: {
      name: data.name,
      species: data.type,
      device_id: data.deviceId,
      location: data.location,
      drainage: data.drainage,
      acquired_at: data.acquiredAt,
    },
  });
  return fromApi(plant);
}
