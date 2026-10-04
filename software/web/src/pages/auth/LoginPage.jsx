import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { GoogleIcon } from "./AuthArt";
import { login } from "../../api/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleGoogle() {
    // TODO: implement Google OAuth
  }

  return (
    <AuthLayout>
          <h1 className="login__title">Welcome back</h1>
          <p className="login__subtitle">Log in to check on your plant.</p>

          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <label className="login__label" htmlFor="email">Email</label>
            <input
              id="email"
              className="login__input"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="login__label" htmlFor="password">Password</label>
            <div className="login__password">
              <input
                id="password"
                className="login__input login__input--password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="login__show"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="login__row">
              <Link to="/forgot-password" className="login__link">Forgot password?</Link>
            </div>

            {error && <p className="login__error" role="alert">{error}</p>}

            <button type="submit" className="login__submit" disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <div className="login__divider"><span>or</span></div>

          <button type="button" className="login__google" onClick={handleGoogle}>
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="login__signup">
            Don't have an account?{" "}
            <Link to="/signup" className="login__link">Sign up</Link>
          </p>
    </AuthLayout>
  );
}