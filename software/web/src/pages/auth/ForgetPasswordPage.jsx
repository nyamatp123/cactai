import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: validate email
    // TODO: call API to send reset email; link should point to /reset-password?token=<token>
    setSent(true);
  }

  function handleResend() {
    // TODO: call resend API
  }

  if (sent) {
    return (
      <AuthLayout>
        <h1 className="login__title">Check your email</h1>
        <p className="login__subtitle">
          If an account exists for {email || "that address"}, we sent a link to reset your password.
        </p>
        <Link to="/login" className="login__submit login__submit--link">Back to log in</Link>
        <p className="login__signup">
          Didn't get it?{" "}
          <button type="button" className="login__link login__link--button" onClick={handleResend}>
            Resend email
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="login__title">Reset your password</h1>
      <p className="login__subtitle">Enter your email and we'll send you a reset link.</p>

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
        <button type="submit" className="login__submit">Send reset link</button>
      </form>

      <p className="login__signup">
        Remembered it? <Link to="/login" className="login__link">Log in</Link>
      </p>
    </AuthLayout>
  );
}