import React, { useEffect, useState } from "react";
import client from "../api/client";
import toast from "react-hot-toast";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("userToken");
  useEffect(() => {
    (async () => {
      try {
        const res = await client.get("/orders/my");
        setOrders(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="card">Loading your orders…</div>;

  if (!orders.length) {
    return (
      <div className="card">
        <h2>No orders yet</h2>
        <p className="muted">Place an order and it will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>My Orders</h1>
      <p className="muted">Your recent orders (latest first).</p>

      {orders.map((o) => (
        <div key={o._id} className="orderRow">
          <div className="orderHead">
            <div>
              <b>Order #{o._id.slice(-6).toUpperCase()}</b>
              <div className="muted">
                {new Date(o.createdAt).toLocaleString()}
              </div>
            </div>

            <div>
              <span className="badge">₹{o.total}</span>
            </div>

            <div>
              <span className={`badgeStatus ${o.status}`}>
                {o.status.replace("_", " ")}
              </span>
            </div>
          </div>

          <div className="orderItems">
            {o.items.map((it, idx) => (
              <div key={idx} className="row" style={{ marginBottom: 6 }}>
                <div>
                  <b>{it.nameSnapshot}</b>{" "}
                  <span className="muted">({it.itemType})</span>
                  <div className="muted">
                    Qty: {it.qty} × ₹{it.priceSnapshot}
                  </div>
                </div>
                <span className="badge">₹{it.qty * it.priceSnapshot}</span>
              </div>
            ))}
          </div>

          {o.customerNote ? (
            <div className="muted" style={{ marginTop: 8 }}>
              Note: {o.customerNote}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}