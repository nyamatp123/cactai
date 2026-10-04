import { useState, useMemo, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { listPlants, createPlant } from "../../api/plants";
import { getAccount } from "../../api/settings";
import { logout } from "../../api/auth";
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

// Route: /dashboard/:plantId. /dashboard alone opens the first plant,
// and users with no plants are sent to /welcome to add one.
export default function DashboardPage() {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const [plants, setPlants] = useState(null); // null while loading
  const [loadError, setLoadError] = useState("");
  const [firstName, setFirstName] = useState(null); // null while loading
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('day');
  const [isChatOpen, setIsChatOpen] = useState(false);
  // Per-plant chat history: Map<plantId, { id, role, text }[]>
  const [chatHistory, setChatHistory] = useState(() => new Map());

  useEffect(() => {
    getAccount()
      .then((account) => setFirstName(account.firstName))
      .catch(() => setFirstName("")); // greeting falls back to "Hi there"
    listPlants()
      .then(setPlants)
      .catch((err) => setLoadError(err.message));
  }, []);

  const selected = plants?.find((p) => String(p.id) === plantId);
  const selectedId = selected?.id;
  const statReadings = useMemo(() => getStatReadings(), []);

  const chatKey = selectedId;
  const chatMessages = chatHistory.get(chatKey) ?? [];

  function handleAddMessage(msg) {
    setChatHistory(prev => {
      const next = new Map(prev);
      const existing = next.get(chatKey) ?? [];
      next.set(chatKey, [...existing, { ...msg, id: crypto.randomUUID() }]);
      return next;
    });
  }

  // Throws on failure so the modal can stay open and show the error
  async function handleAddPlant(data) {
    const plant = await createPlant(data);
    setPlants((prev) => [...prev, plant]);
    setIsAddOpen(false);
    navigate(`/dashboard/${plant.id}`);
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      // Still leave the page; the cookie may already be gone
      console.error("Logout failed:", err);
    }
    navigate("/login", { replace: true });
  }

  if (loadError) return <p style={{ padding: 24 }}>{loadError}</p>;
  if (plants === null) return null; // loading
  if (plants.length === 0) return <Navigate to="/welcome" replace />;
  // No plant in the URL, or one that isn't yours: open the first plant
  if (!selected) return <Navigate to={`/dashboard/${plants[0].id}`} replace />;

  return (
    <div className={`dashboard-page${isChatOpen ? ' chat-open' : ''}`}>
      <Sidebar
        plants={plants}
        selectedId={selectedId}
        onSelect={(id) => navigate(`/dashboard/${id}`)}
        onAddPlant={() => setIsAddOpen(true)}
      />

      <main className="dash-main">
        <div className="dash-header">
          <div className="dash-greeting">
            <h1>{firstName === null ? 'Hi' : firstName ? `Hi, ${firstName}` : 'Hi there'}</h1>
            <p>Updated just now</p>
          </div>
          <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
        </div>

        <StatCards readings={statReadings} onWaterNow={() => { /* TODO: wire to backend */ }} />
        <MoistureChart timeRange={timeRange} />
        <LightChart timeRange={timeRange} />

        <PlantView plant={selected} />
      </main>

      <PlantPanel
        plant={selected}
        readings={statReadings}
        isChatOpen={isChatOpen}
        onOpenChat={() => setIsChatOpen(true)}
        onCloseChat={() => setIsChatOpen(false)}
        chatMessages={chatMessages}
        onAddMessage={handleAddMessage}
        onLogout={handleLogout}
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
