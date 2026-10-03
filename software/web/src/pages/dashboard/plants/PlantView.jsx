
import { timeWithYou } from "./plantTime";
import StatCards from "../StatCards";
import MoistureChart from "../MoistureChart";
import LightChart from "../LightChart";

export default function PlantView({ plant }) {
  const hasData = Boolean(plant.readings);
  const subtitle = [plant.type, timeWithYou(plant.acquiredAt)]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <header className="plant-header">
        <div>
          <h1>{plant.name}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <span className={`plant-pill ${hasData ? "is-healthy" : "is-waiting"}`}>
          {hasData ? "Healthy" : "Waiting for sensor"}
        </span>
      </header>

      {hasData ? (
        <>
          <StatCards readings={plant.readings} />
          <MoistureChart data={plant.readings.moistureSeries} />
          <LightChart data={plant.readings.lightSeries} />
        </>
      ) : (
        <div className="plant-empty">
          <div>
            <strong>Connect a sensor to start tracking {plant.name}</strong>
            <span>Readings show up here as soon as the sensor reports in.</span>
          </div>
          <button type="button">Connect sensor</button>
        </div>
      )}
    </>
  );
}