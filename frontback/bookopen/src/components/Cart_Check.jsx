import React, { useState, useEffect } from "react";
import "./Define.css"; 

const CartsTable = () => {
  const [carts, setCarts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("🔒 You must log in first to access the shopping cart.");
      return;
    }

    fetch("http://localhost:5000/api/cart/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCarts(data.data);
        } else {
          setMessage(data.message || "Failed to fetch cart items.");
        }
      })
      .catch((err) => {
        console.error("Error fetching carts:", err);
        setMessage("Server error fetching carts.");
      });
  }, []);

  const handlePermanentDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("🔒 You must log in first.");
      return;
    }

    if (
      !window.confirm("⚠️ Are you sure you want to permanently delete this item?")
    )
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/cart/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCarts((prev) => prev.filter((cart) => cart._id !== id));
      } else {
        console.error("Delete error:", data.message);
      }
    } catch (err) {
      console.error("Error permanently deleting cart:", err);
    }
  };

  return (
    <div className="define-container">
      <div className="define-wrapper">
        <div className="back-home-container">
          <a href="/dashboard" className="back-home-btn">
            ⬅ Back Home
          </a>
        </div>

        <h2 className="define-title">🛒 All User Carts</h2>

        {message && <p className="no-data">{message}</p>}

        {carts.length === 0 ? (
          <p className="no-data">No carts found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="define-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {carts.map((cart, index) => (
                  <tr key={cart._id}>
                    <td>{index + 1}</td>
                    <td>{cart.user}</td>
                    <td>{cart.title}</td>
                    <td>
                      <span className="price-badge">₹{cart.price}</span>
                    </td>
                    <td>
                      <span className="quantity-badge">{cart.quantity}</span>
                    </td>
                    <td>₹{cart.total}</td>
                    <td>
                      {new Date(cart.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handlePermanentDelete(cart._id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartsTable;
