import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0d0f12;
    --surface:   #13171d;
    --panel:     #1a1f28;
    --border:    #272d38;
    --accent:    #e8c547;
    --accent2:   #4a9eff;
    --danger:    #ff5252;
    --success:   #2ecc71;
    --text:      #d4dae6;
    --muted:     #5a6478;
    --label:     #8b95a8;
  }

  body { background: var(--bg); margin: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes pulse-border {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 1; }
  }
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }

  .home-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Barlow', sans-serif;
    color: var(--text);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  /* ── Background grid ── */
  .home-grid-bg {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(232,197,71,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(232,197,71,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Scanline effect ── */
  .home-scanline {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(to bottom, transparent, rgba(232,197,71,0.06), transparent);
    animation: scanline 8s linear infinite;
    pointer-events: none;
    z-index: 1;
  }

  /* ── Corner decorations ── */
  .home-corner {
    position: fixed;
    width: 60px; height: 60px;
    pointer-events: none;
    z-index: 2;
  }
  .home-corner::before, .home-corner::after {
    content: '';
    position: absolute;
    background: var(--accent);
    animation: pulse-border 3s ease-in-out infinite;
  }
  .home-corner::before { width: 100%; height: 2px; }
  .home-corner::after  { width: 2px; height: 100%; }
  .home-corner.tl { top: 24px; left: 24px; }
  .home-corner.tr { top: 24px; right: 24px; transform: scaleX(-1); }
  .home-corner.bl { bottom: 24px; left: 24px; transform: scaleY(-1); }
  .home-corner.br { bottom: 24px; right: 24px; transform: scale(-1); }

  /* ── Ticker ── */
  .home-ticker {
    background: var(--accent);
    padding: 7px 0;
    overflow: hidden;
    position: relative;
    z-index: 10;
    flex-shrink: 0;
  }
  .home-ticker-track {
    display: flex;
    width: max-content;
    animation: ticker 28s linear infinite;
    gap: 0;
  }
  .home-ticker-item {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #0d0f12;
    white-space: nowrap;
    padding: 0 32px;
  }
  .home-ticker-sep {
    color: rgba(13,15,18,0.4);
    padding: 0 8px;
  }

  /* ── Header ── */
  .home-header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 18px 40px;
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
    z-index: 10;
    flex-shrink: 0;
  }
  .home-header-icon {
    width: 34px; height: 34px;
    background: var(--accent);
    display: grid; place-items: center;
    font-size: 16px;
    flex-shrink: 0;
  }
  .home-header-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #fff;
  }
  .home-header-title span { color: var(--accent); }
  .home-header-time {
    margin-left: auto;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    letter-spacing: 2px;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .home-header-time-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--success);
    animation: blink 1.4s ease-in-out infinite;
  }

  /* ── Main ── */
  .home-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    position: relative;
    z-index: 5;
  }

  /* ── Hero text ── */
  .home-eyebrow {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 16px;
    animation: fadeUp 0.6s ease both;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .home-eyebrow::before, .home-eyebrow::after {
    content: '';
    width: 32px; height: 1px;
    background: var(--border);
  }

  .home-hero-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(48px, 8vw, 86px);
    font-weight: 800;
    letter-spacing: 6px;
    text-transform: uppercase;
    color: #fff;
    text-align: center;
    line-height: 0.95;
    margin-bottom: 8px;
    animation: fadeUp 0.6s 0.1s ease both;
  }
  .home-hero-title span { color: var(--accent); }

  .home-hero-sub {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 400;
    letter-spacing: 8px;
    text-transform: uppercase;
    color: var(--muted);
    text-align: center;
    margin-bottom: 48px;
    animation: fadeUp 0.6s 0.2s ease both;
  }

  /* ── Divider line ── */
  .home-divider {
    width: 100%;
    max-width: 560px;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--border), transparent);
    margin-bottom: 48px;
    animation: fadeUp 0.6s 0.25s ease both;
  }

  /* ── Role cards ── */
  .home-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    width: 100%;
    max-width: 620px;
    animation: fadeUp 0.6s 0.3s ease both;
  }

  .home-card {
    background: var(--panel);
    border: 1px solid var(--border);
    padding: 32px 28px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.15s;
    display: flex;
    flex-direction: column;
    gap: 0;
    text-decoration: none;
  }
  .home-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--card-accent, var(--accent));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
  }
  .home-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, var(--card-glow, rgba(232,197,71,0.04)) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.25s;
  }
  .home-card:hover {
    border-color: var(--card-accent, var(--accent));
    transform: translateY(-3px);
  }
  .home-card:hover::before { transform: scaleX(1); }
  .home-card:hover::after  { opacity: 1; }

  .home-card-tag {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--card-accent, var(--accent));
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .home-card-tag::before {
    content: '';
    width: 14px; height: 2px;
    background: var(--card-accent, var(--accent));
  }

  .home-card-icon {
    font-size: 32px;
    margin-bottom: 16px;
    display: block;
  }

  .home-card-role {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: 8px;
  }

  .home-card-desc {
    font-size: 12px;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 28px;
    flex: 1;
  }

  .home-card-btn {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--bg);
    border: 1px solid var(--card-accent, var(--accent));
    padding: 11px 16px;
    cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--card-accent, var(--accent));
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    width: 100%;
  }
  .home-card:hover .home-card-btn {
    background: var(--card-accent, var(--accent));
    color: #0d0f12;
    border-color: var(--card-accent, var(--accent));
  }
  .home-card-btn-arrow {
    font-size: 16px;
    transition: transform 0.2s;
  }
  .home-card:hover .home-card-btn-arrow {
    transform: translateX(5px);
  }

  /* ── Bottom status bar ── */
  .home-statusbar {
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding: 10px 40px;
    display: flex;
    align-items: center;
    gap: 24px;
    position: relative;
    z-index: 10;
    flex-shrink: 0;
  }
  .home-status-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
  }
  .home-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
  }
  .home-status-item.ok   .home-status-dot { background: var(--success); }
  .home-status-item.warn .home-status-dot { background: var(--accent); }
  .home-status-version {
    margin-left: auto;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--border);
  }

  @media (max-width: 520px) {
    .home-cards { grid-template-columns: 1fr; max-width: 360px; }
    .home-header { padding: 16px 20px; }
    .home-statusbar { padding: 10px 20px; gap: 12px; }
  }
