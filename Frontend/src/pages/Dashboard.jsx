import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

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
    --warning:   #f59e0b;
    --text:      #d4dae6;
    --muted:     #5a6478;
    --label:     #8b95a8;
  }

  body { background: var(--bg); }

  .dash-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Barlow', sans-serif;
    color: var(--text);
    padding: 0;
  }

  /* ── Header ── */
  .dash-header {
    background: var(--surface);
    border-bottom: 2px solid var(--accent);
    padding: 20px 40px;
    display: flex;
    align-items: center;
    gap: 16px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .dash-header-icon {
    width: 36px; height: 36px;
    background: var(--accent);
    display: grid; place-items: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .dash-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #fff;
  }
  .dash-title span { color: var(--accent); }
  .dash-badge {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 2px;
    color: var(--muted);
    border: 1px solid var(--border);
    padding: 4px 10px;
    text-transform: uppercase;
  }

  /* ── Filter pills ── */
  .dash-filter-group {
    margin-left: auto;
    display: flex;
    gap: 4px;
    background: var(--panel);
    border: 1px solid var(--border);
    padding: 4px;
  }
  .dash-filter-btn {
    all: unset;
    cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 18px;
    color: var(--muted);
    transition: all 0.15s;
  }
  .dash-filter-btn:hover { color: var(--text); }
  .dash-filter-btn.active {
    background: var(--accent);
    color: #0d0f12;
  }

  /* ── Body layout ── */
  .dash-body {
    display: flex;
    min-height: calc(100vh - 78px);
  }

  /* ── Sidebar ── */
  .dash-sidebar {
    width: 220px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 28px 0;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .dash-sidebar-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--muted);
    padding: 0 24px 12px;
  }
  .dash-dept-btn {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 24px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    border-left: 3px solid transparent;
    transition: all 0.15s ease;
  }
  .dash-dept-btn:hover {
    color: var(--text);
    background: rgba(255,255,255,0.03);
  }
  .dash-dept-btn.active {
    color: var(--accent);
    border-left-color: var(--accent);
    background: rgba(232,197,71,0.06);
  }
  .dash-dept-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ── Content ── */
  .dash-content {
    flex: 1;
    padding: 36px 40px;
    overflow-y: auto;
  }

  /* ── Section header ── */
  .dash-section-header {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 24px;
  }
  .dash-section-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #fff;
  }
  .dash-section-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, var(--border), transparent);
  }
  .dash-section-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 2px;
    color: var(--muted);
    text-transform: uppercase;
  }

  /* ── Cards ── */
  .dash-card {
    background: var(--panel);
    border: 1px solid var(--border);
    padding: 22px 24px;
    margin-bottom: 14px;
  }
  .dash-card-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .dash-card-title::before {
    content: '';
    width: 14px; height: 2px;
    background: var(--accent);
  }

  /* ── Metric grid ── */
  .dash-metric-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
  .dash-metric {
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 14px 16px;
    position: relative;
    transition: border-color 0.15s;
  }
  .dash-metric:hover { border-color: var(--accent); }
  .dash-metric-accent {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
  }
  .dash-metric-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--label);
    margin-bottom: 8px;
  }
  .dash-metric-value {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    line-height: 1;
  }
  .dash-metric-unit {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    color: var(--muted);
    margin-left: 3px;
    font-weight: 600;
    letter-spacing: 1px;
  }
  .dash-metric-badge {
    display: inline-block;
    margin-top: 8px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 2px 8px;
  }

  /* ── Shift table ── */
  .dash-shift-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 4px;
  }
  .dash-shift-table th {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }
  .dash-shift-table td {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    padding: 10px 12px;
    border-bottom: 1px solid rgba(39,45,56,0.5);
  }
  .dash-shift-table tr:last-child td { border-bottom: none; }
  .dash-shift-table td.shift-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    text-align: center;
  }
  .dash-shift-table th.center { text-align: center; }

  /* ── Top issues list ── */
  .dash-issue-row {
    display: grid;
    grid-template-columns: 28px 1fr 80px;
    gap: 12px;
    align-items: center;
    padding: 10px 14px;
    background: var(--bg);
    border: 1px solid var(--border);
    margin-bottom: 6px;
    transition: border-color 0.15s;
  }
  .dash-issue-row:hover { border-color: var(--muted); }
  .dash-issue-idx {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px;
    font-weight: 800;
    color: var(--border);
  }
  .dash-issue-desc {
    font-size: 13px;
    color: var(--text);
  }
  .dash-issue-count {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px;
    font-weight: 800;
    color: var(--accent);
    text-align: right;
  }

  /* ── Divider ── */
  .dash-divider {
    height: 1px;
    background: var(--border);
    margin: 28px 0;
  }

  /* ── Empty state ── */
  .dash-empty {
    background: var(--panel);
    border: 1px dashed var(--border);
    padding: 32px;
    text-align: center;
  }
  .dash-empty-icon { font-size: 28px; margin-bottom: 10px; }
  .dash-empty-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* ── Skeleton ── */
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .dash-skeleton {
    height: 80px;
    background: linear-gradient(90deg, var(--panel) 25%, var(--border) 50%, var(--panel) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border: 1px solid var(--border);
  }

  /* ── Error banner ── */
  .dash-error {
    background: rgba(255,82,82,0.08);
    border: 1px solid var(--danger);
    padding: 14px 18px;
    margin-bottom: 20px;
    font-size: 13px;
    color: var(--danger);
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  /* ── Footer ── */
  .dash-footer {
    text-align: center;
    padding: 20px 0 0;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
  }
  .dash-footer span {
    color: var(--accent);
    cursor: pointer;
    text-decoration: underline;
  }

  /* ── Context banner ── */
  .dash-context-banner {
    background: var(--panel);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    padding: 14px 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .dash-context-avatar {
    width: 38px; height: 38px;
    background: var(--accent);
    display: grid; place-items: center;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    font-weight: 800;
    color: #0d0f12;
    flex-shrink: 0;
  }
  .dash-context-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #fff;
  }
  .dash-context-desc {
    font-size: 12px;
    color: var(--muted);
    margin-top: 2px;
  }
  .dash-context-pill {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--accent);
    border: 1px solid var(--accent);
    padding: 4px 10px;
  }
`;

// ── Department accent colors (using DEO palette variables) ──────────────────
const DEPT_DOTS = ["#e8c547", "#4a9eff", "#2ecc71", "#c084fc", "#ff5252", "#14b8a6"];

// ── Badge helper ───────────────────────────────────────────────────────────
const StatusBadge = ({ value, low, high, reverse = false }) => {
  let level;
  if (!reverse) level = value <= low ? 0 : value <= high ? 1 : 2;
  else          level = value >= low ? 0 : value >= high ? 1 : 2;

  const styles = [
    { bg: "rgba(46,204,113,0.12)", color: "#2ecc71", label: "LOW" },
    { bg: "rgba(232,197,71,0.12)", color: "#e8c547", label: "MOD" },
    { bg: "rgba(255,82,82,0.12)",  color: "#ff5252", label: "HIGH" },
  ];
  const s = styles[level];
  return (
    <span className="dash-metric-badge" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
};

// ── Metric card ────────────────────────────────────────────────────────────
const MetricCard = ({ label, value, unit, accent, children }) => (
  <div className="dash-metric">
    <div className="dash-metric-accent" style={{ background: accent }} />
    <div className="dash-metric-label">{label}</div>
    <div>
      <span className="dash-metric-value">
        {value === null || value === undefined ? "—" : typeof value === "number" ? value.toLocaleString() : value}
      </span>
      {unit && <span className="dash-metric-unit">{unit}</span>}
    </div>
    {children}
  </div>
);

// ── Section header ─────────────────────────────────────────────────────────
const SectionHeader = ({ label, num, icon }) => (
  <div className="dash-section-header">
    <span style={{ fontSize: 18 }}>{icon}</span>
    <h2 className="dash-section-title">{label}</h2>
    <div className="dash-section-line" />
    <span className="dash-section-num">Section {num}</span>
  </div>
);

// ── Empty state ────────────────────────────────────────────────────────────
const EmptyState = ({ label }) => (
  <div className="dash-empty">
    <div className="dash-empty-icon">📭</div>
    <p className="dash-empty-text">No {label} data for this period</p>
  </div>
);

// ── Main Dashboard ─────────────────────────────────────────────────────────
const Dashboard = () => {
  const [filter, setFilter]         = useState("daily");
  const [data, setData]             = useState({});
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [activeDept, setActiveDept] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/dashboard?filter=${filter}`);
      setData(res.data);
    } catch (err) {
      setError("Failed to load dashboard data. Make sure the server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setActiveDept(null); }, [filter]);

  const departments  = data?.department || [];
  const selectedDept = activeDept ? departments.find(d => d._id === activeDept) : null;
  const deptIndex    = selectedDept ? departments.findIndex(d => d._id === activeDept) : 0;

  // ── Section renderers ────────────────────────────────────────────────────
  const renderSafety = () => {
    const items = data?.safety;
    if (!items?.length) return <EmptyState label="safety" />;
    return items.map((s, i) => (
      <div key={s._id || i} className="dash-card">
        <div className="dash-card-title">Incident Metrics</div>
        <div className="dash-metric-grid">
          <MetricCard label="Near Misses" value={s.nearmiss} accent="#ff5252">
            <StatusBadge value={s.nearmiss} low={3} high={8} />
          </MetricCard>
          <MetricCard label="Incidents" value={s.incidents} accent="#ff5252">
            <StatusBadge value={s.incidents} low={0} high={2} />
          </MetricCard>
          <MetricCard label="FAC" value={s.fac} accent="#ff5252">
            <StatusBadge value={s.fac} low={5} high={15} />
          </MetricCard>
        </div>
      </div>
    ));
  };

  const renderQuality = () => {
    const items = data?.quality;
    if (!items?.length) return <EmptyState label="quality" />;
    return items.map((q, i) => (
      <div key={q._id || i}>
        <div className="dash-card">
          <div className="dash-card-title">Quality Scores</div>
          <div className="dash-metric-grid">
            <MetricCard label="HS Score" value={q.hs} unit="%" accent="#4a9eff">
              <StatusBadge value={q.hs} low={80} high={90} reverse />
            </MetricCard>
            <MetricCard label="Punch Items" value={q.punch} accent="#4a9eff">
              <StatusBadge value={q.punch} low={10} high={30} />
            </MetricCard>
          </div>
        </div>

        {q.topIssues?.length > 0 && (
          <div className="dash-card">
            <div className="dash-card-title">Top Issues</div>
            {q.topIssues.map((issue, idx) => (
              <div key={idx} className="dash-issue-row">
                <span className="dash-issue-idx">{String(idx + 1).padStart(2, "0")}</span>
                <span className="dash-issue-desc">{issue.description}</span>
                <span className="dash-issue-count">{issue.number}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  const renderDelivery = () => {
    const items = data?.delivery;
    if (!items?.length) return <EmptyState label="delivery" />;
    return items.map((d, i) => (
      <div key={d._id || i}>
        <div className="dash-card">
          <div className="dash-card-title">Production</div>
          <div className="dash-metric-grid">
            <MetricCard label="Topcoat Cycles"  value={d.topcoatcycles}  unit="cyc"   accent="#2ecc71" />
            <MetricCard label="Surfacer Cycles" value={d.surfacercycles} unit="cyc"   accent="#2ecc71" />
            <MetricCard label="BIW Production"  value={d.biwproduction}  unit="units" accent="#2ecc71" />
            <MetricCard label="TCF Production"  value={d.tcfproduction}  unit="units" accent="#2ecc71" />
          </div>
        </div>

        {(d.paintshopin?.length > 0 || d.paintshopout?.length > 0) && (
          <div className="dash-card">
            <div className="dash-card-title">Shift Breakdown</div>
            <table className="dash-shift-table">
              <thead>
                <tr>
                  <th>Line</th>
                  <th className="center">A Shift</th>
                  <th className="center">B Shift</th>
                  <th className="center">C Shift</th>
                </tr>
              </thead>
              <tbody>
                {d.paintshopin?.map((row, ri) => (
                  <tr key={`in-${ri}`}>
                    <td style={{ color: "var(--label)", fontSize: 12, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
                      Paint Shop IN
                    </td>
                    <td className="shift-val">{row.ashift ?? "—"}</td>
                    <td className="shift-val">{row.bshift ?? "—"}</td>
                    <td className="shift-val">{row.cshift ?? "—"}</td>
                  </tr>
                ))}
                {d.paintshopout?.map((row, ri) => (
                  <tr key={`out-${ri}`}>
                    <td style={{ color: "var(--label)", fontSize: 12, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
                      Paint Shop OUT
                    </td>
                    <td className="shift-val">{row.ashift ?? "—"}</td>
                    <td className="shift-val">{row.bshift ?? "—"}</td>
                    <td className="shift-val">{row.cshift ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    ));
  };

  const renderCost = () => {
    const items = data?.cost;
    if (!items?.length) return <EmptyState label="cost" />;
    return items.map((c, i) => (
      <div key={c._id || i} className="dash-card">
        <div className="dash-card-title">Consumption & Overheads</div>
        <div className="dash-metric-grid">
          <MetricCard label="Power"   value={c.powerConsumption}   unit="kWh" accent="#e8c547" />
          <MetricCard label="Gas"     value={c.gasConsumption}     unit="m³"  accent="#e8c547" />
          <MetricCard label="IDM"     value={c.idmConsumption}     unit="L"   accent="#e8c547" />
          <MetricCard label="Thinner" value={c.thinnerConsumption} unit="L"   accent="#e8c547" />
          <MetricCard label="OT Nos"  value={c.otNos}                         accent="#e8c547" />
        </div>
      </div>
    ));
  };

  const renderSkeletons = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="dash-skeleton" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div className="dash-root">

        {/* ── Header ── */}
        <header className="dash-header">
          <div className="dash-header-icon">⬡</div>
          <h1 className="dash-title">Paint<span>shop</span> OPS</h1>
          <span className="dash-badge">SQDC Dashboard</span>

          <div className="dash-filter-group">
            {["daily", "weekly", "monthly"].map(f => (
              <button
                key={f}
                className={`dash-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <div className="dash-body">

          {/* ── Sidebar: department selector ── */}
          <aside className="dash-sidebar">
            <div className="dash-sidebar-label">Department</div>

            <button
              className={`dash-dept-btn ${activeDept === null ? "active" : ""}`}
              onClick={() => setActiveDept(null)}
            >
              <span className="dash-dept-dot" style={{ background: activeDept === null ? "var(--accent)" : "var(--muted)" }} />
              All
            </button>

            {departments.map((dept, idx) => (
              <button
                key={dept._id}
                className={`dash-dept-btn ${activeDept === dept._id ? "active" : ""}`}
                onClick={() => setActiveDept(activeDept === dept._id ? null : dept._id)}
              >
                <span className="dash-dept-dot" style={{ background: DEPT_DOTS[idx % DEPT_DOTS.length] }} />
                {dept.name}
              </button>
            ))}
          </aside>

          {/* ── Main content ── */}
          <main className="dash-content">

            {/* Dept context banner */}
            {selectedDept && (
              <div className="dash-context-banner">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div className="dash-context-avatar">
                    {selectedDept.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="dash-context-name">{selectedDept.name}</div>
                    {selectedDept.description && (
                      <div className="dash-context-desc">{selectedDept.description}</div>
                    )}
                  </div>
                </div>
                <span className="dash-context-pill">{filter} view</span>
              </div>
            )}

            {/* Error */}
            {error && <div className="dash-error">⚠ {error}</div>}

            {loading ? renderSkeletons() : (
              <>
                {/* Safety */}
                <SectionHeader label="Safety" num="01" icon="🦺" />
                {renderSafety()}

                <div className="dash-divider" />

                {/* Quality */}
                <SectionHeader label="Quality" num="02" icon="✅" />
                {renderQuality()}

                <div className="dash-divider" />

                {/* Delivery */}
                <SectionHeader label="Delivery" num="03" icon="🚚" />
                {renderDelivery()}

                <div className="dash-divider" />

                {/* Cost */}
                <SectionHeader label="Cost" num="04" icon="⚡" />
                {renderCost()}
              </>
            )}

            {/* Footer */}
            <div className="dash-footer">
              Last refreshed · {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              {" · "}
              <span onClick={fetchData}>Refresh</span>
            </div>

          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;  