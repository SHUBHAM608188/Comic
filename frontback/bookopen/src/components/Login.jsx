// frontend/src/components/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      // ✅ Save JWT token for authenticated routes (cart, profile, etc.)
      localStorage.setItem("token", response.data.token);

      setMessage("✅ Login successful!");
      navigate("/card"); // redirect to cart page after login
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.response?.data?.message || "❌ Login failed. Try again.");
    }
  };

  return (
        <div className="admin-page">
    {/* Banner/Header */}
    <div className="shubham-sold-out">
    <header>🔐 User Login</header>
    </div>
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <p>Don't have an account? <a href="/register">Register here</a></p>
      <p className="back-home">
      <a href="/" style={{ textDecoration: "none", color: "#2a2046" }}>
      ← Back to Home
      </a>
    </p>
    </div>
    </div>
  );
};

export default Login;
