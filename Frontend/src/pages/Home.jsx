import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="home-root">
      <nav className="home-nav" aria-label="Main navigation">
        <div className="home-brand">
          <span className="home-brand-mark">P</span>
          <span>Paintshop <strong>OPS</strong></span>
        </div>
        <button className="home-nav-link" type="button" onClick={() => navigate("/login")}>
          Sign in <span aria-hidden="true">-&gt;</span>
        </button>
      </nav>

      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-kicker">Operations intelligence / 2026</p>
          <h1>Make every shift<br /><em>count.</em></h1>
          <p className="home-intro">
            One clear view for the people who keep the paint shop moving.
            Track performance, safety, quality, and delivery in real time.
          </p>
          <button className="home-primary" type="button" onClick={() => navigate("/login")}>
            Enter workspace <span aria-hidden="true">-&gt;</span>
          </button>
        </div>

        <div className="home-signal" aria-label="Operations status overview">
          <div className="home-signal-top">
            <span>Live operations</span>
            <span className="home-status"><i /> All systems ready</span>
          </div>
          <div className="home-signal-line" />
          <div className="home-signal-grid">
            <div><strong>04</strong><span>Departments</span></div>
            <div><strong>24/7</strong><span>Visibility</span></div>
            <div><strong>01</strong><span>Workspace</span></div>
          </div>
          <div className="home-signal-footer">
            <span>PAINTSHOP / CONTROL</span>
            <span>01</span>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <span>Built for better decisions on the floor.</span>
        <span>Secure access for authorised operators</span>
      </footer>
    </main>
  );
};

export default Home;
