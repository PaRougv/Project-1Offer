import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api.js";
import "../styles/Management.css";

const HODManagement = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const load = async () => {
    const response = await axios.get(`${API_URL}/auth/admins`, { withCredentials: true });
    setAdmins(response.data.admins);
  };
  useEffect(() => { load().catch(() => setMessage("Unable to load administrators.")); }, []);

  const createAdmin = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/admins`, form, { withCredentials: true });
      setForm({ name: "", email: "", password: "" });
      setMessage("Administrator created.");
      await load();
    } catch (error) { setMessage(error.response?.data?.message || "Unable to create administrator."); }
  };

  const signOut = async () => {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    navigate("/login");
  };

  const deactivateAdmin = async (id) => {
    try {
      await axios.post(`${API_URL}/auth/deactivate/admin/${id}`, {}, { withCredentials: true });
      setMessage("Administrator deactivated.");
      await load();
    } catch (error) { setMessage(error.response?.data?.message || "Unable to deactivate administrator."); }
  };

  return <main className="management-root"><header className="management-header"><div><p className="management-kicker">Department control</p><h1>HOD workspace</h1></div><button onClick={signOut}>Sign out</button></header>{message && <p className="management-message">{message}</p>}<div className="management-grid"><form className="management-panel" onSubmit={createAdmin}><h2>New administrator</h2><input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /><input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /><div className="password-field"><input type={showPassword ? "text" : "password"} placeholder="Temporary password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button></div><button className="management-primary">Create admin</button></form><section className="management-panel"><h2>Admins in your department</h2>{admins.map(item => <div className="management-row" key={item._id}><div><strong>{item.name}</strong><span>{item.email}</span></div><button className="management-action" disabled={!item.isActive} onClick={() => deactivateAdmin(item._id)}>{item.isActive ? "Deactivate" : "Inactive"}</button></div>)}</section></div></main>;
};

export default HODManagement;
