import React, { useState, useEffect } from "react";
import "./Define.css";

const Featured = () => {
  const [comics, setComics] = useState([]);
  const [selectedComic, setSelectedComic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComics();
  }, []);

  const fetchComics = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/comics");
      const text = await res.text();
      const data = JSON.parse(text);
      if (data.success && data.data.length > 0) {
        const comicsWithId = data.data.map((comic, index) => ({
          ID: index + 1,
          _id: comic._id,
          Title: comic.title || "Untitled",
          Price: comic.price || "N/A",
          Description: comic.description || "No description",
          Responsibilities: comic.responsibilities || "-",
          GalleryImages: Array.isArray(comic.galleryImages)
            ? comic.galleryImages
            : [],
          CoverSrc: comic.coverSrc || "",
          Quantity: comic.quantity || 0,
          CreatedAt: comic.createdAt
            ? new Date(comic.createdAt).toLocaleString()
            : "—",
          UpdatedAt: comic.updatedAt
            ? new Date(comic.updatedAt).toLocaleString()
            : "—",
        }));
        setComics(comicsWithId);
      } else setComics([]);
    } catch (err) {
      console.error("Error fetching comics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this comic?")) return;

  try {
    const res = await fetch(`http://localhost:5000/api/comics/${id}`, {
      method: "DELETE",
    });

    let result;
    try {
      result = await res.json();
    } catch (err) {
      console.error("❌ Non-JSON response from server:", err);
      alert("Unexpected response from server. Please check backend logs.");
      return;
    }

    if (result.success) {
      alert(result.message || "Comic deleted successfully!");
      setComics((prev) => prev.filter((c) => c._id !== id));
    } else {
      alert(result.message || "❌ Failed to delete comic.");
    }
  } catch (err) {
    console.error("Error deleting comic:", err);
  }
};



  const handleEdit = (comic) => {
    setSelectedComic({ ...comic });
    setShowModal(true);
  };

  const handleChange = (field, value) => {
    setSelectedComic((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/comics/${selectedComic._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedComic.Title, // 👈 match backend schema
          price: selectedComic.Price,
          description: selectedComic.Description,
          responsibilities: selectedComic.Responsibilities,
          quantity: selectedComic.Quantity,
        }),
      }
    );

    const result = await res.json();
    if (result.success) {
      alert(result.message);
      setShowModal(false);
      fetchComics();
    } else {
      alert("❌ Failed to update comic.");
    }
  } catch (err) {
    console.error("Error updating comic:", err);
  }
};



  return (
    <div className="define-container">
      <div className="define-wrapper">
        <h1 className="define-title">Comics Database View</h1>

        <div className="back-home-container">
          <a href="/dashboard" className="back-home-btn">
            ⬅ Back to Home
          </a>
        </div>

        {loading ? (
          <p className="loading-text">Loading comics...</p>
        ) : (
          <div className="table-wrapper">
            <table className="define-table">
              <thead>
                <tr>
                  {[
                    "ID",
                    "Title",
                    "Price",
                    "Description",
                    "Responsibilities",
                    "Gallery Images",
                    "Cover Image",
                    "Quantity",
                    "Created At",
                    "Updated At",
                    "Action",
                  ].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comics.length > 0 ? (
                  comics.map((comic) => (
                    <tr key={comic._id}>
                      <td>{comic.ID}</td>
                      <td>{comic.Title}</td>
                      <td>
                        <span className="price-badge">{comic.Price}</span>
                      </td>
                      <td>{comic.Description}</td>
                      <td>{comic.Responsibilities}</td>
                      <td>
                        {comic.GalleryImages.length > 0 ? (
                          <div className="gallery-preview">
                            {comic.GalleryImages.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt={`gallery-${i}`}
                                className="gallery-thumb"
                                onClick={() => handleImageClick(img)}
                              />
                            ))}
                          </div>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td>
                        {comic.CoverSrc ? (
                          <img
                            src={comic.CoverSrc}
                            alt="cover"
                            className="cover-image"
                            onClick={() => handleImageClick(comic.CoverSrc)}
                          />
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td>
                        <span className="quantity-badge">{comic.Quantity}</span>
                      </td>
                      <td>{comic.CreatedAt}</td>
                      <td>{comic.UpdatedAt}</td>
                      <td>
                        <button
                          className="update-btn"
                          onClick={() => handleEdit(comic)}
                        >
                          ✏ Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(comic._id)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="no-data">
                      No comics found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && selectedComic && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>Edit Comic</h2>
              {["Title", "Price", "Description", "Responsibilities", "Quantity"].map(
                (field) => (
                  <div key={field} className="form-group">
                    <label>{field}</label>
                    {field === "Description" || field === "Responsibilities" ? (
                        <textarea
                          value={selectedComic[field]}
                          onChange={(e) => handleChange(field, e.target.value)}
                        />
                      ) : (
                        <input
                          type={
                            field === "Quantity"
                              ? "number"
                              : "text" 
                          }
                          value={selectedComic[field]}
                          onChange={(e) => handleChange(field, e.target.value)}
                        />
                      )}

                  </div>
                )
              )}
              <div className="modal-actions">
                <button className="save-btn" onClick={handleSave}>
                  💾 Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  ✖ Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Featured;
