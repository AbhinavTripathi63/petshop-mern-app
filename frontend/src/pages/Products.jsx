import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import CartContext from "../context/CartContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyStock, setOnlyStock] = useState(false);

  const { addItem } = useContext(CartContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get("/products");
        setItems(res.data);
      } catch (e) {
        alert("Failed to load products. Is backend running?");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (onlyStock && !p.inStock) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [items, q, maxPrice, onlyStock]);

  if (loading) {
    return (
      <div className="grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1>Products</h1>
      <p className="muted">Search and filter products easily.</p>

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
            checked={onlyStock}
            onChange={(e) => setOnlyStock(e.target.checked)}
          />
          In stock only
        </label>
      </div>

      {/* RESULTS */}
      {filtered.length === 0 ? (
        <div className="card">No matching products.</div>
      ) : (
        <div className="grid">
          {filtered.map((p) => (
            <motion.div
              className="card"
              key={p._id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {p.imageUrl ? (
                <img
                  className="thumb"
                  src={p.imageUrl}
                  alt={p.name}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/600x400?text=No+Image";
                  }}
                />
              ) : null}

              <div className="row" style={{ marginTop: 10 }}>
                <h3 style={{ margin: 0 }}>{p.name}</h3>
                <span className="badge">₹{p.price}</span>
              </div>

              <p className="muted">
                {(p.description || "No description").slice(0, 70)}
                {p.description && p.description.length > 70 ? "…" : ""}
              </p>

              <p>{p.inStock ? "In stock ✅" : "Out of stock ❌"}</p>

              <div className="row">
                <Link className="btn secondary" to={`/products/${p._id}`}>
                  Details
                </Link>

                <button
                  className="btn"
                  disabled={!p.inStock}
                  onClick={() => {
                    addItem({
                      itemType: "product",
                      itemId: p._id,
                      nameSnapshot: p.name,
                      priceSnapshot: p.price
                    });
                    toast.success("Added to cart");
                  }}
                >
                  Add to cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}