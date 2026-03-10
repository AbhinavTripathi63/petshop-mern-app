import React, { useEffect, useState } from "react";
import client from "../api/client";

function StatusBadge({ status }) {
  const cls =
    status === "completed"
      ? "completed"
      : status === "whatsapp_opened"
      ? "whatsapp"
      : "pending";

  const label =
    status === "completed"
      ? "Completed"
      : status === "whatsapp_opened"
      ? "WhatsApp Opened"
      : "Pending";

  return <span className={`badgeStatus ${cls}`}>{label}</span>;
}

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [openId, setOpenId] = useState(null);

  async function load() {
    const res = await client.get("/orders");
    setOrders(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function markCompleted(id) {
    await client.patch(`/orders/${id}/complete`);
    load();
  }

  return (
    <div>
      <div className="row" style={{ alignItems: "baseline" }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Orders</h1>
          <p className="muted" style={{ marginTop: 0 }}>
            Orders placed via WhatsApp checkout.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card">No orders yet.</div>
      ) : (
        orders.map((o) => (
          <div className="orderRow" key={o._id}>
            <div className="orderHead">
              <div>
                <div style={{ fontWeight: 800 }}>Order #{o._id.slice(-6)}</div>
                <div className="muted" style={{ fontSize: 13 }}>
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>

              <div>
                <div className="muted">Total</div>
                <b>₹{o.total}</b>
              </div>

              <div>
                <StatusBadge status={o.status} />
              </div>

              <div className="row">
                <button
                  className="btn secondary small"
                  onClick={() => setOpenId(openId === o._id ? null : o._id)}
                >
                  {openId === o._id ? "Hide" : "View"}
                </button>

                {o.status !== "completed" ? (
                  <button
                    className="btn small"
                    onClick={() => markCompleted(o._id)}
                  >
                    Mark Completed
                  </button>
                ) : null}
              </div>
            </div>

            {openId === o._id ? (
              <div className="orderItems">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Type</th>
                      <th>Qty</th>
                      <th>Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {o.items.map((it, idx) => (
                      <tr key={idx}>
                        <td>{it.nameSnapshot}</td>
                        <td>{it.itemType}</td>
                        <td>{it.qty}</td>
                        <td>₹{it.qty * it.priceSnapshot}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {o.customerNote ? (
                  <p style={{ marginTop: 10 }}>
                    <b>Note:</b> {o.customerNote}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        ))
      )}
    </div>
  );
}
