import { useState } from "react";
import Sidebar from "./Sidebar";
import AddPlantModal from "./plants/AddPlantModal";
import PlantView from "./plants/PlantView";
import "./Dashboard.css";

const initialPlants = [];

export default function DashboardPage() {
  const [plants, setPlants] = useState(initialPlants);
  const [selectedId, setSelectedId] = useState(initialPlants[0]?.id);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const selected = plants.find((p) => p.id === selectedId);

  function handleAddPlant(data) {
    const plant = { id: crypto.randomUUID(), ...data, readings: null };
    setPlants((prev) => [...prev, plant]);
    setSelectedId(plant.id);
    setIsAddOpen(false);
  }

  return (
    <div className="dashboard-page">
      <Sidebar
        plants={plants}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAddPlant={() => setIsAddOpen(true)}
      />

      <main className="dash-main">
        {selected && <PlantView plant={selected} />}
      </main>

      {isAddOpen && (
        <AddPlantModal
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleAddPlant}
        />
      )}
    </div>
  );
}
