import "./LoginPage.css";
import logo from "../../assets/cactai-logo.png";
import { Blob, CactusCluster } from "./AuthArt";

export default function AuthLayout({ children }) {
  return (
    <div className="login">
      <section className="login__form-side">
        <header className="login__brand">
          <img src={logo} alt="" className="login__logo" />
          <span className="login__brand-name">Cactai</span>
        </header>

        <div className="login__form-wrap">{children}</div>

        <footer className="login__footer">
          <span>© {new Date().getFullYear()} Cactai</span>
        </footer>
      </section>

      <aside className="login__panel" aria-hidden="true">
        <Blob />
        <CactusCluster />
      </aside>
    </div>
  );
}