import React, { useState } from "react";
import axios from "axios";

const DataEntryOperator = () => {
  const [formData, setFormData] = useState({
    nearmiss: "",
    incidents: "",
    fac: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/safety",
        formData
      );

      setMessage("Safety Entry Created Successfully ✅");

      setFormData({
        nearmiss: "",
        incidents: "",
        fac: "",
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Error creating entry ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Safety Data Entry</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Near Miss</label>
          <input
            type="number"
            name="nearmiss"
            value={formData.nearmiss}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Incidents</label>
          <input
            type="number"
            name="incidents"
            value={formData.incidents}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>FAC</label>
          <input
            type="number"
            name="fac"
            value={formData.fac}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Entry"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
  },
  form: {
    maxWidth: "400px",
  },
  inputGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
};

export default DataEntryOperator;