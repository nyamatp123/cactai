import { Link } from "react-router-dom";
import CactaiLogo from "./CactaiLogo";
import { getPlantIcon } from "./plantIcons";
import { PlusIcon, SettingsIcon } from "./uiIcons";
import logo from "../../assets/cactai-logo.png";

export default function Sidebar({ plants, selectedId, onSelect, onAddPlant }) {
  return (
    <aside className="dash-sidebar">
      <div className="dash-logo" aria-label="Cactai">
        <img src={logo} alt="Cactai" className="dash-logo-img" />
      </div>

      <nav className="dash-plants" aria-label="Your plants">
        {plants.map((plant) => {
          const isActive = plant.id === selectedId;
          return (
            <button
              key={plant.id}
              type="button"
              className={`dash-rail-button${isActive ? " is-active" : ""}`}
              aria-current={isActive ? "true" : undefined}
              title={plant.name}
              onClick={() => onSelect(plant.id)}
            >
              {getPlantIcon(plant.id)}
              <span className="dash-tooltip">{plant.name}</span>
            </button>
          );
        })}

        <button
          type="button"
          className="dash-rail-button dash-add"
          title="Add a plant"
          onClick={onAddPlant}
        >
          <PlusIcon />
          <span className="dash-tooltip">Add a plant</span>
        </button>
      </nav>

      <Link to="/settings" className="dash-rail-button dash-settings" title="Settings">
        <SettingsIcon />
        <span className="dash-tooltip">Settings</span>
      </Link>
    </aside>
  );
}
