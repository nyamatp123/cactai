import { useState } from "react";
import { getPlantStatus } from "../../hooks/useSettings";
import { THIRST_LINE, moistureRangeForType } from "../dashboard/plantStatus";
import AddPlantModal from "../dashboard/plants/AddPlantModal";

const STATUS_LABELS = {
  healthy: "Healthy",
  "needs-water": "Needs water",
  offline: "Sensor offline",
};

const CACTUS_ICON = (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
    <path d="M10.5 3a1.5 1.5 0 0 1 3 0v7h1.5V7.5a1.5 1.5 0 0 1 3 0V12a2.5 2.5 0 0 1-2.5 2.5h-2V21h-3v-3.5H8A2.5 2.5 0 0 1 5.5 15v-3a1.5 1.5 0 0 1 3 0v1.5h2z" />
  </svg>
);

export default function ManagePlants({ plants, onAddPlant, onDeletePlant }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  async function handleAdd(data) {
    await onAddPlant(data); // throws on failure; the modal shows the error
    setIsAddOpen(false);
  }

  async function handleDelete(plant) {
    if (!window.confirm(`Delete ${plant.name}? This also removes its sensor readings.`)) return;
    setError("");
    setDeletingId(plant.id);
    try {
      await onDeletePlant(plant.id);
    } catch (err) {
      setError(err.message || "Couldn't delete the plant. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <header className="section-header with-action">
        <div>
          <h1>Manage plants</h1>
          <p className="section-subtitle">Each plant has its own sensor and thirst line.</p>
        </div>
        <button type="button" className="btn btn-primary btn-small" onClick={() => setIsAddOpen(true)}>
          Add plant
        </button>
      </header>

      {error && <p className="plant-error">{error}</p>}

      {plants.length === 0 && (
        <p className="section-subtitle">No plants yet. Add one to get started.</p>
      )}

      <ul className="plant-list">
        {plants.map((plant) => {
          const status = getPlantStatus(plant);
          const thirstLine = moistureRangeForType(plant.type)?.moistureMin ?? THIRST_LINE;

          return (
            <li key={plant.id} className="plant-card">
              <div className="plant-main">
                <span className="plant-icon is-cactus" aria-hidden="true">
                  {CACTUS_ICON}
                </span>

                <div className="plant-info">
                  <p className="plant-name">{plant.name}</p>
                  <p className="plant-meta">
                    {plant.type} · {plant.deviceId ? `Sensor ${plant.deviceId}` : "No sensor paired"}
                  </p>
                  <p className="plant-reading">
                    {plant.online
                      ? `Moisture ${plant.moisture}% · Light ${plant.light}`
                      : "No readings yet"}
                  </p>
                </div>

                <span className={`status-pill is-${status}`}>{STATUS_LABELS[status]}</span>
              </div>

              <div className="plant-footer">
                <button
                  type="button"
                  role="switch"
                  className="switch"
                  aria-checked={plant.alertsOn ?? true}
                  aria-label={`Watering alerts for ${plant.name}`}
                  onClick={() => {
                    // TODO: PATCH /api/plants/:id { alertsOn: !plant.alertsOn }
                    console.log("TODO: toggle alerts", plant.id);
                  }}
                >
                  <span className="switch-thumb" />
                </button>
                <span className="plant-footer-label">Watering alerts</span>

                <span className="thirst-line">Thirst line {thirstLine}%</span>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    // TODO: let the user set a new thirst line, then PATCH /api/plants/:id
                    console.log("TODO: edit thirst line", plant.id);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-link is-danger"
                  disabled={deletingId === plant.id}
                  onClick={() => handleDelete(plant)}
                >
                  {deletingId === plant.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <button type="button" className="add-another" onClick={() => setIsAddOpen(true)}>
        <span aria-hidden="true">+</span> Add another plant
      </button>

      {isAddOpen && <AddPlantModal onClose={() => setIsAddOpen(false)} onSubmit={handleAdd} />}
    </>
  );
}
