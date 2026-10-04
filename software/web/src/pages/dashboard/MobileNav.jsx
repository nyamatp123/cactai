import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/cactai-logo.png";

// Replaces the sidebar rail on small screens (see Dashboard.css).
export default function MobileNav({ plants, selectedId, onSelect, onAddPlant, onLogout }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = plants.find((p) => p.id === selectedId);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(action) {
    setOpen(false);
    action();
  }

  return (
    <header className="dash-mobile-nav" ref={ref}>
      <div className="dash-mobile-bar">
        <img src={logo} alt="Cactai" className="dash-mobile-logo" />
        <button
          type="button"
          className="dash-mobile-toggle"
          aria-expanded={open}
          aria-controls="dash-mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="dash-mobile-current">{selected?.name ?? "Your plants"}</span>
          <svg
            className={`dash-mobile-chevron${open ? " is-open" : ""}`}
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {open && (
        <nav id="dash-mobile-menu" className="dash-mobile-menu">
          <ul>
            {plants.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={`dash-mobile-item${p.id === selectedId ? " is-active" : ""}`}
                  aria-current={p.id === selectedId ? "page" : undefined}
                  onClick={() => choose(() => onSelect(p.id))}
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="dash-mobile-actions">
            <button type="button" className="dash-mobile-item" onClick={() => choose(onAddPlant)}>
              + Add plant
            </button>
            <button type="button" className="dash-mobile-item" onClick={() => choose(() => navigate("/settings"))}>
              Settings
            </button>
          </div>
          <div className="dash-mobile-actions">
            <button type="button" className="dash-mobile-item dash-mobile-logout" onClick={() => choose(onLogout)}>
              Log out
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}