import { useEffect, useRef, useState } from "react";
import { acquiredDateFrom, durationFrom } from "./plantTime";
import "./AddPlantModal.css";

const CACTUS_TYPES = [
  "Barrel cactus", "Golden barrel", "Prickly pear", "Bunny ears cactus",
  "Moon cactus", "Old man cactus", "Christmas cactus", "Saguaro",
  "Pincushion cactus", "Not sure",
];
const UNITS = ["days", "weeks", "months", "years"];
const LOCATIONS = [
  "Indoor — windowsill (direct sun)",
  "Indoor — bright indirect light",
  "Indoor — low light / desk",
  "Outdoor — full sun",
  "Outdoor — partial shade",
  "Greenhouse",
];

// Without onClose the modal can't be dismissed (used for the required first plant).
// Pass initialPlant to edit an existing plant instead of adding one.
export default function AddPlantModal({
  onClose,
  onSubmit,
  initialPlant = null,
  title = "Add a cactus",
  subtitle = "Tell Cactai about your plant.",
  submitLabel = "Done",
}) {
  const initialDuration = durationFrom(initialPlant?.acquiredAt);
  const [name, setName] = useState(initialPlant?.name ?? "");
  const [type, setType] = useState(initialPlant?.type ?? "");
  const [amount, setAmount] = useState(initialDuration.amount);
  const [unit, setUnit] = useState(initialDuration.unit);
  const [deviceId, setDeviceId] = useState(initialPlant?.deviceId ?? "");
  const [location, setLocation] = useState(initialPlant?.location ?? "");
  const [drainage, setDrainage] = useState(initialPlant?.drainage ?? null); // true | false | null
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  useEffect(() => {
    if (!onClose) return;
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedType = type.trim();
    if (!trimmedName || !trimmedType) {
      setError("Please add a name and a cactus type.");
      return;
    }
    const n = Math.max(0, parseInt(amount, 10) || 0);
    // When editing, keep the exact saved date unless the duration was changed
    const durationUnchanged =
      initialPlant && amount === initialDuration.amount && unit === initialDuration.unit;
    setError("");
    setSaving(true);
    try {
      await onSubmit({
        name: trimmedName,
        type: trimmedType,
        acquiredAt: durationUnchanged ? initialPlant.acquiredAt : acquiredDateFrom(n, unit),
        deviceId: deviceId.trim() || null, // optional for now
        location: location || null,
        drainage,
      });
    } catch (err) {
      setError(err.message || "Couldn't save the plant. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div
      className="add-plant-overlay"
      onMouseDown={(e) => { if (onClose && e.target === e.currentTarget) onClose(); }}
    >
      <form
        className="add-plant-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-plant-title"
        onSubmit={handleSubmit}
      >
        <div className="add-plant-head">
          <div>
            <h2 id="add-plant-title">{title}</h2>
            <p>{subtitle}</p>
          </div>
          {onClose && (
            <button type="button" className="add-plant-x" onClick={onClose} aria-label="Close">
              &times;
            </button>
          )}
        </div>

        {/* ── Section: About ── */}
        <p className="add-plant-section-label">About your cactus</p>

        <div className="add-plant-field">
          <label htmlFor="plant-name">Name</label>
          <input
            id="plant-name"
            ref={nameRef}
            value={name}
            maxLength={24}
            placeholder="What do you want to call it?"
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="add-plant-field">
          <label htmlFor="plant-type">Cactus type</label>
          <input
            id="plant-type"
            list="cactus-types"
            value={type}
            placeholder="e.g. Barrel cactus"
            autoComplete="off"
            onChange={(e) => setType(e.target.value)}
          />
          <datalist id="cactus-types">
            {CACTUS_TYPES.map((t) => <option key={t} value={t} />)}
          </datalist>
        </div>

        <div className="add-plant-field">
          <label htmlFor="plant-amount">How long have you had it?</label>
          <div className="add-plant-duration">
            <input
              id="plant-amount"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select value={unit} onChange={(e) => setUnit(e.target.value)} aria-label="Unit">
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* ── Section: Setup ── */}
        <p className="add-plant-section-label">Setup</p>

        <div className="add-plant-field">
          <label htmlFor="plant-device">
            Device ID <span className="add-plant-hint">(optional)</span>
          </label>
          <input
            id="plant-device"
            value={deviceId}
            placeholder="e.g. esp32-a3f9"
            autoComplete="off"
            onChange={(e) => setDeviceId(e.target.value)}
          />
          <p className="add-plant-hint">The ID of the ESP32 paired to this plant.</p>
        </div>

        <div className="add-plant-field">
          <label htmlFor="plant-location">Placement</label>
          <select
            id="plant-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Select a placement…</option>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <p className="add-plant-hint">Affects how light readings are interpreted.</p>
        </div>

        {/* ── Section: Pot ── */}
        <p className="add-plant-section-label">Pot</p>

        <div className="add-plant-field">
          <label>Drainage holes?</label>
          <div className="add-plant-toggle-row">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                className={`add-plant-toggle${drainage === val ? " is-active" : ""}`}
                onClick={() => setDrainage(val)}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
          <p className="add-plant-hint">Affects moisture thresholds — pots without drainage need lower limits.</p>
        </div>

        {error && <p className="add-plant-error">{error}</p>}

        <div className="add-plant-footer">
          {onClose && (
            <button type="button" className="add-plant-cancel" onClick={onClose}>Cancel</button>
          )}
          <button type="submit" className="add-plant-done" disabled={saving}>
            {saving ? "Saving…" : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
