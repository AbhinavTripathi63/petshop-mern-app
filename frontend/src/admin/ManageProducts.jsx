import React, { useEffect, useMemo, useState } from "react";
import client from "../api/client";

const empty = {
  name: "",
  price: 0,
  imageUrl: "",
  inStock: true,
  description: ""
};

export default function ManageProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [q, setQ] = useState("");

  async function load() {
    const res = await client.get("/products");
    setItems(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((p) => p.name.toLowerCase().includes(s));
  }, [items, q]);

  function startEdit(p) {
    setEditingId(p._id);
    setForm({
      name: p.name || "",
      price: Number(p.price || 0),
      imageUrl: p.imageUrl || "",
      inStock: !!p.inStock,
      description: p.description || ""
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

    if (editingId) await client.put(`/products/${editingId}`, form);
    else await client.post("/products", form);

    reset();
    load();
  }

  async function del(id) {
    if (!confirm("Delete this product?")) return;
    await client.delete(`/products/${id}`);
    load();
  }

  return (
    <div>
      <div className="row" style={{ alignItems: "baseline" }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Products</h1>
          <p className="muted" style={{ marginTop: 0 }}>
            Add, update, or delete products.
          </p>
        </div>
      </div>

      <div className="adminGrid2">
        {/* FORM */}
        <div className="card">
          <h2 style={{ marginBottom: 6 }}>{editingId ? "Edit Product" : "Add Product"}</h2>
          <p className="muted" style={{ marginTop: 0 }}>
            Keep image as a URL for simplicity.
          </p>

          <form onSubmit={submit}>
            <p>Name</p>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Eg: Premium Dog Food"
            />

            <p style={{ marginTop: 10 }}>Price</p>
            <input
              className="input"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />

            <p style={{ marginTop: 10 }}>Image URL</p>
            <input
              className="input"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
            />

            <p style={{ marginTop: 10 }}>Description</p>
            <textarea
              className="textarea"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description…"
            />

            <div className="row" style={{ marginTop: 10 }}>
              <label className="row" style={{ gap: 8 }}>
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                />
                In stock
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
              <h2 style={{ margin: 0 }}>All Products</h2>
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
                <th style={{ width: 120 }}>Stock</th>
                <th style={{ width: 180, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr key={p._id}>
                  <td>{idx + 1}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--text)" }}>{p.name}</div>
                    <div className="muted" style={{ fontSize: 13 }}>
                      {(p.description || "").slice(0, 70)}
                      {p.description && p.description.length > 70 ? "…" : ""}
                    </div>
                  </td>
                  <td>₹{p.price}</td>
                  <td>{p.inStock ? "In stock" : "Out"}</td>
                  <td className="actions">
                    <button className="btn secondary small" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button className="btn danger small" onClick={() => del(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="muted" style={{ padding: 14 }}>
                    No products found.
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
