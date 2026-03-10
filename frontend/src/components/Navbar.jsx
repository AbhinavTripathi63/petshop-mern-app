import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CartContext from "../context/CartContext";

export default function Navbar() {
  const { items } = useContext(CartContext);
  const count = items.reduce((sum, x) => sum + x.qty, 0);

  const navigate = useNavigate();

  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");

  // theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  function logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");
    navigate("/");
  }

  return (
    <header className="nav">
      {/* LEFT: brand */}
      <div className="navLeft">
        <Link to="/" className="brand">
          🐾 PetShop
        </Link>
      </div>

      {/* CENTER: main tabs */}
      <nav className="navCenter links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/cart">Cart ({count})</NavLink>
      </nav>

      {/* RIGHT: auth + theme */}
      <div className="navRight links">
        {/* USER */}
        {userToken && (
          <>
            <NavLink to="/my-orders">My Orders</NavLink>
            <button className="btn small" onClick={logout}>
              Logout
            </button>
          </>
        )}

        {/* ADMIN */}
        {!userToken && adminToken && (
          <>
            <NavLink to="/admin/dashboard">Admin</NavLink>
            <button className="btn small" onClick={logout}>
              Logout
            </button>
          </>
        )}

        {/* GUEST */}
        {!userToken && !adminToken && (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/admin">Admin</NavLink>
          </>
        )}

        <button
          className="btn secondary small"
          title="Toggle theme"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        >
          🌓
        </button>
      </div>
    </header>
  );
}