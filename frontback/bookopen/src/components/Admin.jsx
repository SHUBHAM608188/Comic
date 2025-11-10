import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        username,
        password,
      });

      if (res.data.message === "Login successful") {
        setMessage("✅ Login successful!");
        navigate("/dashboard"); // redirect to admin dashboard
      }
    } catch (err) {
      if (err.response) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage("❌ Server error");
      }
    }
  };

  return (
    <div className="admin-page">
      {/* Banner/Header */}
      <div className="shubham-sold-out">
        <header> 👨🏻‍💻 Administration</header>
      </div>

      {/* Login Form */}
      <div className="auth-container">
        <h2>Administration</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {message && <p className="error">{message}</p>}
        </form>

        {/* Back to Home Link */}
        <p className="back-home">
          <a href="/" style={{ textDecoration: "none", color: "#2a2046" }}>
            ← Back to Home
          </a>
        </p>
      </div>
    </div>
  );
};

export default Admin;
