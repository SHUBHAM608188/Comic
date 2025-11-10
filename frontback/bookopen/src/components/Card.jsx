// frontend/src/components/Card.jsx
import React, { useEffect, useState } from "react";
import "./Define.css"; // ✅ Make sure this CSS file contains your shared styles

const CartsTable = () => {
  const [carts, setCarts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("🔒 You must log in first to access the shopping cart.");
      return;
    }

    fetch("http://localhost:5000/api/cart", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const cartsWithPrice = data.data.map((cart) => ({
            ...cart,
            price: cart.price || 10,
            quantity: cart.quantity || 0,
          }));
          setCarts(cartsWithPrice);
        } else {
          setMessage(data.message || "Failed to fetch cart items.");
        }
      })
      .catch((err) => {
        console.error("Error fetching carts:", err);
        setMessage("Server error fetching carts.");
      });
  }, []);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("🔒 Please log in to proceed with checkout.");
      return;
    }

    try {
      for (const cart of carts) {
        const payload = {
          cartId: cart._id,
          userId: cart.userId,
          title: cart.title,
          price: cart.price,
          quantity: cart.quantity,
          totalAmount: cart.quantity * cart.price,
        };

        await fetch("http://localhost:5000/api/funds", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      alert("✅ Checkout completed successful!. Thank you for your payment.");
      setCarts([]);
    } catch (err) {
      console.error("Error during checkout:", err);
      alert("❌ Checkout failed. Please try again.");
    }
  };

  const handlePermanentDelete = async (cartId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("🔒 Please log in first.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setCarts(carts.filter((cart) => cart._id !== cartId));
        } else {
          alert("Failed to delete the item.");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Server error while deleting item.");
      }
    }
  };

  const calculateItemTotal = (price, quantity) => (price * quantity).toFixed(2);
  const calculateGrandTotal = () =>
    carts.reduce((sum, cart) => sum + cart.price * cart.quantity, 0).toFixed(2);

  if (message) {
    return (
      <div className="no-data">
        {message}
      </div>
    );
  }

  return (
    <div className="define-container">
      <div className="define-wrapper">
        <h2 className="define-title">🛒 Your Shopping Cart</h2>

        {carts.length === 0 ? (
          <div className="no-data">🛍️ Your cart is empty.</div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="define-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map((cart) => (
                    <tr key={cart._id}>
                      <td>{cart.title}</td>
                      <td>
                        <span className="quantity-badge">{cart.quantity}</span>
                      </td>
                      <td>
                        <span className="price-badge">${cart.price.toFixed(2)}</span>
                      </td>
                      <td>
                        <span className="price-badge">
                          ${calculateItemTotal(cart.price, cart.quantity)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handlePermanentDelete(cart._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>
                      Grand Total:
                    </td>
                    <td>
                      <span className="price-badge">${calculateGrandTotal()}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button className="save-btn" onClick={handleCheckout}>
                💳 Checkout to Pay
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartsTable;
