import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CartContext from "../../context/CartContext";

export default function UserNavbar() {
  const { items } = useContext(CartContext);
  const count = items.reduce((sum, x) => sum + x.qty, 0);

  const navigate = useNavigate();
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"));

  // Keep navbar updated after login/logout (because localStorage change doesn't re-render automatically)
  useEffect(() => {
    const onStorage = () => {
      setUserToken(localStorage.getItem("userToken"));
      setAdminToken(localStorage.getItem("adminToken"));
    };
    window.addEventListener("storage", onStorage);

    // also refresh state after route navigation / page actions
    const t = setInterval(onStorage, 500);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(t);
    };
  }, []);

  function logout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    setUserToken(null);
    setAdminToken(null);
    navigate("/");
  }

  return (
    <header className="nav">
      <Link to="/" className="brand">
        🐾 PetShop
      </Link>

      <nav className="links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/cart">Cart ({count})</NavLink>

        {/* USER */}
        {userToken && (
          <>
            <NavLink to="/my-orders">My Orders</NavLink>
            <button className="btn small" onClick={logout}>Logout</button>
          </>
        )}

        {/* ADMIN */}
        {!userToken && adminToken && (
          <>
            <NavLink to="/admin/dashboard">Admin</NavLink>
            <button className="btn small" onClick={logout}>Logout</button>
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

        {/* Theme toggle */}
        <button
          className="btn secondary small"
          onClick={() => {
            const mode = document.body.dataset.theme === "light" ? "dark" : "light";
            document.body.dataset.theme = mode;
            localStorage.setItem("theme", mode);
          }}
        >
          🌓
        </button>
      </nav>
    </header>
  );
}