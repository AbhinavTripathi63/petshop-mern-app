import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const res = await client.post("/users/register", form);
      localStorage.setItem("userToken", res.data.token);
      toast.success("Registered ✅");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Register failed");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 460, margin: "30px auto" }}>
      <h2>Create Account</h2>

      <form onSubmit={onSubmit}>
        <p>Name</p>
        <input className="input" name="name" value={form.name} onChange={onChange} required />

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
            Register
          </button>
        </div>
      </form>

      <p style={{ marginTop: 12 }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--accent)" }}>
          Login
        </Link>
      </p>
    </div>
  );
}