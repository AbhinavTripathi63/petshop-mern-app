import React, { useEffect, useMemo, useState } from "react";
import client from "../api/client";

const empty = {
  name: "",
  description: "",
  price: 0,
  available: true
};

export default function ManageServices() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [q, setQ] = useState("");

  async function load() {
    const res = await client.get("/services");
    setItems(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((x) => x.name.toLowerCase().includes(s));
  }, [items, q]);

  function startEdit(s) {
    setEditingId(s._id);
    setForm({
      name: s.name || "",
      description: s.description || "",
      price: Number(s.price || 0),
      available: !!s.available
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setEditingId(null);
    setForm(empty);
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return alert("Name required");

    if (editingId) await client.put(`/services/${editingId}`, form);
    else await client.post("/services", form);

    reset();
    load();
  }

  async function del(id) {
    if (!confirm("Delete this service?")) return;
    await client.delete(`/services/${id}`);
    load();
  }

  return (
    <div>
      <div className="row" style={{ alignItems: "baseline" }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Services</h1>
          <p className="muted" style={{ marginTop: 0 }}>
            Manage services like grooming, vet visits and training.
          </p>
        </div>
      </div>

      <div className="adminGrid2">
        {/* FORM */}
        <div className="card">
          <h2 style={{ marginBottom: 6 }}>{editingId ? "Edit Service" : "Add Service"}</h2>

          <form onSubmit={submit}>
            <p>Name</p>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Eg: Grooming"
            />

            <p style={{ marginTop: 10 }}>Description</p>
            <textarea
              className="textarea"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Service details…"
            />

            <p style={{ marginTop: 10 }}>Price</p>
            <input
              className="input"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />

            <div className="row" style={{ marginTop: 10 }}>
              <label className="row" style={{ gap: 8 }}>
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                />
                Available
              </label>

              <div className="row">
                {editingId ? (
                  <button type="button" className="btn secondary" onClick={reset}>
                    Cancel
                  </button>
                ) : null}
                <button className="btn">{editingId ? "Update" : "Create"}</button>
              </div>
            </div>
          </form>
        </div>

        {/* TABLE */}
        <div className="tableWrap">
          <div className="tableTop">
            <div>
              <h2 style={{ margin: 0 }}>All Services</h2>
              <p className="muted">Showing {filtered.length} of {items.length}</p>
            </div>

            <input
              className="input"
              style={{ maxWidth: 280 }}
              placeholder="Search by name…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 56 }}>#</th>
                <th>Name</th>
                <th style={{ width: 110 }}>Price</th>
                <th style={{ width: 140 }}>Availability</th>
                <th style={{ width: 180, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr key={s._id}>
                  <td>{idx + 1}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--text)" }}>{s.name}</div>
                    <div className="muted" style={{ fontSize: 13 }}>
                      {(s.description || "").slice(0, 80)}
                      {s.description && s.description.length > 80 ? "…" : ""}
                    </div>
                  </td>
                  <td>₹{s.price}</td>
                  <td>{s.available ? "Available" : "Unavailable"}</td>
                  <td className="actions">
                    <button className="btn secondary small" onClick={() => startEdit(s)}>
                      Edit
                    </button>
                    <button className="btn danger small" onClick={() => del(s._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="muted" style={{ padding: 14 }}>
                    No services found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
