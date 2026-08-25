import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ── Inline styles / design tokens ──────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #f4f6f8;
    --surface:   #ffffff;
    --panel:     #ffffff;
    --border:    #dfe5eb;
    --accent:    #b7791f;
    --accent2:   #2563eb;
    --danger:    #b91c1c;
    --success:   #15803d;
    --text:      #1e293b;
    --muted:     #64748b;
    --label:     #475569;
  }

  body { background: var(--bg); }

  .deo-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    padding: 0;
  }

  /* ── Header ── */
  .deo-header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 16px 40px;
    display: flex;
    align-items: center;
    gap: 16px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .deo-header-icon {
    width: 36px; height: 36px;
    background: #1e293b;
    color: #ffffff;
    display: grid; place-items: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .deo-title {
    font-family: 'DM Sans', sans-serif;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #1e293b;
  }
  .deo-title span { color: var(--accent); }
  .deo-badge {
    margin-left: auto;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--muted);
    border: 1px solid var(--border);
    padding: 4px 10px;
    text-transform: uppercase;
  }
  .deo-logout-btn {
    all: unset;
    cursor: pointer;
    border: 1px solid var(--border);
    color: var(--text);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    padding: 8px 12px;
    text-transform: uppercase;
    transition: border-color 0.15s, color 0.15s;
  }
  .deo-logout-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  /* ── Layout ── */
  .deo-body {
    display: flex;
    min-height: calc(100vh - 78px);
  }

  /* ── Sidebar tabs ── */
  .deo-sidebar {
    width: 200px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 32px 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex-shrink: 0;
  }

  .deo-tab-btn {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--muted);
    border-left: 3px solid transparent;
    transition: all 0.15s ease;
    position: relative;
  }
  .deo-tab-btn:hover {
    color: var(--text);
    background: rgba(255,255,255,0.03);
  }
  .deo-tab-btn.active {
    color: var(--accent);
    border-left-color: var(--accent);
    background: rgba(232,197,71,0.06);
  }
  .deo-tab-icon {
    font-size: 16px;
    width: 20px;
    text-align: center;
  }

  /* ── Content area ── */
  .deo-content {
    flex: 1;
    padding: 40px;
    max-width: 780px;
  }

  .deo-section-header {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 32px;
  }
  .deo-section-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: #1e293b;
  }
  .deo-section-line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }
  .deo-section-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 2px;
    color: var(--muted);
    text-transform: uppercase;
  }

  /* ── Cards / field groups ── */
  .deo-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 22px;
    margin-bottom: 14px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  }
  .deo-card-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .deo-card-title::before {
    content: '';
    width: 14px; height: 2px;
    background: var(--accent);
  }

  /* ── Field grid ── */
  .deo-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .deo-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  .deo-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .deo-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--label);
  }
  .deo-input {
    background: #f8fafc;
    border: 1px solid var(--border);
    color: #1e293b;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 400;
    padding: 10px 14px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
    -moz-appearance: textfield;
  }
  .deo-input::-webkit-inner-spin-button,
  .deo-input::-webkit-outer-spin-button { -webkit-appearance: none; }
  .deo-input::placeholder { color: var(--muted); font-size: 13px; }
  .deo-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(232,197,71,0.12);
  }

  /* ── Top issues row ── */
  .deo-issue-row {
    display: grid;
    grid-template-columns: 1fr 120px;
    gap: 12px;
  }
  .deo-issue-idx {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    color: var(--muted);
    padding-top: 30px;
    letter-spacing: 1px;
  }

  /* ── Submit button ── */
  .deo-submit-row {
    margin-top: 28px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .deo-submit-btn {
    all: unset;
    cursor: pointer;
    background: #1e293b;
    color: #ffffff;
    font-family: 'DM Sans', sans-serif;
    font-weight: 800;
    font-size: 13px;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 13px 36px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background 0.15s, transform 0.1s;
  }
  .deo-submit-btn:hover { background: #334155; }
  .deo-submit-btn:active { transform: scale(0.98); }
  .deo-submit-hint {
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.5px;
  }

  /* ── Divider ── */
  .deo-divider {
    height: 1px;
    background: var(--border);
    margin: 20px 0;
  }
  @media (max-width: 720px) {
    .deo-header { padding: 14px 18px; gap: 10px; }
    .deo-title { font-size: 18px; }
    .deo-badge { display: none; }
    .deo-logout-btn { margin-left: auto; }
    .deo-body { display: block; }
    .deo-sidebar {
      width: 100%; padding: 8px 12px; border-right: 0;
      border-bottom: 1px solid var(--border); flex-direction: row; overflow-x: auto;
    }
    .deo-tab-btn { padding: 10px 12px; border-left: 0; border-bottom: 2px solid transparent; white-space: nowrap; }
    .deo-tab-btn.active { border-left-color: transparent; border-bottom-color: var(--accent); }
    .deo-content { padding: 24px 16px; max-width: none; }
    .deo-section-title { font-size: 24px; }
    .deo-grid-2, .deo-grid-3 { grid-template-columns: 1fr; }
    .deo-submit-row { align-items: flex-start; flex-direction: column; gap: 8px; }
  }
`;

// ── Icons (inline SVG as strings for cleanliness) ───────────────────────────
const TabIcon = ({ tab }) => {
  const icons = {
    safety:   "🛡",
    quality:  "◈",
    delivery: "⬡",
    cost:     "◎",
  };
  return <span className="deo-tab-icon">{icons[tab]}</span>;
};

const Field = ({ label, name, tab, placeholder, onChange }) => (
  <div className="deo-field">
    <label className="deo-label">{label}</label>
    <input
      type="number"
      name={name}
      placeholder={placeholder || "—"}
      className="deo-input"
      onChange={(e) => onChange(tab, e)}
    />
  </div>
);

const SubmitRow = ({ tab, onSubmit }) => (
  <div className="deo-submit-row">
    <button className="deo-submit-btn" onClick={() => onSubmit(tab)}>
      ↑ Submit {tab}
    </button>
    <span className="deo-submit-hint">Posts to /api/{tab}</span>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
const DataEntryOperator = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("safety");

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      navigate("/login");
    }
  };

  const [formData, setFormData] = useState({
    safety: { nearmiss: "", incidents: "", fac: "" },
    quality: {
      hs: "", punch: "",
      topIssues: [
        { description: "", number: "" },
        { description: "", number: "" },
      ],
    },
    delivery: {
      ashiftin: "", bshiftin: "", cshiftin: "",
      ashiftout: "", bshiftout: "", cshiftout: "",
      topcoatcycles: "", surfacercycles: "",
      biwproduction: "", tcfproduction: "",
    },
    cost: {
      powerConsumption: "", gasConsumption: "",
      idmConsumption: "", thinnerConsumption: "", otNos: "",
    },
  });

  const handleChange = (tab, e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [tab]: { ...formData[tab], [name]: value } });
  };

  const handleQualityTopIssues = (index, field, value) => {
    const updated = [...formData.quality.topIssues];
    updated[index][field] = value;
    setFormData({ ...formData, quality: { ...formData.quality, topIssues: updated } });
  };

  const handleSubmit = async (tab) => {
    try {
      let url = "";
      let payload = formData[tab];

      switch (tab) {
        case "safety":   url = "http://localhost:5000/api/safety";   break;
        case "quality":  url = "http://localhost:5000/api/quality";  break;
        case "delivery":
          url = "http://localhost:5000/api/delivery";
          payload = {
            ashiftin:       Number(formData.delivery.ashiftin || 0),
            bshiftin:       Number(formData.delivery.bshiftin || 0),
            cshiftin:       Number(formData.delivery.cshiftin || 0),
            ashiftout:      Number(formData.delivery.ashiftout || 0),
            bshiftout:      Number(formData.delivery.bshiftout || 0),
            cshiftout:      Number(formData.delivery.cshiftout || 0),
            topcoatcycles:  Number(formData.delivery.topcoatcycles || 0),
            surfacercycles: Number(formData.delivery.surfacercycles || 0),
            biwproduction:  Number(formData.delivery.biwproduction || 0),
            tcfproduction:  Number(formData.delivery.tcfproduction || 0),
          };
          console.log("Delivery Payload:", payload);
          break;
        case "cost": url = "http://localhost:5000/api/cost"; break;
        default: break;
      }

      await axios.post(url, payload);
      alert(`${tab} submitted successfully`);
    } catch (error) {
      console.error(error);
      alert("Error submitting");
    }
  };

  const tabMeta = {
    safety:   { label: "Safety",   num: "01" },
    quality:  { label: "Quality",  num: "02" },
    delivery: { label: "Delivery", num: "03" },
    cost:     { label: "Cost",     num: "04" },
  };

  return (
    <>
      <style>{css}</style>
      <div className="deo-root">

        {/* Header */}
        <header className="deo-header">
          <div className="deo-header-icon">⬡</div>
          <h1 className="deo-title">Paint<span>shop</span> OPS</h1>
          <span className="deo-badge">Data Entry Operator</span>
          <button className="deo-logout-btn" onClick={handleLogout}>Sign out</button>
        </header>

        <div className="deo-body">

          {/* Sidebar */}
          <aside className="deo-sidebar">
            {["safety", "quality", "delivery", "cost"].map((tab) => (
              <button
                key={tab}
                className={`deo-tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                <TabIcon tab={tab} />
                {tabMeta[tab].label}
              </button>
            ))}
          </aside>

          {/* Content */}
          <main className="deo-content">

            <div className="deo-section-header">
              <h2 className="deo-section-title">{tabMeta[activeTab].label}</h2>
              <div className="deo-section-line" />
              <span className="deo-section-num">Section {tabMeta[activeTab].num}</span>
            </div>

            {/* ── SAFETY ── */}
            {activeTab === "safety" && (
              <>
                <div className="deo-card">
                  <div className="deo-card-title">Incident Metrics</div>
                  <div className="deo-grid-3">
                    <Field label="Near Miss" name="nearmiss" tab="safety" onChange={handleChange} />
                    <Field label="Incidents" name="incidents" tab="safety" onChange={handleChange} />
                    <Field label="FAC" name="fac" tab="safety" onChange={handleChange} />
                  </div>
                </div>
                <SubmitRow tab="safety" onSubmit={handleSubmit} />
              </>
            )}

            {/* ── QUALITY ── */}
            {activeTab === "quality" && (
              <>
                <div className="deo-card">
                  <div className="deo-card-title">Quality Scores</div>
                  <div className="deo-grid-2">
                    <Field label="HS" name="hs" tab="quality" onChange={handleChange} />
                    <Field label="Punch" name="punch" tab="quality" onChange={handleChange} />
                  </div>
                </div>

                <div className="deo-card">
                  <div className="deo-card-title">Top Issues</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {formData.quality.topIssues.map((issue, index) => (
                      <div key={index} style={{ display: "grid", gridTemplateColumns: "28px 1fr 140px", gap: 12, alignItems: "end" }}>
                        <span style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 20, fontWeight: 800,
                          color: "var(--border)", paddingBottom: 10,
                        }}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="deo-field">
                          <label className="deo-label">Description</label>
                          <input
                            type="text"
                            placeholder="Issue description"
                            className="deo-input"
                            onChange={(e) => handleQualityTopIssues(index, "description", e.target.value)}
                          />
                        </div>
                        <div className="deo-field">
                          <label className="deo-label">Count</label>
                          <input
                            type="number"
                            placeholder="—"
                            className="deo-input"
                            onChange={(e) => handleQualityTopIssues(index, "number", e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <SubmitRow tab="quality" onSubmit={handleSubmit} />
              </>
            )}

            {/* ── DELIVERY ── */}
            {activeTab === "delivery" && (
              <>
                <div className="deo-card">
                  <div className="deo-card-title">Paintshop In</div>
                  <div className="deo-grid-3">
                    <Field label="A Shift In" name="ashiftin" tab="delivery" onChange={handleChange} />
                    <Field label="B Shift In" name="bshiftin" tab="delivery" onChange={handleChange} />
                    <Field label="C Shift In" name="cshiftin" tab="delivery" onChange={handleChange} />
                  </div>
                </div>

                <div className="deo-card">
                  <div className="deo-card-title">Paintshop Out</div>
                  <div className="deo-grid-3">
                    <Field label="A Shift Out" name="ashiftout" tab="delivery" onChange={handleChange} />
                    <Field label="B Shift Out" name="bshiftout" tab="delivery" onChange={handleChange} />
                    <Field label="C Shift Out" name="cshiftout" tab="delivery" onChange={handleChange} />
                  </div>
                </div>

                <div className="deo-card">
                  <div className="deo-card-title">Production</div>
                  <div className="deo-grid-2">
                    <Field label="Topcoat Cycles"  name="topcoatcycles"  tab="delivery" onChange={handleChange} />
                    <Field label="Surfacer Cycles"  name="surfacercycles" tab="delivery" onChange={handleChange} />
                    <Field label="BIW Production"   name="biwproduction"  tab="delivery" onChange={handleChange} />
                    <Field label="TCF Production"   name="tcfproduction"  tab="delivery" onChange={handleChange} />
                  </div>
                </div>
                <SubmitRow tab="delivery" onSubmit={handleSubmit} />
              </>
            )}

            {/* ── COST ── */}
            {activeTab === "cost" && (
              <>
                <div className="deo-card">
                  <div className="deo-card-title">Consumption & Overheads</div>
                  <div className="deo-grid-2">
                    <Field label="Power Consumption"   name="powerConsumption"   tab="cost" onChange={handleChange} />
                    <Field label="Gas Consumption"     name="gasConsumption"     tab="cost" onChange={handleChange} />
                    <Field label="IDM Consumption"     name="idmConsumption"     tab="cost" onChange={handleChange} />
                    <Field label="Thinner Consumption" name="thinnerConsumption" tab="cost" onChange={handleChange} />
                    <Field label="OT Nos"              name="otNos"              tab="cost" onChange={handleChange} />
                  </div>
                </div>
                <SubmitRow tab="cost" onSubmit={handleSubmit} />
              </>
            )}

          </main>
        </div>
      </div>
    </>
  );
};

export default DataEntryOperator;