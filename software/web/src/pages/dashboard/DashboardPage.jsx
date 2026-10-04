import { useState, useMemo } from "react";
import Sidebar from "./Sidebar";
import StatCards from "./StatCards";
import MoistureChart from "./MoistureChart";
import LightChart from "./LightChart";
import AddPlantModal from "./plants/AddPlantModal";
import PlantView from "./plants/PlantView";
import PlantPanel from "./PlantPanel";
import { getStatReadings } from "../../utils/parseReadings";
import "./Dashboard.css";

const RANGES = ['Day', 'Week', 'Month'];

function TimeRangeToggle({ value, onChange }) {
  const idx = RANGES.findIndex(r => r.toLowerCase() === value);
  return (
    <div className="time-toggle" role="group" aria-label="Time range">
      <div
        className="time-toggle-pill"
        style={{ transform: `translateX(${idx * 100}%)` }}
        aria-hidden="true"
      />
      {RANGES.map(r => (
        <button
          key={r}
          type="button"
          className={`time-toggle-option${value === r.toLowerCase() ? ' is-active' : ''}`}
          onClick={() => onChange(r.toLowerCase())}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

const initialPlants = [];

export default function DashboardPage() {
  const [plants, setPlants] = useState(initialPlants);
  const [selectedId, setSelectedId] = useState(initialPlants[0]?.id);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('day');
  const [isChatOpen, setIsChatOpen] = useState(false);
  // Per-plant chat history: Map<plantId, { id, role, text }[]>
  const [chatHistory, setChatHistory] = useState(() => new Map());

  const selected = plants.find((p) => p.id === selectedId);
  const statReadings = useMemo(() => getStatReadings(), []);

  // Chat still works before any plant is added
  const chatKey = selectedId ?? '__no-plant__';
  const chatMessages = chatHistory.get(chatKey) ?? [];

  function handleAddMessage(msg) {
    setChatHistory(prev => {
      const next = new Map(prev);
      const existing = next.get(chatKey) ?? [];
      next.set(chatKey, [...existing, { ...msg, id: crypto.randomUUID() }]);
      return next;
    });
  }

  function handleAddPlant(data) {
    const plant = { id: crypto.randomUUID(), ...data, readings: null };
    setPlants((prev) => [...prev, plant]);
    setSelectedId(plant.id);
    setIsAddOpen(false);
  }

  return (
    <div className={`dashboard-page${isChatOpen ? ' chat-open' : ''}`}>
      <Sidebar
        plants={plants}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAddPlant={() => setIsAddOpen(true)}
      />

      <main className="dash-main">
        <div className="dash-header">
          <div className="dash-greeting">
            <h1>Hi, {selected?.name ?? 'Plant Buddy'}</h1>
            <p>Updated just now</p>
          </div>
          <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
        </div>

        <StatCards readings={statReadings} onWaterNow={() => { /* TODO: wire to backend */ }} />
        <MoistureChart timeRange={timeRange} />
        <LightChart timeRange={timeRange} />

        {selected && <PlantView plant={selected} />}
      </main>

      <PlantPanel
        plant={selected}
        readings={statReadings}
        isChatOpen={isChatOpen}
        onOpenChat={() => setIsChatOpen(true)}
        onCloseChat={() => setIsChatOpen(false)}
        chatMessages={chatMessages}
        onAddMessage={handleAddMessage}
      />

      {isAddOpen && (
        <AddPlantModal
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleAddPlant}
        />
      )}
    </div>
  );
}
