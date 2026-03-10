import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function UserLayout() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
      <footer className="container" style={{ opacity: 0.75, paddingTop: 0 }}>
        <div className="hr" />
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} PetShop</p>
      </footer>
    </>
  );
}