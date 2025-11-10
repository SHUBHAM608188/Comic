import React, { useState, useEffect } from "react";
import "./Define.css";

const Define = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/projects");
      const data = await res.json();
      if (data.success) {
        const projectsWithId = data.data.map((project, index) => ({
          ID: index + 1,
          _id: project._id,
          Title: project.title || "",
          Description: project.description || "",
          Responsibilities: project.responsibilities || "",
          CoverImg: project.coverImg || "",
          WatchUrl: project.watchUrl || "",
          CreatedAt: project.createdAt
            ? new Date(project.createdAt).toLocaleString()
            : "—",
          UpdatedAt: project.updatedAt
            ? new Date(project.updatedAt).toLocaleString()
            : "—",
        }));
        setProjects(projectsWithId);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleWatchClick = (url) => {
    if (!url) return;
    let safeUrl = url.trim();
    if (!/^https?:\/\//i.test(safeUrl)) safeUrl = "https://" + safeUrl;
    window.open(safeUrl, "_blank", "noopener,noreferrer");
  };

  const handleImageClick = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        alert("🗑 Project deleted successfully!");
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert("❌ Failed to delete project.");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleUpdate = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedProject) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${selectedProject._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: selectedProject.Title,
            description: selectedProject.Description,
            responsibilities: selectedProject.Responsibilities,
            coverImg: selectedProject.CoverImg,
            watchUrl: selectedProject.WatchUrl,
          }),
        }
      );
      const result = await res.json();
      if (result.success) {
        alert("💾 Project updated successfully!");
        setShowModal(false);
        fetchProjects();
      } else {
        alert("❌ Failed to update project.");
      }
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  return (
  <div className="define-container">
    <div className="define-wrapper">
      <h1 className="define-title">Defining Database View</h1>

      {/* 🔹 Back to Home Button */}
      <div className="back-home-container">
        <a href="/dashboard" className="back-home-btn">
          ⬅ Back to Home
        </a>
      </div>

      <div className="table-wrapper">
        <table className="define-table">
          <thead>
            <tr>
              {[
                "ID",
                "Title",
                "Description",
                "Responsibilities",
                "Cover Image",
                "Watch",
                "Created At",
                "Updated At",
                "Action",
              ].map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((p) => (
                <tr key={p._id}>
                  <td>{p.ID}</td>
                  <td>{p.Title}</td>
                  <td>{p.Description}</td>
                  <td>{p.Responsibilities}</td>
                  <td>
                    {p.CoverImg ? (
                      <img
                        src={p.CoverImg}
                        alt="cover"
                        className="cover-image"
                        onClick={() => handleImageClick(p.CoverImg)}
                      />
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td>
                    {p.WatchUrl ? (
                      <button
                        className="watch-btn"
                        onClick={() => handleWatchClick(p.WatchUrl)}
                      >
                        ▶ Watch
                      </button>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td>{p.CreatedAt}</td>
                  <td>{p.UpdatedAt}</td>
                  <td>
                    <button
                      className="update-btn"
                      onClick={() => handleUpdate(p)}
                    >
                      ✏ Update
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(p._id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* --- Modal remains unchanged --- */}
      {showModal && selectedProject && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Edit Project</h2>
            {["Title", "Description", "Responsibilities", "CoverImg", "WatchUrl"].map(
              (field) => (
                <div key={field} className="form-group">
                  <label>{field}</label>
                  {field === "Description" || field === "Responsibilities" ? (
                    <textarea
                      value={selectedProject[field]}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject,
                          [field]: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <input
                      type="text"
                      value={selectedProject[field]}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject,
                          [field]: e.target.value,
                        })
                      }
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

export default Define;
