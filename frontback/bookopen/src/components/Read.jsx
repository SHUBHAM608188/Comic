import React, { useState, useEffect } from "react";

const DEFAULT_COVER =
  "https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/5712bb7abeeaad543ff088d1_definingdestiny01_final.png";

export default function DefiningDestiny() {
  const [projects, setProjects] = useState([]);
  const [activeTabs, setActiveTabs] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/projects");
        const data = await res.json();
        const list = data.data || [];
        setProjects(list);

        // Initialize tabs
        const initialTabs = {};
        list.forEach((p) => {
          if (p._id) initialTabs[p._id] = "Tab1";
        });
        setActiveTabs(initialTabs);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const handleWatchClick = (e, url) => {
    e.preventDefault();
    let safeUrl = (url || "https://www.youtube.com/watch?v=QSi0jolsc2s").trim();
    if (!/^https?:\/\//i.test(safeUrl)) safeUrl = "https://" + safeUrl;
    window.open(safeUrl, "_blank", "noopener,noreferrer");
  };

  const handleSetActiveTab = (projectId, tabName) => {
    setActiveTabs((prev) => ({ ...prev, [projectId]: tabName }));
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage:
          'url("https://starbeamrainbowlabs.com/blog/images/042-symphony.png")',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1px 1px", // smaller padding for mobile
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "80%",
          maxWidth: "800px",
        }}
      >
        {projects.length === 0 && (
          <div style={{ color: "#666", textAlign: "center" }}>
            No projects to show.
          </div>
        )}

        {projects.map((project) => {
          const id = project._id || project.id || Math.random().toString(36).slice(2, 9);
          const currentTab = activeTabs[id] || "Tab1";
          const imgSrc = project.coverImg || DEFAULT_COVER;
          const url = project.watchUrl || "https://www.youtube.com/watch?v=QSi0jolsc2s";

          return (
            <div
              key={id}
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap", // allows stacking on small screens
                gap: "40px",
                justifyContent: "center",
                backgroundColor: "#fff",
                borderRadius: "50px",
                border: "1px solid #5a0d4e",
                boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                padding: "40px",
                margin: "60px 0",
              }}
            >
              {/* LEFT SECTION - Comic Panels */}
              <div
                style={{
                  flex: "1 1 300px", // flexible width
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <img
                  src={imgSrc}
                  alt="Comic 1"
                  style={{
                    width: "100%",
                    maxWidth: "320px",
                    borderRadius: "10px",
                    border: "1px solid #d3cce3",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                  }}
                  onError={(e) => (e.currentTarget.src = DEFAULT_COVER)}
                />
                {project.extraImages &&
                  project.extraImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Extra ${i}`}
                      style={{
                        width: "100%",
                        maxWidth: "450px",
                        borderRadius: "10px",
                        border: "1px solid #d3cce3",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                      }}
                    />
                  ))}
              </div>

              {/* RIGHT SECTION - Tabs + Text */}
              <div
                style={{
                  flex: "1 1 300px",
                  textAlign: "center",
                  minWidth: "280px",
                }}
              >
                <h1
                  style={{
                    color: "#5a0d4e",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2rem",
                    marginBottom: "20px",
                  }}
                >
                  {project.title || "Defining Destiny"}
                </h1>

                {/* Tabs Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    flexWrap: "wrap", // stack tabs on small screens
                    marginBottom: "20px",
                    borderBottom: "2px solid #e58db5",
                    paddingBottom: "4px",
                  }}
                >
                  <button
                    onClick={() => handleSetActiveTab(id, "Tab1")}
                    style={{
                      background:
                        currentTab === "Tab1" ? "#5a0d4e" : "transparent",
                      color: currentTab === "Tab1" ? "#fff" : "#5a0d4e",
                      border: "none",
                      padding: "8px 18px",
                      borderRadius: "6px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "0.3s",
                    }}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => handleSetActiveTab(id, "Tab2")}
                    style={{
                      background:
                        currentTab === "Tab2" ? "#e93b75" : "transparent",
                      color: currentTab === "Tab2" ? "#fff" : "#5a0d4e",
                      border: "none",
                      padding: "8px 18px",
                      borderRadius: "6px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "0.3s",
                    }}
                  >
                    Responsibilities
                  </button>
                </div>

                {/* Tab Content */}
                <div
                  style={{
                    backgroundColor: "#faf6fb",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid #e3d3eb",
                    minHeight: "180px",
                    width: "100%",
                    boxSizing: "border-box",
                    margin: "0 auto",
                    boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)",
                    textAlign: "left",
                  }}
                >
                  {currentTab === "Tab1" ? (
                    <p style={{ color: "#333", lineHeight: "1.7" }}>
                      {project.description ||
                        "Defining Destiny was a three page comic I completed in 2013 for the Spartan Super Hero Legends project. This was part of Michigan State University’s Homecoming celebration. Several alumni and their comics were represented in the program. Steve Boughton reassembled the comic’s panels in the motion version of the comic."}
                    </p>
                  ) : (
                    <p style={{ color: "#333", lineHeight: "1.7" }}>
                      {project.responsibilities ||
                        "Responsibilities included storyboarding, panel design, and color illustration for Michigan State’s motion comic showcase."}
                    </p>
                  )}
                </div>

                {/* Watch Button */}
                <div
                  style={{
                    backgroundColor: "#2e003e",
                    textAlign: "center",
                    padding: "20px",
                    borderRadius: "12px",
                    marginTop: "30px",
                  }}
                >
                  <a
                    href={url}
                    onClick={(e) => handleWatchClick(e, url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: "#8a1d64",
                      color: "#fff",
                      padding: "12px 26px",
                      borderRadius: "24px",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "1rem",
                      transition: "background-color 0.3s ease",
                      display: "inline-block",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#a8287c")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#8a1d64")
                    }
                  >
                    Watch the Motion Comic
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
