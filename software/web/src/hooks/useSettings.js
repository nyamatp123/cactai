import { useEffect, useState } from "react";
import { listPlants, createPlant, deletePlant } from "../api/plants";

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

// "healthy" | "needs-water" | "offline"
// Plants from the backend don't have live readings yet, so they show as offline
export function getPlantStatus(plant) {
  if (!plant.online) return "offline";
  return plant.moisture < plant.thirstLine ? "needs-water" : "healthy";
}

export default function useSettings() {
  const [user, setUser] = useState(MOCK_USER);
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    listPlants()
      .then(setPlants)
      .catch((err) => console.error("Failed to load plants:", err));
  }, []);

  async function updateProfile(details) {
    // TODO: PATCH /api/settings/profile with details
    setUser((prev) => ({ ...prev, ...details }));
  }

  async function updateTheme(theme) {
    // TODO: PATCH /api/settings/theme, then apply the theme app-wide
    setUser((prev) => ({ ...prev, theme }));
  }

  // Both throw on failure so the caller can show the error
  async function addPlant(details) {
    const plant = await createPlant(details);
    setPlants((prev) => [...prev, plant]);
    return plant;
  }

  async function removePlant(id) {
    await deletePlant(id);
    setPlants((prev) => prev.filter((p) => p.id !== id));
  }

  async function updatePlant(id, changes) {
    // TODO: PATCH /api/plants/:id with changes
    setPlants((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  }

  async function changePassword(currentPassword, newPassword) {
    // TODO: POST /api/settings/password with { currentPassword, newPassword }
    console.log("TODO: change password", { length: newPassword.length });
  }

  return { user, plants, updateProfile, updateTheme, addPlant, removePlant, updatePlant, changePassword };
}
