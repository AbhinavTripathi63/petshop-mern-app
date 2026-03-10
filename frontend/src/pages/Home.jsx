import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

export default function Home() {
  const [topProducts, setTopProducts] = useState([]);
  const [topServices, setTopServices] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [p, s] = await Promise.all([client.get("/products"), client.get("/services")]);
        setTopProducts(p.data.slice(0, 3));
        setTopServices(s.data.slice(0, 3));
      } catch {
        // backend not running or empty data - fine for now
      }
    })();
  }, []);

  return (
    <div>
      <div className="heroWrap">
        <div className="card">
          <h1>Everything your pet needs — in one place 🐾</h1>
          <p>
            Browse quality products and book services like grooming, vet visits, and training.
            Add items to cart and place your order directly on WhatsApp.
          </p>

          <div className="row" style={{ marginTop: 12 }}>
            <Link className="btn" to="/products">
              Shop Products
            </Link>
            <Link className="btn secondary" to="/services">
              Explore Services
            </Link>
            <Link className="btn secondary" to="/cart">
              View Cart
            </Link>
          </div>

          <div className="hr" />

          <div className="kpiGrid">
            <div className="kpi">
              <b>Fast</b>
              <span>Quick WhatsApp ordering</span>
            </div>
            <div className="kpi">
              <b>Simple</b>
              <span>Products + services in one cart</span>
            </div>
            <div className="kpi">
              <b>Trusted</b>
              <span>Manageable inventory & services</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>How ordering works</h2>
          <p className="muted">1) Add products/services to cart</p>
          <p className="muted">2) Review the order summary</p>
          <p className="muted">3) Click “Place Order” → WhatsApp opens with message</p>

          <div className="hr" />

          <h3 style={{ marginBottom: 6 }}>For Admin</h3>
          <p className="muted" style={{ marginTop: 0 }}>
            Go to /admin to manage products, services and view orders.
          </p>
        </div>
      </div>

      <div className="sectionTitle">
        <h2>Featured Products</h2>
        <Link to="/products">View all</Link>
      </div>

      <div className="grid">
        {topProducts.length === 0 ? (
          <div className="card">No products yet. Add sample data from Admin.</div>
        ) : (
          topProducts.map((p) => (
            <div className="card" key={p._id}>
              {p.imageUrl ? (
                  <img
                    className="thumb"
                    src={p.imageUrl}
                    alt={p.name}
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/600x400?text=No+Image";
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
              <Link className="btn secondary" to={`/products/${p._id}`}>
                View details
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="sectionTitle">
        <h2>Popular Services</h2>
        <Link to="/services">View all</Link>
      </div>

      <div className="grid">
        {topServices.length === 0 ? (
          <div className="card">No services yet. Add sample data from Admin.</div>
        ) : (
          topServices.map((s) => (
            <div className="card" key={s._id}>
              <div className="row">
                <h3 style={{ margin: 0 }}>{s.name}</h3>
                <span className="badge">₹{s.price}</span>
              </div>
              <p className="muted">
                {(s.description || "No description").slice(0, 80)}
                {s.description && s.description.length > 80 ? "…" : ""}
              </p>
              <Link className="btn secondary" to={`/services/${s._id}`}>
                View details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
