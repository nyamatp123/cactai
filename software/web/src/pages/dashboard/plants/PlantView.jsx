import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import useReadings from "../../../hooks/useReadings";
import { currentReading, averages } from "../../../data/readingStats";
import { isThirsty, lightLabel, thirstLineFor } from "../plantStatus";
import StatCards from "../StatCards";
import MoistureChart from "../MoistureChart";
import LightChart from "../LightChart";

const AVG_LABEL = { day: "Avg today", week: "Avg this week" };

// `range` ("day" | "week" | "month") comes from the Day/Week/Month toggle,
// which lives in the dashboard header.
export default function PlantView({ plant, range = "day" }) {
  const {
    rows, reason, lightUnit, source, hasLive, liveStartIndex, sensorError, loading, error,
  } = useReadings({
    plantId: plant.id,
    plantType: plant.type,
    range,
  });
  const current = useMemo(() => currentReading(rows, range, source), [rows, range, source]);
  const avg = useMemo(() => averages(rows, source), [rows, source]);

  if (!loading && error?.status === 401) return <Navigate to="/login" replace />;

  return (
    <>
      {!loading && error && (
        <p className="sample-note">Couldn't load readings: {error.message}</p>
      )}

      {!loading && !error && sensorError && (
        <p className="sample-note">Can't reach the sensor server.</p>
      )}

      {!loading && !error && rows.length > 0 && (
        <>
          <StatCards
            current={current}
            averages={avg}
            needsWater={isThirsty(current?.moisture, plant.type)}
            lightLevel={lightLabel(current?.light, lightUnit)}
            avgLabel={AVG_LABEL[range]}
            onWaterNow={() => { /* TODO: wire to backend */ }}
          />
          <MoistureChart
            data={rows}
            thirstLine={thirstLineFor(plant.type)}
            hasLive={hasLive}
            liveStartIndex={liveStartIndex}
          />
          <LightChart
            data={rows}
            timeRange={range}
            lightUnit={lightUnit}
            hasLive={hasLive}
            liveStartIndex={liveStartIndex}
          />
        </>
      )}

      {!loading && !error && rows.length === 0 && reason === "range" && (
        <p className="sample-note">Month view isn't available yet.</p>
      )}

      {!loading && !error && rows.length === 0 && reason !== "range" && (
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
