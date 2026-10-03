import { getPlantStatus } from "../../hooks/useSettings";

const STATUS_LABELS = {
  healthy: "Healthy",
  "needs-water": "Needs water",
  offline: "Sensor offline",
};

const PLANT_ICONS = {
  cactus: (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
      <path d="M10.5 3a1.5 1.5 0 0 1 3 0v7h1.5V7.5a1.5 1.5 0 0 1 3 0V12a2.5 2.5 0 0 1-2.5 2.5h-2V21h-3v-3.5H8A2.5 2.5 0 0 1 5.5 15v-3a1.5 1.5 0 0 1 3 0v1.5h2z" />
    </svg>
  ),
  fern: (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
      <path d="M11.5 19C9 17 6.5 13 6 7c3 1.5 5.2 5.5 5.5 12z" />
      <path d="M12.5 19c2.5-2 5-6 5.5-12-3 1.5-5.2 5.5-5.5 12z" />
    </svg>
  ),
  aloe: (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
      <path d="M12 20c-1.6-3.5-3-8.5-3-14 2 2.5 3 5.5 3 9 .4-3.5 1.4-6.5 3-9 0 5.5-1.4 10.5-3 14z" />
    </svg>
  ),
};

function handleAddPlant() {
  // TODO: open an add-plant flow (name, species, pair sensor), then POST /api/plants
  console.log("TODO: add plant");
}

export default function ManagePlants({ plants }) {
  return (
    <>
      <header className="section-header with-action">
        <div>
          <h1>Manage plants</h1>
          <p className="section-subtitle">Each plant has its own sensor and thirst line.</p>
        </div>
        <button type="button" className="btn btn-primary btn-small" onClick={handleAddPlant}>
          Add plant
        </button>
      </header>

      <ul className="plant-list">
        {plants.map((plant) => {
          const status = getPlantStatus(plant);

          return (
            <li key={plant.id} className="plant-card">
              <div className="plant-main">
                <span className={`plant-icon is-${plant.kind}`} aria-hidden="true">
                  {PLANT_ICONS[plant.kind]}
                </span>

                <div className="plant-info">
                  <p className="plant-name">{plant.name}</p>
                  <p className="plant-meta">
                    {plant.species} · Sensor {plant.sensor}
                  </p>
                  <p className="plant-reading">
                    {plant.online
                      ? `Moisture ${plant.moisture}% · Light ${plant.light}`
                      : `Last reading ${plant.lastSeen}`}
                  </p>
                </div>

                <span className={`status-pill is-${status}`}>{STATUS_LABELS[status]}</span>
              </div>

              <div className="plant-footer">
                <button
                  type="button"
                  role="switch"
                  className="switch"
                  aria-checked={plant.alertsOn}
                  aria-label={`Watering alerts for ${plant.name}`}
                  onClick={() => {
                    // TODO: PATCH /api/plants/:id { alertsOn: !plant.alertsOn }
                    console.log("TODO: toggle alerts", plant.id);
                  }}
                >
                  <span className="switch-thumb" />
                </button>
                <span className="plant-footer-label">Watering alerts</span>

                <span className="thirst-line">Thirst line {plant.thirstLine}%</span>
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
              </div>
            </li>
          );
        })}
      </ul>

      <button type="button" className="add-another" onClick={handleAddPlant}>
        <span aria-hidden="true">+</span> Add another plant
      </button>
    </>
  );
}
