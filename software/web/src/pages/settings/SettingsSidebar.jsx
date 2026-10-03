const NAV_ITEMS = [
  {
    id: "overview",
    label: "Account overview",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "plants",
    label: "Manage plants",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 21v-9" />
        <path d="M12 12c0-4-3-6-7-6 0 4 3 6 7 6z" />
        <path d="M12 10c0-3 2.5-5 6-5 0 3-2.5 5-6 5z" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Manage account",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
      </svg>
    ),
  },
];

function formatMemberSince(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export default function SettingsSidebar({ user, active, onSelect }) {
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <aside className="settings-sidebar">
      {/* TODO: point to the real dashboard route */}
      <a href="#" className="back-link">
        <span aria-hidden="true">←</span> Back to dashboard
      </a>

      <div className="profile">
        <span className="avatar" aria-hidden="true">
          {initials}
        </span>
        <p className="profile-name">
          {user.firstName} {user.lastName}
        </p>
        <p className="profile-since">Member since {formatMemberSince(user.memberSince)}</p>
      </div>

      <nav className="settings-nav" aria-label="Settings">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item${active === item.id ? " is-active" : ""}`}
            aria-current={active === item.id ? "page" : undefined}
            onClick={() => onSelect(item.id)}
          >
            <span className="nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
