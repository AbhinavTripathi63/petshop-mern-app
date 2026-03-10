import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="adminShell">
      <AdminSidebar />
      <main className="adminMain">
        <Outlet />
      </main>
    </div>
  );
}
