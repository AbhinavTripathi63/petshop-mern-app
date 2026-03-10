import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import CartContext from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useContext(CartContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get(`/products/${id}`);
        setP(res.data);
      } catch {
        alert("Failed to load product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="card">Loading…</div>;
  if (!p) return <div className="card">Product not found.</div>;

  return (
    <div className="card">
      <h1>{p.name}</h1>
      <p className="badge">₹{p.price}</p>

      {p.imageUrl ? <img className="thumb" src={p.imageUrl} alt={p.name} /> : null}

      <p style={{ marginTop: 10 }}>{p.description || "No description yet."}</p>
      <p>{p.inStock ? "In stock ✅" : "Out of stock ❌"}</p>

      <button
        className="btn"
        disabled={!p.inStock}
        onClick={() =>
          addItem({
            itemType: "product",
            itemId: p._id,
            nameSnapshot: p.name,
            priceSnapshot: p.price
          })
        }
      >
        Add to cart
      </button>
    </div>
  );
}
