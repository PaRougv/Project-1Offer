import React, { useState } from "react";
import axios from "axios";
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

  body { background: var(--bg); }

  .deo-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Barlow', sans-serif;
    color: var(--text);
    padding: 0;
  }

  .deo-header {
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
  .deo-header-icon {
    width: 36px; height: 36px;
    background: var(--accent);
    display: grid; place-items: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .deo-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #fff;
  }
  .deo-title span { color: var(--accent); }
  .deo-badge {
    margin-left: auto;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 2px;
    color: var(--muted);
    border: 1px solid var(--border);
    padding: 4px 10px;
    text-transform: uppercase;
  }

  .deo-body {
    display: flex;
    min-height: calc(100vh - 78px);
  }

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
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    border-left: 3px solid transparent;
    transition: all 0.15s ease;
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
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 32px;
    font-weight: 800;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #fff;
  }
  .deo-section-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, var(--border), transparent);
  }
  .deo-section-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 2px;
    color: var(--muted);
    text-transform: uppercase;
  }

  .deo-card {
    background: var(--panel);
    border: 1px solid var(--border);
    padding: 24px;
    margin-bottom: 16px;
  }
  .deo-card-title {
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
  .deo-card-title::before {
    content: '';
    width: 14px; height: 2px;
    background: var(--accent);
  }

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
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: 'Barlow', sans-serif;
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

  .deo-submit-row {
    margin-top: 28px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .deo-submit-btn {
    all: unset;
    cursor: pointer;
    background: var(--accent);
    color: #0d0f12;
    font-family: 'Barlow Condensed', sans-serif;
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
  .deo-submit-btn:hover { background: #f5d45a; }
  .deo-submit-btn:active { transform: scale(0.98); }
  .deo-submit-hint {
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.5px;
  }

  .deo-divider {
    height: 1px;
    background: var(--border);
    margin: 20px 0;
  }

  .deo-logout-btn {
    margin-left: 12px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--danger);
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    letter-spacing: 2px;
    padding: 6px 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .deo-logout-btn:hover {
    background: var(--danger);
    color: white;
    border-color: var(--danger);
  }
`;

const TabIcon = ({ tab }) => {
  const icons = { safety: "🛡", quality: "◈", delivery: "⬡", cost: "◎" };
  return <span className="deo-tab-icon">{icons[tab]}</span>;
};

// ✅ KEY FIX: Field is defined OUTSIDE the component so it's never recreated on re-render
const Field = ({ label, name, placeholder, value, onChange }) => (
  <div className="deo-field">
    <label className="deo-label">{label}</label>
    <input
      type="number"
      name={name}
      value={value}
      placeholder={placeholder || "—"}
      className="deo-input"
      onChange={onChange}
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

const DataEntryOperator = () => {
  const [activeTab, setActiveTab] = useState("safety");
  const navigate = useNavigate();

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
    setFormData((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], [name]: value },
    }));
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Logout failed");
    }
  };

  const handleQualityTopIssues = (index, field, value) => {
    setFormData((prev) => {
      const updated = prev.quality.topIssues.map((issue, i) =>
        i === index ? { ...issue, [field]: value } : issue
      );
      return { ...prev, quality: { ...prev.quality, topIssues: updated } };
    });
  };

  const handleSubmit = async (tab) => {
    try {
      let url = "";
      let payload = formData[tab];

      switch (tab) {
        case "safety":  url = "http://localhost:5000/api/safety";  break;
        case "quality": url = "http://localhost:5000/api/quality"; break;
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

        <header className="deo-header">
          <div className="deo-header-icon">⬡</div>
          <h1 className="deo-title">Paint<span>shop</span> OPS</h1>
          <span className="deo-badge">Data Entry Operator</span>
          <button className="deo-logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <div className="deo-body">

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

          <main className="deo-content">

            <div className="deo-section-header">
              <h2 className="deo-section-title">{tabMeta[activeTab].label}</h2>
              <div className="deo-section-line" />
              <span className="deo-section-num">Section {tabMeta[activeTab].num}</span>
            </div>

            {activeTab === "safety" && (
              <>
                <div className="deo-card">
                  <div className="deo-card-title">Incident Metrics</div>
                  <div className="deo-grid-3">
                    <Field label="Near Miss" name="nearmiss" value={formData.safety.nearmiss} onChange={(e) => handleChange("safety", e)} />
                    <Field label="Incidents" name="incidents" value={formData.safety.incidents} onChange={(e) => handleChange("safety", e)} />
                    <Field label="FAC"       name="fac"       value={formData.safety.fac}       onChange={(e) => handleChange("safety", e)} />
                  </div>
                </div>
                <SubmitRow tab="safety" onSubmit={handleSubmit} />
              </>
            )}

            {activeTab === "quality" && (
              <>
                <div className="deo-card">
                  <div className="deo-card-title">Quality Scores</div>
                  <div className="deo-grid-2">
                    <Field label="HS"    name="hs"    value={formData.quality.hs}    onChange={(e) => handleChange("quality", e)} />
                    <Field label="Punch" name="punch" value={formData.quality.punch} onChange={(e) => handleChange("quality", e)} />
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
                            value={issue.description}
                            onChange={(e) => handleQualityTopIssues(index, "description", e.target.value)}
                          />
                        </div>
                        <div className="deo-field">
                          <label className="deo-label">Count</label>
                          <input
                            type="number"
                            placeholder="—"
                            className="deo-input"
                            value={issue.number}
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

            {activeTab === "delivery" && (
              <>
                <div className="deo-card">
                  <div className="deo-card-title">Paintshop In</div>
                  <div className="deo-grid-3">
                    <Field label="A Shift In" name="ashiftin" value={formData.delivery.ashiftin} onChange={(e) => handleChange("delivery", e)} />
                    <Field label="B Shift In" name="bshiftin" value={formData.delivery.bshiftin} onChange={(e) => handleChange("delivery", e)} />
                    <Field label="C Shift In" name="cshiftin" value={formData.delivery.cshiftin} onChange={(e) => handleChange("delivery", e)} />
                  </div>
                </div>

                <div className="deo-card">
                  <div className="deo-card-title">Paintshop Out</div>
                  <div className="deo-grid-3">
                    <Field label="A Shift Out" name="ashiftout" value={formData.delivery.ashiftout} onChange={(e) => handleChange("delivery", e)} />
                    <Field label="B Shift Out" name="bshiftout" value={formData.delivery.bshiftout} onChange={(e) => handleChange("delivery", e)} />
                    <Field label="C Shift Out" name="cshiftout" value={formData.delivery.cshiftout} onChange={(e) => handleChange("delivery", e)} />
                  </div>
                </div>

                <div className="deo-card">
                  <div className="deo-card-title">Production</div>
                  <div className="deo-grid-2">
                    <Field label="Topcoat Cycles"  name="topcoatcycles"  value={formData.delivery.topcoatcycles}  onChange={(e) => handleChange("delivery", e)} />
                    <Field label="Surfacer Cycles"  name="surfacercycles" value={formData.delivery.surfacercycles} onChange={(e) => handleChange("delivery", e)} />
                    <Field label="BIW Production"   name="biwproduction"  value={formData.delivery.biwproduction}  onChange={(e) => handleChange("delivery", e)} />
                    <Field label="TCF Production"   name="tcfproduction"  value={formData.delivery.tcfproduction}  onChange={(e) => handleChange("delivery", e)} />
                  </div>
                </div>
                <SubmitRow tab="delivery" onSubmit={handleSubmit} />
              </>
            )}

            {activeTab === "cost" && (
              <>
                <div className="deo-card">
                  <div className="deo-card-title">Consumption & Overheads</div>
                  <div className="deo-grid-2">
                    <Field label="Power Consumption"   name="powerConsumption"   value={formData.cost.powerConsumption}   onChange={(e) => handleChange("cost", e)} />
                    <Field label="Gas Consumption"     name="gasConsumption"     value={formData.cost.gasConsumption}     onChange={(e) => handleChange("cost", e)} />
                    <Field label="IDM Consumption"     name="idmConsumption"     value={formData.cost.idmConsumption}     onChange={(e) => handleChange("cost", e)} />
                    <Field label="Thinner Consumption" name="thinnerConsumption" value={formData.cost.thinnerConsumption} onChange={(e) => handleChange("cost", e)} />
                    <Field label="OT Nos"              name="otNos"              value={formData.cost.otNos}              onChange={(e) => handleChange("cost", e)} />
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