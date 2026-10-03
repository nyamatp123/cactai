import { useState } from "react";
import useSettings from "../../hooks/useSettings";
import Sidebar from "./Sidebar";
import "./Dashboard.css";

export default function DashboardPage() {
  // TODO: swap useSettings for a dashboard-owned plants hook once the API exists.
  const { plants, addPlant } = useSettings();
  const [selectedId, setSelectedId] = useState(plants[0]?.id ?? null);

  async function handleAddPlant() {
    const plant = await addPlant();
    setSelectedId(plant.id);
  }

  return (
    <div className="dashboard-page">
      <Sidebar
        plants={plants}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAddPlant={handleAddPlant}
      />

      {/* Intentionally empty — panels land here next. */}
      <main className="dash-main" />
    </div>
  );
}
