import { useState } from "react";
import "./LoginPage.css";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Enter your email or username and your password.");
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with real login call (e.g. POST /api/auth/login)
      // with { identifier, password, remember }.
      console.log("TODO: log in", { identifier, remember });

      // TODO: on success, store the session/token and redirect
      // to the dashboard (e.g. navigate("/dashboard")).
    } catch (err) {
      // TODO: map API errors to friendly messages.
      setError("We couldn't log you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    // TODO: start Google OAuth flow, then redirect on success.
    console.log("TODO: continue with Google");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* ---------- Left: form ---------- */}
        <section className="login-form-side">
          <header className="login-brand">
            <span className="login-logo" aria-hidden="true">
              {/* TODO: swap for the real logo asset */}
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M10.5 3a1.5 1.5 0 0 1 3 0v7h1.5V7.5a1.5 1.5 0 0 1 3 0V12a2.5 2.5 0 0 1-2.5 2.5h-2V21h-3v-3.5H8A2.5 2.5 0 0 1 5.5 15v-3a1.5 1.5 0 0 1 3 0v1.5h2z" />
              </svg>
            </span>
            <span className="login-brand-name">Cactai</span>
          </header>

          <div className="login-form-wrap">
            <h1>Welcome back</h1>
            <p className="login-subtitle">Log in to check on your plant.</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="identifier">Email or username</label>
                <div className="input-wrap">
                  <input
                    id="identifier"
                    type="text"
                    autoComplete="username"
                    placeholder="you@example.com or username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="input-wrap">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-visibility"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                {/* TODO: point to the real forgot-password route */}
                <a href="#" className="link">
                  Forgot password?
                </a>
              </div>

              {error && (
                <p className="login-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Logging in…" : "Log in"}
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleGoogleLogin}
            >
              <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
              </svg>
              Continue with Google
            </button>

            <p className="signup-prompt">
              Don't have an account?{" "}
              {/* TODO: point to the real sign-up route */}
              <a href="#" className="link">
                Sign up
              </a>
            </p>
          </div>

          <footer className="login-footer">
            <span>© {new Date().getFullYear()} Cactai</span>
            {/* TODO: point to the real privacy policy page */}
            <a href="#">Privacy policy</a>
          </footer>
        </section>

        {/* ---------- Right: product preview (static placeholder content) ---------- */}
        <aside className="login-preview" aria-hidden="true">
          <div className="preview-copy">
            <h2>Know when your cactus needs you.</h2>
            <p>
              Live moisture and light readings, plus an AI that explains what
              they mean.
            </p>
          </div>

          <div className="preview-cards">
            <div className="stat-row">
              {/* TODO: sample values only; real readings live on the dashboard */}
              <div className="stat stat-moisture">
                <svg viewBox="0 0 40 40" width="72" height="72">
                  <circle cx="20" cy="20" r="16" className="ring-bg" />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    className="ring-fg"
                    strokeDasharray="42 100"
                    pathLength="100"
                    transform="rotate(-90 20 20)"
                  />
                </svg>
                <div>
                  <span className="stat-label">Soil moisture</span>
                  <span className="stat-value">42%</span>
                </div>
              </div>

              <div className="stat stat-light">
                <span className="stat-label">Light now</span>
                <span className="stat-value">2986</span>
              </div>
            </div>

            <div className="ai-note">
              <span className="ai-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
                </svg>
              </span>
              <div>
                <strong>Cactai</strong>
                <p>Your cactus looks healthy. Light is bright and the soil is drying slowly.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}