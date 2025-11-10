import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FeaturedComics.css";

const FeaturedComics = () => {
  const [comics, setComics] = useState([]);
  const [activeTabs, setActiveTabs] = useState({});
  const [selectedComic, setSelectedComic] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/comic");
        const data = await res.json();

        if (data.success) {
          const comicsWithDefaults = data.data.map((comic) => ({
            ...comic,
            price: comic.price || 10,
            quantity: comic.quantity || 1,
          }));
          setComics(comicsWithDefaults);

          const defaultTabs = {};
          comicsWithDefaults.forEach((comic) => {
            defaultTabs[comic._id] = "tab-desc";
          });
          setActiveTabs(defaultTabs);
        } else {
          console.error("Failed to fetch comics:", data.message);
        }
      } catch (err) {
        console.error("Error fetching comics:", err);
      }
    };

    fetchComics();
  }, []);

  const handleTabClick = (comicId, tabId) => {
    setActiveTabs((prev) => ({ ...prev, [comicId]: tabId }));
  };

  const handleViewDetails = (comic) => {
    setSelectedComic(comic);
    setQuantity(comic.quantity || 1);
  };

  // close modal
  const handleCloseModal = () => setSelectedComic(null);

  // Continue button
  const handleContinue = () => {
    setSelectedComic(null);
  };

  // Save quantity 
  const handleSaveQuantity = async () => {
    if (!selectedComic) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/comic/${selectedComic._id}/quantity`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert(` Quantity updated successfully! (${data.data.quantity})`);
        setComics((prev) =>
          prev.map((comic) =>
            comic._id === selectedComic._id
              ? { ...comic, quantity: data.data.quantity }
              : comic
          )
        );
        setSelectedComic(data.data);
      } else {
        alert("Failed to update quantity: " + data.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Error updating quantity.");
    }
  };

  //  Add to Cart
  const handleAddToCart = async (comic) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("🔒 You must log in first to access or modify the cart.");
      navigate("/card");
      return;
    }

    try {
      const cartData = {
        title: comic.title,
        quantity: comic.quantity || 1,
        price: comic.price,
        total: comic.price * (comic.quantity || 1),
      };

      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartData),
      });

      const data = await res.json();
      if (data.success) {
        alert(` Added to Cart Successfully!\n${comic.title}\n₹${cartData.total}`);
        setTimeout(() => {
          navigate("/card");
        }, 1000);
      } else {
        alert("Failed to add to cart: " + data.message);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Error adding to cart.");
    }
  };

  // Loading state
  if (comics.length === 0) {
    return (
      <div className="loading">
        Loading comics...
      </div>
    );
  }

  //  Main layout
  return (
    <div className="featured-comics-container">
      <header className="featured-header">Featured Comics</header>

      <div className="comics-wrapper">
        {comics.map((comic) => {
          const activeTab = activeTabs[comic._id] || "tab-desc";
          return (
            <div key={comic._id} className="comic-card">

              <div className="comic-cover">
                <img src={comic.coverSrc} alt={comic.title} />
              </div>

              <div className="comic-info">
                <h3 className="comic-title">{comic.title}</h3>

                <nav className="comic-tabs">
                  {["tab-desc", "tab-resp", "tab-gallery"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabClick(comic._id, tab)}
                      className={`tab-button ${
                        activeTab === tab ? "active" : ""
                      }`}
                    >
                      {tab === "tab-desc"
                        ? "Description"
                        : tab === "tab-resp"
                        ? "Responsibilities"
                        : "Gallery"}
                    </button>
                  ))}
                </nav>

                {activeTab === "tab-desc" && (
                  <p
                    className="tab-content"
                    dangerouslySetInnerHTML={{ __html: comic.description }}
                  />
                )}
                {activeTab === "tab-resp" && (
                  <p className="tab-content">{comic.responsibilities}</p>
                )}
                {activeTab === "tab-gallery" && (
                  <div className="tab-gallery">
                    {comic.galleryImages.map((img, i) => (
                      <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                        <img src={img} alt={`Gallery ${i}`} />
                      </a>
                    ))}
                  </div>
                )}

                <div className="action-buttons">
                  <button
                    className="btn btn-view"
                    onClick={() => handleViewDetails(comic)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-cart"
                    onClick={() => handleAddToCart(comic)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedComic && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{selectedComic.title}</h2>

            <img
              src={selectedComic.coverSrc}
              alt={selectedComic.title}
              style={{
                width: "100%",
                maxWidth: "200px",
                border: "1px solid #a17aaf",
                marginBottom: "1rem",
              }}
            />

            <p
              className="tab-content"
              dangerouslySetInnerHTML={{ __html: selectedComic.description }}
            />

            <div className="modal-details">
              <h3 style={{ color: "#6e1d7a" }}>List of Details</h3>
              <ul>
                <li>📋 Responsibilities: {selectedComic.responsibilities}</li>
                <li>
                  🏞️ Gallery Images: {selectedComic.galleryImages.length} available
                </li>
                <li>🏷️ Price: ₹{selectedComic.price}</li>
              </ul>
            </div>

            <div className="quantity-box">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
            </div>

            <div className="modal-buttons">
              <button className="btn btn-save" onClick={handleSaveQuantity}>
                Save Quantity
              </button>
              <button className="btn btn-continue" onClick={handleContinue}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedComics;
