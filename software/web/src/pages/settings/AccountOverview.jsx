import { THEME_LABELS, getPlantStatus } from "../../hooks/useSettings";

export default function AccountOverview({ user, plants, onNavigate }) {
  const healthy = plants.filter((p) => getPlantStatus(p) === "healthy").length;
  const needAttention = plants.length - healthy;

  const details = [
    { label: "First name", value: user.firstName },
    { label: "Last name", value: user.lastName },
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "Theme", value: THEME_LABELS[user.theme] },
  ];

  return (
    <>
      <header className="section-header">
        <h1>Account overview</h1>
        <p className="section-subtitle">Your details and plants at a glance.</p>
      </header>

      <section className="settings-block">
        <div className="block-heading">
          <h2>Your details</h2>
          <button type="button" className="text-link" onClick={() => onNavigate("account")}>
            Edit details <span aria-hidden="true">→</span>
          </button>
        </div>

        <dl className="detail-grid">
          {details.map(({ label, value }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd className={value ? "" : "is-empty"}>{value || "Not added"}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="settings-block">
        <div className="block-heading">
          <h2>Your plants</h2>
          <button type="button" className="text-link" onClick={() => onNavigate("plants")}>
            Manage plants <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="plant-stats">
          <div className="plant-stat">
            <span className="plant-stat-value">{plants.length}</span>
            <span>Plants</span>
          </div>
          <div className="plant-stat is-healthy">
            <span className="plant-stat-value">{healthy}</span>
            <span>Healthy</span>
          </div>
          <div className="plant-stat is-attention">
            <span className="plant-stat-value">{needAttention}</span>
            <span>Need attention</span>
          </div>
        </div>
      </section>
    </>
  );
}
