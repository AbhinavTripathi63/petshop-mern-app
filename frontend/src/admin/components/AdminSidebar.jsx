import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  }

  return (
    <aside className="adminSide">
      <div className="adminBrand">Admin Panel</div>

      <nav className="adminNav">
        <NavLink to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/services">Services</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
      </nav>

      <button className="btn secondary" onClick={logout} style={{ width: "100%" }}>
        Logout
      </button>
    </aside>
  );
}
