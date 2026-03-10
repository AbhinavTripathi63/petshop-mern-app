import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../context/CartContext";
import client from "../api/client";
import toast from "react-hot-toast";

export default function OrderSummary() {
  const { items, total, clear } = useContext(CartContext);
  const [note, setNote] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const navigate = useNavigate();

  const safeItems = items || [];

  const message = useMemo(() => {
    const lines = safeItems.map(
      (it) => `• ${it.nameSnapshot} x${it.qty} = ₹${it.qty * it.priceSnapshot}`
    );

    return `Hello PetShop! 🐾

My Order:
${lines.join("\n")}

Total: ₹${total}

Note: ${note || "-"}`;
  }, [safeItems, total, note]);

  const whatsappLink = useMemo(() => {
    const number = "916388048108";
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }, [message]);

  function requireLogin() {
    const token = localStorage.getItem("userToken");

    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return false;
    }

    return true;
  }

  async function createMongoOrder() {
    const res = await client.post("/orders", {
      items: safeItems,
      total,
      customerNote: note
    });

    return res.data;
  }

  async function placeOrderWhatsapp() {
    if (!requireLogin()) return;

    try {
      await createMongoOrder();

      toast.success("Order saved ✅ Opening WhatsApp...");

      clear();

      window.location.href = whatsappLink;
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Order failed");
    }
  }

  async function payNow() {
    if (!requireLogin()) return;

    try {
      setPayLoading(true);

      const mongoOrder = await createMongoOrder();

      const pr = await client.post("/payments/create-order", {
        orderId: mongoOrder._id
      });

      const { razorpayOrderId, amount, currency, keyId } = pr.data;

      if (!window.Razorpay) {
        toast.error("Razorpay script not loaded. Check index.html");
        setPayLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount,
        currency,
        name: "PetShop",
        description: "PetShop Order Payment",
        order_id: razorpayOrderId,

        handler: async function (response) {
          try {
            await client.post("/payments/verify", {
              mongoOrderId: mongoOrder._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            toast.success("Payment successful ✅");

            clear();

            navigate("/my-orders");
          } catch (e) {
            toast.error(
              e.response?.data?.message || "Payment verification failed"
            );
          }
        },

        theme: {
          color: "#59d3a2"
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setPayLoading(false);
    }
  }

  if (!safeItems.length) {
    return (
      <div className="card">
        <h2>No items in cart</h2>
        <p className="muted">Add products/services first.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Order Summary</h1>

      <div className="card">
        {safeItems.map((it) => (
          <div
            key={`${it.itemType}-${it.itemId}`}
            className="row"
            style={{ marginBottom: 8 }}
          >
            <div>
              <b>{it.nameSnapshot}</b>{" "}
              <span className="muted">({it.itemType})</span>

              <div className="muted">
                Qty: {it.qty} × ₹{it.priceSnapshot}
              </div>
            </div>

            <span className="badge">
              ₹{it.qty * it.priceSnapshot}
            </span>
          </div>
        ))}

        <div className="hr" />

        <h2>Total: ₹{total}</h2>

        <p>Customer Note (optional)</p>

        <textarea
          className="textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any instructions?"
        />

        <div
          className="row"
          style={{
            marginTop: 12,
            gap: 10,
            justifyContent: "flex-start"
          }}
        >
          <button className="btn" onClick={placeOrderWhatsapp}>
            WhatsApp Order →
          </button>

          <button
            className="btn secondary"
            onClick={payNow}
            disabled={payLoading}
          >
            {payLoading ? "Opening Payment..." : "Pay Now (UPI/Card) →"}
          </button>
        </div>

        <p className="muted" style={{ marginTop: 10 }}>
          Tip: WhatsApp order is quick. “Pay Now” gives instant confirmation.
        </p>
      </div>
    </div>
  );
}