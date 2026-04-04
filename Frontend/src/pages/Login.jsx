import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #0d0f12;
    --surface: #13171d;
    --panel:   #1a1f28;
    --border:  #272d38;
    --accent:  #e8c547;
    --danger:  #ff5252;
    --text:    #d4dae6;
    --muted:   #5a6478;
    --label:   #8b95a8;
  }

  .login-root {
    min-height: 100vh;
    background: var(--bg);
    display: grid;
    place-items: center;
    font-family: 'Barlow', sans-serif;
    color: var(--text);
    position: relative;
    overflow: hidden;
  }

  /* subtle grid texture */
  .login-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 48px 48px;
    opacity: 0.25;
    pointer-events: none;
  }

  /* accent glow blob */
  .login-root::after {
    content: '';
    position: fixed;
    top: -160px; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 400px;
    background: radial-gradient(ellipse, rgba(232,197,71,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── Card ── */
  .login-card {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-top: 2px solid var(--accent);
    width: 100%;
    max-width: 420px;
    padding: 0;
    z-index: 1;
  }

  /* corner marks */
  .login-card::before,
  .login-card::after {
    content: '';
    position: absolute;
    width: 10px; height: 10px;
    border-color: var(--accent);
    border-style: solid;
  }
  .login-card::before {
    bottom: -1px; left: -1px;
    border-width: 0 0 2px 2px;
  }
  .login-card::after {
    bottom: -1px; right: -1px;
    border-width: 0 2px 2px 0;
  }

  /* ── Header ── */
  .login-header {
    padding: 32px 36px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }
  .login-hex {
    width: 40px; height: 40px;
    background: var(--accent);
    display: grid; place-items: center;
    font-size: 20px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .login-header-text {}
  .login-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #fff;
    line-height: 1;
    margin-bottom: 5px;
  }
  .login-title span { color: var(--accent); }
  .login-subtitle {
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  /* ── Form body ── */
  .login-form {
    padding: 28px 36px 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .login-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .login-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--label);
  }
  .login-input-wrap {
    position: relative;
  }
  .login-input-icon {
    position: absolute;
    left: 12px; top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: var(--muted);
    pointer-events: none;
    line-height: 1;
  }
  .login-input {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: 'Barlow', sans-serif;
    font-size: 14px;
    padding: 11px 14px 11px 38px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .login-input::placeholder { color: var(--muted); }
  .login-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(232,197,71,0.12);
  }

  /* ── Error ── */
  .login-error {
    background: rgba(255,82,82,0.08);
    border: 1px solid rgba(255,82,82,0.3);
    border-left: 3px solid var(--danger);
    color: #ff7b7b;
    font-size: 12px;
    padding: 10px 14px;
    letter-spacing: 0.3px;
  }

  /* ── Submit ── */
  .login-btn {
    all: unset;
    box-sizing: border-box;
    margin-top: 6px;
    cursor: pointer;
    background: var(--accent);
    color: #0d0f12;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800;
    font-size: 13px;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 13px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.15s, transform 0.1s;
    width: 100%;
  }
  .login-btn:hover:not(:disabled) { background: #f5d45a; }
  .login-btn:active:not(:disabled) { transform: scale(0.99); }
  .login-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .login-btn-spinner {
    width: 12px; height: 12px;
    border: 2px solid rgba(0,0,0,0.3);
    border-top-color: #0d0f12;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Footer ── */
  .login-footer {
    border-top: 1px solid var(--border);
    padding: 14px 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .login-footer-text {
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .login-footer-badge {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    letter-spacing: 1.5px;
    color: var(--accent);
    text-transform: uppercase;
    opacity: 0.7;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { withCredentials: true }
      );

      console.log("Login Success:", response.data.user);
      const role = response.data.user.role;

      if (role === "HOD")        navigate("/dashboard");
      else if (role === "ADMIN") navigate("/admin");
      else                       navigate("/login");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="login-root">
        <div className="login-card">

          {/* Header */}
          <div className="login-header">
            <div className="login-hex">⬡</div>
            <div className="login-header-text">
              <h2 className="login-title">Paint<span>shop</span> OPS</h2>
              <p className="login-subtitle">Operator Authentication</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">

            {error && <div className="login-error">⚠ {error}</div>}

            <div className="login-field">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">✉</span>
                <input
                  type="email"
                  name="email"
                  placeholder="operator@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="login-input"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="login-input"
                  required
                />
              </div>
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading
                ? <><div className="login-btn-spinner" /> Authenticating...</>
                : <>↑ Secure Login</>
              }
            </button>

          </form>

          {/* Footer */}
          <div className="login-footer">
            <span className="login-footer-text">© 2026 Data Entry Application</span>
            <span className="login-footer-badge">⬡ OPS v1.0</span>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;