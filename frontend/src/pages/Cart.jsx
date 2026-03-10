import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartContext from "../context/CartContext";

export default function Cart() {
  const { items, inc, dec, remove, total } = useContext(CartContext);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="card">
        <h2>Your cart is empty 🛒</h2>
        <p className="muted">Add products or services to continue.</p>
        <Link className="btn" to="/products">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Cart</h1>
      <p className="muted">Review items before checkout.</p>

      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {items.map((it) => (
            <tr key={`${it.itemType}-${it.itemId}`}>
              <td>{it.nameSnapshot}</td>
              <td>{it.itemType}</td>

              <td>
                <div className="row">
                  <button
                    className="btn small secondary"
                    onClick={() => dec({ itemType: it.itemType, itemId: it.itemId })}
                  >
                    −
                  </button>

                  <b>{it.qty}</b>

                  <button
                    className="btn small secondary"
                    onClick={() => inc({ itemType: it.itemType, itemId: it.itemId })}
                  >
                    +
                  </button>
                </div>
              </td>

              <td>₹{it.qty * it.priceSnapshot}</td>

              <td>
                <button
                  className="btn danger small"
                  onClick={() => remove({ itemType: it.itemType, itemId: it.itemId })}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="row">
          <h2>Total: ₹{total}</h2>
          <button className="btn" onClick={() => navigate("/order-summary")}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}