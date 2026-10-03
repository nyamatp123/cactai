

import { useEffect, useRef, useState } from "react";
import { acquiredDateFrom } from "./plantTime";
import "./AddPlantModal.css";

// this is allows the user to pick their cactus breed and name it and enter durtaion of have 
const CACTUS_TYPES = [
  "Barrel cactus", "Golden barrel", "Prickly pear", "Bunny ears cactus",
  "Moon cactus", "Old man cactus", "Christmas cactus", "Saguaro",
  "Pincushion cactus", "Not sure",
];
const UNITS = ["days", "weeks", "months", "years"];

export default function AddPlantModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("3");
  const [unit, setUnit] = useState("months");
  const [error, setError] = useState("");
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedType = type.trim();
    if (!trimmedName || !trimmedType) {
      setError("Please add a name and a cactus type.");
      return;
    }
    const n = Math.max(0, parseInt(amount, 10) || 0);
    onSubmit({
      name: trimmedName,
      type: trimmedType,
      acquiredAt: acquiredDateFrom(n, unit),
    });
  }

  return (
    <div
      className="add-plant-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
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
            <h2 id="add-plant-title">Add a cactus</h2>
            <p>Tell Cactai about your plant.</p>
          </div>
          <button type="button" className="add-plant-x" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="add-plant-field">
          <label htmlFor="plant-name">Cactus name</label>
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
            {CACTUS_TYPES.map((t) => (
              <option key={t} value={t} />
            ))}
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
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="add-plant-error">{error}</p>}

        <div className="add-plant-footer">
          <button type="button" className="add-plant-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="add-plant-done">Done</button>
        </div>
      </form>
    </div>
  );
}