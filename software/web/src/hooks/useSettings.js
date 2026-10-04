import { useEffect, useState } from "react";
import { listPlants, createPlant, deletePlant, updatePlant as apiUpdatePlant } from "../api/plants";
import { getAccount, updateAccount, changePassword as apiChangePassword } from "../api/settings";

export const THEME_LABELS = {
  light: "Light mode",
  dark: "Dark mode",
  system: "Match system",
};

// "healthy" | "needs-water" | "offline"
// Plants from the backend don't have live readings yet, so they show as offline
export function getPlantStatus(plant) {
  if (!plant.online) return "offline";
  return plant.moisture < plant.thirstLine ? "needs-water" : "healthy";
}

export default function useSettings() {
  const [user, setUser] = useState(null); // null while loading
  // TODO: theme isn't saved on the backend yet, so it resets on reload
  const [theme, setTheme] = useState("light");
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    getAccount()
      .then(setUser)
      .catch((err) => console.error("Failed to load account:", err));
    listPlants()
      .then(setPlants)
      .catch((err) => console.error("Failed to load plants:", err));
  }, []);

  // Throws on failure so the form can show the error
  async function updateProfile(details) {
    setUser(await updateAccount(details));
  }

  async function updateTheme(next) {
    // TODO: save on the backend, then apply the theme app-wide
    setTheme(next);
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

  // Throws on failure so the caller can show the error
  async function updatePlant(id, changes) {
    const plant = await apiUpdatePlant(id, changes);
    setPlants((prev) => prev.map((p) => (p.id === id ? { ...p, ...plant } : p)));
    return plant;
  }

  // Throws on failure (e.g. wrong current password) so the form can show the error
  async function changePassword(currentPassword, newPassword) {
    await apiChangePassword(currentPassword, newPassword);
  }

  return {
    user: user && { ...user, theme },
    plants, updateProfile, updateTheme, addPlant, removePlant, updatePlant, changePassword };
}
