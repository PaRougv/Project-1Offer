import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api.js";
import "../styles/Management.css";

const PlantHead = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [hods, setHods] = useState([]);
  const [department, setDepartment] = useState({ name: "", description: "" });
  const [hod, setHod] = useState({ name: "", email: "", password: "", department: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const load = async () => {
    const [departmentRes, hodRes] = await Promise.all([
      axios.get(`${API_URL}/departments`, { withCredentials: true }),
      axios.get(`${API_URL}/auth/hods`, { withCredentials: true }),
    ]);
    setDepartments(departmentRes.data.departments);
    setHods(hodRes.data.hods);
  };

  useEffect(() => { load().catch(() => setMessage("Unable to load plant data.")); }, []);

  const createDepartment = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_URL}/departments`, department, { withCredentials: true });
      setDepartment({ name: "", description: "" });
      setMessage("Department created.");
      await load();
    } catch (error) { setMessage(error.response?.data?.message || "Unable to create department."); }
  };

  const createHod = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/hods`, hod, { withCredentials: true });
      setHod({ name: "", email: "", password: "", department: "" });
      setMessage("HOD created.");
      await load();
    } catch (error) { setMessage(error.response?.data?.message || "Unable to create HOD."); }
  };

  const deactivateHod = async (id) => {
    try {
      await axios.post(`${API_URL}/auth/deactivate/hod/${id}`, {}, { withCredentials: true });
      setMessage("HOD deactivated.");
      await load();
    } catch (error) { setMessage(error.response?.data?.message || "Unable to deactivate HOD."); }
  };

  return (
    <main className="management-root">
      <header className="management-header"><div><p className="management-kicker">Plant control</p><h1>Plant Head</h1></div><button onClick={() => navigate("/login")}>Sign out</button></header>
      {message && <p className="management-message">{message}</p>}
      <div className="management-grid">
        <form className="management-panel" onSubmit={createDepartment}><h2>New department</h2><input placeholder="Department name" value={department.name} onChange={e => setDepartment({ ...department, name: e.target.value })} required /><input placeholder="Description" value={department.description} onChange={e => setDepartment({ ...department, description: e.target.value })} required /><button className="management-primary">Create department</button></form>
        <form className="management-panel" onSubmit={createHod}><h2>New HOD</h2><input placeholder="Full name" value={hod.name} onChange={e => setHod({ ...hod, name: e.target.value })} required /><input type="email" placeholder="Email" value={hod.email} onChange={e => setHod({ ...hod, email: e.target.value })} required /><div className="password-field"><input type={showPassword ? "text" : "password"} placeholder="Temporary password" value={hod.password} onChange={e => setHod({ ...hod, password: e.target.value })} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button></div><select value={hod.department} onChange={e => setHod({ ...hod, department: e.target.value })} required><option value="">Choose department</option>{departments.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}</select><button className="management-primary">Create HOD</button></form>
      </div>
      <section className="management-panel"><h2>HODs in this plant</h2>{hods.map(item => <div className="management-row" key={item._id}><div><strong>{item.name}</strong><span>{item.email} · {item.department?.name || "No department"}</span></div><button className="management-action" disabled={!item.isActive} onClick={() => deactivateHod(item._id)}>{item.isActive ? "Deactivate" : "Inactive"}</button></div>)}</section>
    </main>
  );
};

export default PlantHead;
