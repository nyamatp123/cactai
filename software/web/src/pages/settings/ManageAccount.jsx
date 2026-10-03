import { useState } from "react";
import { THEME_LABELS } from "../../hooks/useSettings";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

function pickDetails(user) {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  };
}

function DetailsForm({ user, onSave }) {
  const [draft, setDraft] = useState(() => pickDetails(user));
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const current = pickDetails(user);
  const isDirty = Object.keys(draft).some((key) => draft[key].trim() !== current[key]);

  function handleChange(e) {
    setDraft((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const details = {
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
    };

    if (!details.firstName || !details.lastName) {
      setError("Enter your first and last name.");
      return;
    }
    if (!EMAIL_PATTERN.test(details.email)) {
      setError("Enter a valid email address.");
      return;
    }

    setSaving(true);
    try {
      await onSave(details);
      setDraft(details);
      setSaved(true);
    } catch {
      // TODO: map API errors to friendly messages.
      setError("We couldn't save your changes. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="firstName">First name</label>
          <input id="firstName" name="firstName" autoComplete="given-name" value={draft.firstName} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" autoComplete="family-name" value={draft.lastName} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" value={draft.email} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone number (optional)</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 604 555 0123"
            value={draft.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && (
        <p className="form-message is-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-small" disabled={!isDirty || saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && !isDirty && (
          <span className="form-note" role="status">
            Changes saved.
          </span>
        )}
      </div>
    </form>
  );
}

const EMPTY_PASSWORDS = { current: "", next: "", confirm: "" };

function PasswordForm({ onSubmit, onCancel }) {
  const [values, setValues] = useState(EMPTY_PASSWORDS);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!values.current || !values.next || !values.confirm) {
      setError("Fill in all three password fields.");
      return;
    }
    if (values.next.length < 8) {
      setError("Your new password needs at least 8 characters.");
      return;
    }
    if (values.next === values.current) {
      setError("Your new password must be different from your current one.");
      return;
    }
    if (values.next !== values.confirm) {
      setError("The new passwords don't match.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(values.current, values.next);
    } catch {
      // TODO: show "current password is wrong" when the API says so.
      setError("We couldn't change your password. Try again.");
      setSaving(false);
    }
  }

  return (
    <form className="password-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="current">Current password</label>
        <input id="current" name="current" type="password" autoComplete="current-password" value={values.current} onChange={handleChange} />
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="next">New password</label>
          <input id="next" name="next" type="password" autoComplete="new-password" value={values.next} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="confirm">Confirm new password</label>
          <input id="confirm" name="confirm" type="password" autoComplete="new-password" value={values.confirm} onChange={handleChange} />
        </div>
      </div>

      {error && (
        <p className="form-message is-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-small" disabled={saving}>
          {saving ? "Updating…" : "Update password"}
        </button>
        <button type="button" className="btn btn-outline btn-small" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function ManageAccount({ user, onSaveProfile, onChangeTheme, onChangePassword }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  async function handlePasswordSubmit(current, next) {
    await onChangePassword(current, next);
    setShowPasswordForm(false);
    setPasswordChanged(true);
  }

  return (
    <>
      <header className="section-header">
        <h1>Manage account</h1>
        <p className="section-subtitle">Update your details, theme, and password.</p>
      </header>

      <section className="settings-block">
        <h2>Personal details</h2>
        <DetailsForm user={user} onSave={onSaveProfile} />
      </section>

      <section className="settings-block">
        <h2>Appearance</h2>
        <div className="setting-row">
          <div>
            <label htmlFor="theme" className="setting-label">
              Theme
            </label>
            <p className="setting-hint">Choose how Cactai looks</p>
          </div>
          <select id="theme" className="theme-select" value={user.theme} onChange={(e) => onChangeTheme(e.target.value)}>
            {Object.entries(THEME_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="settings-block">
        <h2>Security</h2>
        <div className="setting-row">
          <div>
            <p className="setting-label">Password</p>
            <p className="setting-hint">Change the password you log in with</p>
          </div>
          {!showPasswordForm && (
            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={() => {
                setShowPasswordForm(true);
                setPasswordChanged(false);
              }}
            >
              Change password
            </button>
          )}
        </div>

        {showPasswordForm && (
          <PasswordForm onSubmit={handlePasswordSubmit} onCancel={() => setShowPasswordForm(false)} />
        )}
        {passwordChanged && (
          <p className="form-note" role="status">
            Password updated.
          </p>
        )}
      </section>
    </>
  );
}
