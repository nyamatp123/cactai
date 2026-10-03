import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { GoogleIcon } from "./AuthArt";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: validate input (email format, password rules, passwords match)
    // TODO: call sign-up API with { name, email, password } and store session
    navigate("/dashboard");
  }

  function handleGoogle() {
    // TODO: implement Google OAuth sign-up
  }

  return (
    <AuthLayout>
          <h1 className="login__title">Create your account</h1>
          <p className="login__subtitle">Start tracking your plant's moisture and light.</p>

          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <label className="login__label" htmlFor="name">Name</label>
            <input
              id="name"
              className="login__input"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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
                autoComplete="new-password"
                placeholder="Create a password"
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

            <label className="login__label" htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              className="login__input"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <button type="submit" className="login__submit">Create account</button>
          </form>

          <div className="login__divider"><span>or</span></div>

          <button type="button" className="login__google" onClick={handleGoogle}>
            <GoogleIcon />
            Sign up with Google
          </button>

          <p className="login__signup">
            Already have an account?{" "}
            <Link to="/login" className="login__link">Log in</Link>
          </p>
    </AuthLayout>
  );
}