`;

const TICKER_ITEMS = [
  "Safety", "◈", "Quality", "◈", "Delivery", "◈", "Cost", "◈",
  "Paintshop Operations", "◈", "SQDC Dashboard", "◈",
  "Safety", "◈", "Quality", "◈", "Delivery", "◈", "Cost", "◈",
  "Paintshop Operations", "◈", "SQDC Dashboard", "◈",
];

const Home = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = time.toLocaleDateString([], { weekday: "short", day: "2-digit", month: "short" });

  return (
    <>
      <style>{css}</style>
      <div className="home-root">

        {/* Background effects */}
        <div className="home-grid-bg" />
        <div className="home-scanline" />
        <div className="home-corner tl" />
        <div className="home-corner tr" />
        <div className="home-corner bl" />
        <div className="home-corner br" />

        {/* Ticker */}
        <div className="home-ticker">
          <div className="home-ticker-track">
            {TICKER_ITEMS.map((item, i) => (
              <span key={i} className="home-ticker-item">
                {item === "◈"
                  ? <span className="home-ticker-sep">◈</span>
                  : item}
              </span>
            ))}
          </div>
        </div>

        {/* Header */}
        <header className="home-header">
          <div className="home-header-icon">⬡</div>
          <span className="home-header-title">Paint<span>shop</span> OPS</span>
          <div className="home-header-time">
            <span className="home-header-time-dot" />
            {dateStr} · {timeStr}
          </div>
        </header>

        {/* Main */}
        <main className="home-main">
          <div className="home-eyebrow">System Access Portal</div>

          <h1 className="home-hero-title">
            Paint<span>shop</span>
          </h1>
          <div className="home-hero-sub">Operations Center</div>

          <div className="home-divider" />

          <div className="home-cards">

            {/* HOD Card */}
            <div
              className="home-card"
              style={{ "--card-accent": "#4a9eff", "--card-glow": "rgba(74,158,255,0.06)" }}
              onClick={() => navigate("/login")}
            >
              <div className="home-card-tag" style={{ "--card-accent": "#4a9eff" }}>
                Role 01
              </div>
              <span className="home-card-icon">📊</span>
              <div className="home-card-role">HOD</div>
              <div className="home-card-desc">
                Head of Department access. View full SQDC dashboard with safety, quality, delivery and cost metrics.
              </div>
              <button className="home-card-btn">
                Enter Dashboard
                <span className="home-card-btn-arrow">→</span>
              </button>
            </div>

            {/* DEO Card */}
            <div
              className="home-card"
              style={{ "--card-accent": "#e8c547", "--card-glow": "rgba(232,197,71,0.06)" }}
              onClick={() => navigate("/login")}
            >
              <div className="home-card-tag" style={{ "--card-accent": "#e8c547" }}>
                Role 02
              </div>
              <span className="home-card-icon">⌨️</span>
              <div className="home-card-role">Data Entry</div>
              <div className="home-card-desc">
                Data Entry Operator access. Submit daily safety, quality, delivery and cost records.
              </div>
              <button className="home-card-btn">
                Enter Portal
                <span className="home-card-btn-arrow">→</span>
              </button>
            </div>

          </div>
        </main>

        {/* Status bar */}
        <div className="home-statusbar">
          <div className="home-status-item ok">
            <span className="home-status-dot" />
            System Online
          </div>
          <div className="home-status-item ok">
            <span className="home-status-dot" />
            DB Connected
          </div>
          <div className="home-status-item warn">
            <span className="home-status-dot" />
            2 Active Users
          </div>
          <span className="home-status-version">v1.0.0 · Paintshop OPS</span>
        </div>

      </div>
    </>
  );
};

export default Home;