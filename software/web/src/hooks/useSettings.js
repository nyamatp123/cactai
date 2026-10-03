import { useState } from "react";

export const THEME_LABELS = {
  light: "Light mode",
  dark: "Dark mode",
  system: "Match system",
};

// TODO: replace mock data with calls in api/settings.js once the backend exists.
const MOCK_USER = {
  firstName: "Sam",
  lastName: "Rivera",
  username: "samrivera",
  email: "sam@example.com",
  phone: "",
  theme: "light",
  memberSince: "2026-10-15",
};

const MOCK_PLANTS = [
  { id: 1, name: "Spike", species: "Cactus", kind: "cactus", sensor: 1, online: true, moisture: 5, light: 2986, alertsOn: true, thirstLine: 5 },
  { id: 2, name: "Fern", species: "Boston fern", kind: "fern", sensor: 2, online: true, moisture: 11, light: 1420, alertsOn: true, thirstLine: 30 },
  { id: 3, name: "Aloe", species: "Aloe vera", kind: "aloe", sensor: 3, online: false, lastSeen: "2 days ago", alertsOn: false, thirstLine: 10 },
];

// "healthy" | "needs-water" | "offline"
export function getPlantStatus(plant) {
  if (!plant.online) return "offline";
  return plant.moisture < plant.thirstLine ? "needs-water" : "healthy";
}

export default function useSettings() {
  const [user, setUser] = useState(MOCK_USER);
  const [plants, setPlants] = useState(MOCK_PLANTS);

  async function updateProfile(details) {
    // TODO: PATCH /api/settings/profile with details
    setUser((prev) => ({ ...prev, ...details }));
  }

  async function updateTheme(theme) {
    // TODO: PATCH /api/settings/theme, then apply the theme app-wide
    setUser((prev) => ({ ...prev, theme }));
  }

  async function addPlant(details = {}) {
    // TODO: POST /api/plants with details, then use the id the server returns
    const plant = {
      id: Date.now(),
      name: details.name ?? "New plant",
      species: details.species ?? "Cactus",
      kind: details.kind ?? "cactus",
      sensor: null,
      online: false,
      alertsOn: true,
      thirstLine: 15,
      ...details,
    };
    setPlants((prev) => [...prev, plant]);
    return plant;
  }

  async function updatePlant(id, changes) {
    // TODO: PATCH /api/plants/:id with changes
    setPlants((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  }

  async function changePassword(currentPassword, newPassword) {
    // TODO: POST /api/settings/password with { currentPassword, newPassword }
    console.log("TODO: change password", { length: newPassword.length });
  }

  return { user, plants, updateProfile, updateTheme, addPlant, updatePlant, changePassword };
}
