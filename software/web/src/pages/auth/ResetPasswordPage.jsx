import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token"); // from the email link: /reset-password?token=...
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: validate token, password rules, and that passwords match
    // TODO: call API with { token, password }
    setDone(true);
  }

  if (done) {
    return (
      <AuthLayout>
        <h1 className="login__title">Password updated</h1>
        <p className="login__subtitle">You can now log in with your new password.</p>
        <Link to="/login" className="login__submit login__submit--link">Log in</Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="login__title">Choose a new password</h1>
      <p className="login__subtitle">Enter a new password for your account.</p>

      <form className="login__form" onSubmit={handleSubmit} noValidate>
        <label className="login__label" htmlFor="password">New password</label>
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

        <label className="login__label" htmlFor="confirm">Confirm new password</label>
        <input
          id="confirm"
          className="login__input"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button type="submit" className="login__submit">Update password</button>
      </form>

      <p className="login__signup">
        <Link to="/login" className="login__link">Back to log in</Link>
      </p>
    </AuthLayout>
  );
}