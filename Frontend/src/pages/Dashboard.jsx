import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

// ── Department colour themes ───────────────────────────────────────────────────
const DEPT_PALETTE = [
  { bg: "#FFF7ED", border: "#FB923C", text: "#9A3412", dot: "#F97316", avatar: "#EA580C" },
  { bg: "#EFF6FF", border: "#60A5FA", text: "#1E40AF", dot: "#3B82F6", avatar: "#2563EB" },
  { bg: "#F0FDF4", border: "#4ADE80", text: "#166534", dot: "#22C55E", avatar: "#16A34A" },
  { bg: "#FDF4FF", border: "#C084FC", text: "#6B21A8", dot: "#A855F7", avatar: "#9333EA" },
  { bg: "#FFF1F2", border: "#FB7185", text: "#9F1239", dot: "#F43F5E", avatar: "#E11D48" },
  { bg: "#F0FDFA", border: "#2DD4BF", text: "#134E4A", dot: "#14B8A6", avatar: "#0D9488" },
];

// ── Tiny UI primitives ────────────────────────────────────────────────────────
const Badge = ({ value, low, high, labels = ["Low", "Moderate", "High"], reverse = false }) => {
  const styles = [
    { bg: "#DCFCE7", color: "#166534" },
    { bg: "#FEF9C3", color: "#854D0E" },
    { bg: "#FEE2E2", color: "#991B1B" },
  ];
  let idx = value <= low ? 0 : value <= high ? 1 : 2;
  if (reverse) idx = value >= low ? 0 : value >= high ? 1 : 2;
  return (
    <span style={{
      display: "inline-block", marginTop: 6, fontSize: 11, fontWeight: 700,
      padding: "2px 9px", borderRadius: 99,
      background: styles[idx].bg, color: styles[idx].color, letterSpacing: "0.03em",
    }}>
      {labels[idx]}
    </span>
  );
};

const MetricCard = ({ label, value, unit, accent, children }) => (
  <div
    style={{
      background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12,
      padding: "16px 18px", position: "relative", overflow: "hidden",
      transition: "box-shadow 0.2s, transform 0.15s",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
      e.currentTarget.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.transform = "none";
    }}
  >
    <div style={{
      position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
      background: accent, borderRadius: "12px 0 0 12px",
    }} />
    <p style={{
      fontSize: 11, color: "#64748B", marginBottom: 6,
      fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em",
    }}>
      {label}
    </p>
    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
      <span style={{ fontSize: 26, fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>
        {value === null || value === undefined
          ? "—"
          : typeof value === "number"
          ? value.toLocaleString()
          : value}
      </span>
      {unit && <span style={{ fontSize: 12, color: "#94A3B8" }}>{unit}</span>}
    </div>
    {children}
  </div>
);

const ShiftRow = ({ label, ashift, bshift, cshift }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
    <span style={{ fontSize: 12, color: "#64748B", width: 110, flexShrink: 0 }}>{label}</span>
    {[["A", ashift], ["B", bshift], ["C", cshift]].map(([s, v]) => (
      <div key={s} style={{
        flex: 1, background: "#F8FAFC", border: "1px solid #E2E8F0",
        borderRadius: 8, padding: "6px 10px", textAlign: "center",
      }}>
        <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, marginBottom: 2 }}>
          Shift {s}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
          {v ?? "—"}
        </div>
      </div>
    ))}
  </div>
);

const SectionTitle = ({ label, color, icon }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
    <div style={{
      width: 28, height: 28, borderRadius: 8,
      background: color + "22",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
    }}>
      {icon}
    </div>
    <span style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", letterSpacing: "-0.2px" }}>
      {label}
    </span>
  </div>
);

const Divider = () => (
  <div style={{ borderTop: "1px solid #F1F5F9", margin: "22px 0" }} />
);

const EmptyState = ({ label }) => (
  <div style={{
    textAlign: "center", padding: "28px 20px",
    background: "#F8FAFC", borderRadius: 10, border: "1px dashed #CBD5E1",
  }}>
    <div style={{ fontSize: 26, marginBottom: 8 }}>📭</div>
    <p style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>
      No {label} data for this period
    </p>
  </div>
);

const Skeleton = () => (
  <>
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{
          height: 90, borderRadius: 12,
          background: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)",
          backgroundSize: "200% 100%",
          animation: `shimmer 1.4s ${i * 0.1}s infinite`,
        }} />
      ))}
    </div>
  </>
);

// ── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [filter, setFilter]         = useState("daily");
  const [data, setData]             = useState({});
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [activeDept, setActiveDept] = useState(null); // stores dept _id or null

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/dashboard?filter=${filter}`
      );
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
  const selectedDept = activeDept
    ? departments.find(d => d._id === activeDept)
    : null;
  const deptIndex    = selectedDept
    ? departments.findIndex(d => d._id === activeDept) % DEPT_PALETTE.length
    : 0;
  const deptColor    = selectedDept ? DEPT_PALETTE[deptIndex] : null;

  // ── section renderers ─────────────────────────────────────────────────────
  const renderSafety = () => {
    const items = data?.safety;
    if (!items?.length) return <EmptyState label="safety" />;
    return items.map((s, i) => (
      <div key={s._id || i}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12 }}>
        <MetricCard label="Near misses" value={s.nearmiss} accent="#EF4444">
          <Badge value={s.nearmiss} low={3} high={8} />
        </MetricCard>
        <MetricCard label="Incidents" value={s.incidents} accent="#EF4444">
          <Badge value={s.incidents} low={0} high={2} />
        </MetricCard>
        <MetricCard label="FAC" value={s.fac} accent="#EF4444">
          <Badge value={s.fac} low={5} high={15} />
        </MetricCard>
      </div>
    ));
  };

  const renderQuality = () => {
    const items = data?.quality;
    if (!items?.length) return <EmptyState label="quality" />;
    return items.map((q, i) => (
      <div key={q._id || i}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
          gap: 12, marginBottom: 16,
        }}>
          <MetricCard label="HS Score" value={q.hs} unit="%" accent="#3B82F6">
            <Badge value={q.hs} low={80} high={90} labels={["Poor", "Fair", "Good"]} reverse />
          </MetricCard>
          <MetricCard label="Punch items" value={q.punch} accent="#3B82F6">
            <Badge value={q.punch} low={10} high={30} />
          </MetricCard>
        </div>

        {q.topIssues?.length > 0 && (
          <>
            <p style={{
              fontSize: 11, fontWeight: 700, color: "#94A3B8",
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10,
            }}>
              Top issues
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.topIssues.map((issue, idx) => (
                <div key={idx} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#F8FAFC", borderRadius: 8,
                  padding: "10px 14px", border: "1px solid #E2E8F0",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, background: "#DBEAFE",
                      color: "#1E40AF", fontSize: 11, fontWeight: 700, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: 13, color: "#334155" }}>{issue.description}</span>
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: "#1E40AF",
                    background: "#DBEAFE", padding: "2px 10px", borderRadius: 99,
                  }}>
                    {issue.number}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    ));
  };

  const renderDelivery = () => {
    const items = data?.delivery;
    if (!items?.length) return <EmptyState label="delivery" />;
    return items.map((d, i) => (
      <div key={d._id || i}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
          gap: 12, marginBottom: 20,
        }}>
          <MetricCard label="Topcoat cycles"  value={d.topcoatcycles}  unit="cyc"   accent="#10B981" />
          <MetricCard label="Surfacer cycles" value={d.surfacercycles} unit="cyc"   accent="#10B981" />
          <MetricCard label="BIW production"  value={d.biwproduction}  unit="units" accent="#10B981" />
          <MetricCard label="TCF production"  value={d.tcfproduction}  unit="units" accent="#10B981" />
        </div>

        {(d.paintshopin?.length > 0 || d.paintshopout?.length > 0) && (
          <div style={{
            background: "#F8FAFC", borderRadius: 12,
            padding: "16px 18px", border: "1px solid #E2E8F0",
          }}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: "#94A3B8",
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14,
            }}>
              Shift breakdown
            </p>
            {d.paintshopin?.map((row, ri) => (
              <ShiftRow key={`in-${ri}`} label="Paint shop IN"
                ashift={row.ashift} bshift={row.bshift} cshift={row.cshift} />
            ))}
            {d.paintshopout?.map((row, ri) => (
              <ShiftRow key={`out-${ri}`} label="Paint shop OUT"
                ashift={row.ashift} bshift={row.bshift} cshift={row.cshift} />
            ))}
          </div>
        )}
      </div>
    ));
  };

  const renderCost = () => {
    const items = data?.cost;
    if (!items?.length) return <EmptyState label="cost" />;
    return items.map((c, i) => (
      <div key={c._id || i}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12 }}>
        <MetricCard label="Power"   value={c.powerConsumption}   unit="kWh" accent="#F59E0B" />
        <MetricCard label="Gas"     value={c.gasConsumption}     unit="m³"  accent="#F59E0B" />
        <MetricCard label="IDM"     value={c.idmConsumption}     unit="L"   accent="#F59E0B" />
        <MetricCard label="Thinner" value={c.thinnerConsumption} unit="L"   accent="#F59E0B" />
        <MetricCard label="OT nos"  value={c.otNos}                         accent="#F59E0B" />
      </div>
    ));
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#F1F5F9",
      fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: "28px 16px",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* ── HEADER ── */}
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16, marginBottom: 24,
        }}>
          <div>
            <p style={{
              fontSize: 11, fontWeight: 700, color: "#94A3B8",
              letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4,
            }}>
              Operations
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.5px", margin: 0 }}>
              SQDC Dashboard
            </h1>
          </div>

          {/* Time filter */}
          <div style={{
            display: "flex", gap: 4, background: "#FFFFFF",
            border: "1px solid #E2E8F0", borderRadius: 10, padding: 4,
          }}>
            {["daily", "weekly", "monthly"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "6px 18px", borderRadius: 7, border: "none",
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.15s", textTransform: "capitalize",
                background: filter === f ? "#0F172A" : "transparent",
                color:      filter === f ? "#FFFFFF"  : "#64748B",
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── DEPARTMENT SELECTOR ── */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E2E8F0",
          borderRadius: 14, padding: "18px 20px", marginBottom: 18,
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: "#94A3B8",
            textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
          }}>
            Filter by department
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>

            {/* All */}
            <button onClick={() => setActiveDept(null)} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "7px 16px", borderRadius: 99, fontFamily: "inherit",
              border:      `1.5px solid ${activeDept === null ? "#0F172A" : "#E2E8F0"}`,
              background:  activeDept === null ? "#0F172A" : "#FFFFFF",
              color:       activeDept === null ? "#FFFFFF"  : "#64748B",
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: activeDept === null ? "#FFFFFF" : "#94A3B8",
              }} />
              All departments
            </button>

            {departments.map((dept, idx) => {
              const c = DEPT_PALETTE[idx % DEPT_PALETTE.length];
              const isActive = activeDept === dept._id;
              return (
                <button
                  key={dept._id}
                  onClick={() => setActiveDept(isActive ? null : dept._id)}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = c.border; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = "#E2E8F0"; }}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "7px 16px", borderRadius: 99, fontFamily: "inherit",
                    border:     `1.5px solid ${isActive ? c.border : "#E2E8F0"}`,
                    background: isActive ? c.bg     : "#FFFFFF",
                    color:      isActive ? c.text   : "#475569",
                    fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: c.dot, flexShrink: 0,
                  }} />
                  {dept.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── DEPT CONTEXT BANNER ── */}
        {selectedDept && (
          <div style={{
            background: deptColor.bg, border: `1px solid ${deptColor.border}`,
            borderRadius: 12, padding: "14px 20px", marginBottom: 18,
            display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: deptColor.avatar,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "#FFFFFF",
                letterSpacing: "0.05em", flexShrink: 0,
              }}>
                {selectedDept.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: deptColor.text, margin: 0 }}>
                  {selectedDept.name}
                </p>
                <p style={{ fontSize: 12, color: deptColor.text, opacity: 0.75, margin: 0 }}>
                  {selectedDept.description}
                </p>
              </div>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, color: deptColor.text, textTransform: "capitalize",
              background: "rgba(255,255,255,0.65)", padding: "4px 12px",
              borderRadius: 99, letterSpacing: "0.05em",
            }}>
              {filter} view
            </span>
          </div>
        )}

        {/* ── ERROR BANNER ── */}
        {error && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12,
            padding: "14px 18px", marginBottom: 18, color: "#991B1B",
            fontSize: 14, fontWeight: 500,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── MAIN METRICS PANEL ── */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E2E8F0",
          borderRadius: 14, padding: "26px 22px",
        }}>
          {loading ? (
            <Skeleton />
          ) : (
            <>
              <SectionTitle label="Safety"   color="#EF4444" icon="🦺" />
              {renderSafety()}
              <Divider />

              <SectionTitle label="Quality"  color="#3B82F6" icon="✅" />
              {renderQuality()}
              <Divider />

              <SectionTitle label="Delivery" color="#10B981" icon="🚚" />
              {renderDelivery()}
              <Divider />

              <SectionTitle label="Cost"     color="#F59E0B" icon="⚡" />
              {renderCost()}
            </>
          )}
        </div>

        {/* ── FOOTER ── */}
        <p style={{ textAlign: "center", fontSize: 12, color: "#CBD5E1", marginTop: 24 }}>
          Last refreshed · {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          {" · "}
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={fetchData}
          >
            Refresh
          </span>
        </p>

      </div>
    </div>
  );
};

export default Dashboard;