import React from "react";
import { Routes, Route } from "react-router-dom";

import UserLayout from "./user/layout/UserLayout";
import AdminLayout from "./admin/layout/AdminLayout";
import ProtectedAdmin from "./components/ProtectedAdmin";

// user pages (current ones for now)
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Cart from "./pages/Cart";
import OrderSummary from "./pages/OrderSummary";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedUser from "./components/ProtectedUser";
import MyOrders from "./pages/myOrders";





// admin pages (current ones for now)
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ManageProducts from "./admin/ManageProducts";
import ManageServices from "./admin/ManageServices";
import ManageOrders from "./admin/ManageOrders";

export default function App() {
  return (
    <Routes>
      {/* USER PANEL */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route
          path="/order-summary"
          element={
            <ProtectedUser>
              <OrderSummary />
            </ProtectedUser>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedUser>
              <MyOrders />
            </ProtectedUser>
          }
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ADMIN PANEL */}
      <Route path="/admin" element={<AdminLogin />} />

      <Route
        element={
          <ProtectedAdmin>
            <AdminLayout />
          </ProtectedAdmin>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/services" element={<ManageServices />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
      </Route>
    </Routes>
  );
}
