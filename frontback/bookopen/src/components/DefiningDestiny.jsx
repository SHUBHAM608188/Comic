// src/DefiningDestiny.jsx (Complete React Component)
import React, { useState } from "react";

function DefiningDestiny() {
  const [title, setTitle] = useState("Defining Destiny");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [coverImg, setCoverImg] = useState(
    "https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/5712bb7abeeaad543ff088d1_definingdestiny01_final.png"
  );
  const [watchUrl, setWatchUrl] = useState("https://www.youtube.com/watch?v=QSi0jolsc2s");
  const [activeTab, setActiveTab] = useState("Tab1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("❌ Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setCoverImg(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleWatchClick = (e) => {
    e.preventDefault();
    let url = watchUrl.trim() || "https://www.youtube.com/watch?v=QSi0jolsc2s";
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    try {
      new URL(url);
    } catch {
      url = "https://www.youtube.com/watch?v=QSi0jolsc2s";
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

     const handleSubmit = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  const payload = {
    title,
    description,
    responsibilities,
    coverImg,
    watchUrl,
  };

  try {
    const res = await fetch("http://localhost:5000/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const clonedRes = res.clone();
      let errorMessage = "Failed to save project";
      try {
        const errorData = await clonedRes.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const text = await clonedRes.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();
    alert("✅ Project saved successfully!");
    console.log("Saved:", data);
  } catch (err) {
    alert("❌ Error saving project: " + err.message);
  } finally {
    setIsSubmitting(false);
  }
};
     

  return (
    <div className="admin-page">
    <hooder> 
        <h1>Defining Destiny</h1>
        <a href="/dashboard" className="home-link">
         <h1> ⏪ </h1>
        </a>
    </hooder>
    <div className="project-tile w-container">
      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
        <label>
          <span style={{ display: "block", fontWeight: "bold", color: "#5a0d4e" }}>Title</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: "8px", minWidth: "260px" }} />
        </label>

        <label>
          <span style={{ display: "block", fontWeight: "bold", color: "#5a0d4e" }}>Cover image</span>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        <label>
          <span style={{ display: "block", fontWeight: "bold", color: "#5a0d4e" }}>Watch link</span>
          <input type="url" value={watchUrl} onChange={(e) => setWatchUrl(e.target.value)} style={{ padding: "8px", minWidth: "260px" }} />
        </label>
      </div>

      <img className="project-img" width="300" src={coverImg} alt="Defining Destiny comic cover" style={{ borderRadius: "4px", marginRight: "20px" }} />

      {/* Title */}
      <h3 className="project-heading" style={{ color: "#5a0d4e" }}>{title || "Untitled"}</h3>

      {/* Tabs */}
      <div className="w-tabs">
        <div className="w-tab-menu" style={{ display: "flex", gap: "8px", borderBottom: "2px solid #eee" }}>
          <button className={`w-tab-link ${activeTab === "Tab1" ? "w--current" : ""}`} onClick={() => setActiveTab("Tab1")}>Description</button>
          <button className={`w-tab-link ${activeTab === "Tab2" ? "w--current" : ""}`} onClick={() => setActiveTab("Tab2")}>Responsibilities</button>
          <button className="w-tab-link is-disabled" disabled>Video (disabled)</button>
        </div>

        <div className="w-tab-content" style={{ border: "1px solid #d3b2ce", borderTop: "none", padding: "16px" }}>
          {activeTab === "Tab1" && (
            <textarea className="textarea-lg" placeholder="Enter description..." value={description} onChange={(e) => setDescription(e.target.value)} />
          )}
          {activeTab === "Tab2" && (
            <textarea className="textarea-lg" placeholder="Enter responsibilities..." value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} />
          )}
        </div>
      </div>

      <div className="project-bottombar w-clearfix" style={{ marginTop: "16px" }}>
        <a href={watchUrl} onClick={handleWatchClick} className="project-button-primary w-button" target="_blank" rel="noopener noreferrer">
          Watch the Motion Comic
        </a>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="project-button-secondary w-button"
          style={{
            marginLeft: "12px",
            backgroundColor: "#5a0d4e",
            color: "#fff",
            padding: "10px 16px",
            border: "none",
            borderRadius: "4px",
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit to Database"}
        </button>
      </div>
    </div>
   </div>
  );
}

export default DefiningDestiny;