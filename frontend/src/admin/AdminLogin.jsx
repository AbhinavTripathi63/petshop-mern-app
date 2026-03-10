import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@petshop.com");
  const [password, setPassword] = useState("admin123");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await client.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin/dashboard");
    } catch {
      alert("Login failed. Check credentials or seed admin again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: "18px auto" }}>
      <h1>Admin Login</h1>
      <p>Login to manage products, services and orders.</p>

      <form onSubmit={login}>
        <p>Email</p>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />

        <p style={{ marginTop: 10 }}>Password</p>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" disabled={busy}>
            {busy ? "Logging in…" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
