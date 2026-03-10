import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";
import { CartProvider } from "./context/CartContext.jsx";
import { Toaster } from "react-hot-toast";

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.body.dataset.theme = savedTheme;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CartProvider>
      <>
        <App />
        <Toaster position="top-right" />
      </>
    </CartProvider>
  </BrowserRouter>
);
