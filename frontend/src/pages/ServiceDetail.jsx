import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import CartContext from "../context/CartContext";

export default function ServiceDetail() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useContext(CartContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get(`/services/${id}`);
        setS(res.data);
      } catch {
        alert("Failed to load service.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="card">Loading…</div>;
  if (!s) return <div className="card">Service not found.</div>;

  return (
    <div className="card">
      <h1>{s.name}</h1>
      <p className="badge">₹{s.price}</p>
      <p>{s.description || "No description yet."}</p>
      <p>{s.available ? "Available ✅" : "Unavailable ❌"}</p>

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
  );
}
