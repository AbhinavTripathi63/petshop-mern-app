import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import CartContext from "../context/CartContext";

export default function Services() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const { addItem } = useContext(CartContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get("/services");
        setItems(res.data);
      } catch {
        alert("Failed to load services. Is backend running?");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((s) => {
      if (onlyAvailable && !s.available) return false;
      if (maxPrice && s.price > Number(maxPrice)) return false;
      if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [items, q, maxPrice, onlyAvailable]);

  if (loading) return <div className="card">Loading services…</div>;

  return (
    <div>
      <h1>Services</h1>
      <p className="muted">Find the right service for your pet.</p>

      {/* FILTERS */}
      <div className="filterBar">
        <input
          className="input"
          placeholder="Search by name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <input
          className="input"
          type="number"
          placeholder="Max price (₹)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <label className="row" style={{ gap: 8 }}>
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          Available only
        </label>
      </div>

      {/* RESULTS */}
      {filtered.length === 0 ? (
        <div className="card">No matching services.</div>
      ) : (
        <div className="grid">
          {filtered.map((s) => (
            <div className="card" key={s._id}>
              <div className="row">
                <h3 style={{ margin: 0 }}>{s.name}</h3>
                <span className="badge">₹{s.price}</span>
              </div>

              <p className="muted">
                {(s.description || "No description").slice(0, 80)}
                {s.description && s.description.length > 80 ? "…" : ""}
              </p>

              <p>{s.available ? "Available ✅" : "Unavailable ❌"}</p>

              <div className="row">
                <Link className="btn secondary" to={`/services/${s._id}`}>
                  Details
                </Link>

                <button
                  className="btn"
                  disabled={!s.available}
                  onClick={() =>
                    addItem({
                      itemType: "service",
                      itemId: s._id,
                      nameSnapshot: s.name,
                      priceSnapshot: s.price
                    })
                  }
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
