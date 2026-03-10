import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const res = await client.post("/users/login", form);
      localStorage.setItem("userToken", res.data.token);
      toast.success("Logged in ✅");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 460, margin: "30px auto" }}>
      <h2>Login</h2>

      <form onSubmit={onSubmit}>
        <p>Email</p>
        <input
          className="input"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          required
        />

        <p>Password</p>
        <input
          className="input"
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          required
        />

        <div style={{ marginTop: 14 }}>
          <button className="btn" type="submit">
            Login
          </button>
        </div>
      </form>

      <p style={{ marginTop: 12 }}>
        Don’t have an account?{" "}
        <Link to="/register" style={{ color: "var(--accent)" }}>
          Register
        </Link>
      </p>
    </div>
  );
}