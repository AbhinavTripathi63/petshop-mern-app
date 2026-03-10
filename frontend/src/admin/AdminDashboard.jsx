import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [meta, setMeta] = useState({ products: 0, services: 0 });
  const [busy, setBusy] = useState(false);

  async function loadAll() {
    try {
      const [o, p, s] = await Promise.all([
        client.get("/orders/stats/summary"),
        client.get("/products"),
        client.get("/services")
      ]);
      setStats(o.data);
      setMeta({ products: p.data.length, services: s.data.length });
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function addSampleData() {
    setBusy(true);
    try {
      const res = await client.post("/admin/seed-sample");
      alert(res.data.message || "Done!");
      await loadAll();
    } catch {
      alert("Failed. Are you logged in as admin and backend running?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="row" style={{ alignItems: "baseline" }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Dashboard</h1>
          <p className="muted" style={{ marginTop: 0 }}>
            Overview of your store.
          </p>
        </div>
        <button className="btn secondary" onClick={loadAll}>
          Refresh
        </button>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Products</h2>
          <p className="muted">Total products</p>
          <h1 style={{ marginTop: 0 }}>{meta.products}</h1>
          <Link className="btn secondary" to="/admin/products">
            Manage Products
          </Link>
        </div>

        <div className="card">
          <h2>Services</h2>
          <p className="muted">Total services</p>
          <h1 style={{ marginTop: 0 }}>{meta.services}</h1>
          <Link className="btn secondary" to="/admin/services">
            Manage Services
          </Link>
        </div>

        <div className="card">
          <h2>Orders</h2>
          <p className="muted">Total orders</p>
          <h1 style={{ marginTop: 0 }}>{stats.totalOrders}</h1>
          <p className="muted">Revenue: ₹{stats.totalRevenue}</p>
          <Link className="btn secondary" to="/admin/orders">
            View Orders
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="row">
          <div>
            <h2 style={{ marginBottom: 6 }}>Sample Data</h2>
            <p className="muted" style={{ marginTop: 0 }}>
              Adds starter products and services (only when DB is empty).
            </p>
          </div>
          <button className="btn" onClick={addSampleData} disabled={busy}>
            {busy ? "Adding…" : "Add Sample Data"}
          </button>
        </div>
      </div>
    </div>
  );
}
