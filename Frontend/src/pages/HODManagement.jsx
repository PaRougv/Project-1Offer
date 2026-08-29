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
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const load = async (nextPage = page) => {
    const response = await axios.get(`${API_URL}/auth/admins?page=${nextPage}&limit=5`, { withCredentials: true });
    setAdmins(response.data.admins || []);
    setPagination({
      page: response.data.page || 1,
      totalPages: response.data.totalPages || 1,
      total: response.data.total || 0,
    });
  };

  useEffect(() => { load(page).catch(() => setMessage("Unable to load administrators.")); }, [page]);

  const createAdmin = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/admins`, form, { withCredentials: true });
      setForm({ name: "", email: "", password: "" });
      setMessage("Administrator created.");
      await load(1);
      setPage(1);
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
      await load(page);
    } catch (error) { setMessage(error.response?.data?.message || "Unable to deactivate administrator."); }
  };

  const reactivateAdmin = async (id) => {
    try {
      await axios.post(`${API_URL}/auth/activate/admin/${id}`, {}, { withCredentials: true });
      setMessage("Administrator reactivated.");
      await load(page);
    } catch (error) { setMessage(error.response?.data?.message || "Unable to reactivate administrator."); }
  };

  return (
    <main className="management-root">
      <header className="management-header"><div><p className="management-kicker">Department control</p><h1>HOD workspace</h1></div><button onClick={signOut}>Sign out</button></header>
      {message && <p className="management-message">{message}</p>}
      <div className="management-grid">
        <form className="management-panel" onSubmit={createAdmin}><h2>New administrator</h2><input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /><input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /><div className="password-field"><input type={showPassword ? "text" : "password"} placeholder="Temporary password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button></div><button className="management-primary">Create admin</button></form>
        <section className="management-panel"><h2>Admins in your department</h2>{admins.map(item => <div className="management-row" key={item._id}><div><strong>{item.name}</strong><span>{item.email}</span></div><button className="management-action" onClick={() => item.isActive ? deactivateAdmin(item._id) : reactivateAdmin(item._id)}>{item.isActive ? "Deactivate" : "Reactivate"}</button></div>)}{admins.length > 0 && <div className="management-pagination"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button><span>Page {pagination.page} / {pagination.totalPages}</span><button type="button" disabled={page >= pagination.totalPages} onClick={() => setPage((value) => Math.min(pagination.totalPages, value + 1))}>Next</button></div>}</section>
      </div>
    </main>
  );
};

export default HODManagement;
