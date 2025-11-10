import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [comics, setComics] = useState([]);
  const [carts, setCarts] = useState([]);
  const [users, setUsers] = useState([]);
  const [funds, setFunds] = useState([]);

  useEffect(() => {
    // Helper function to fetch API data
    const fetchData = async (url, setter) => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setter(data.data);
        } else {
          setter([]);
        }
      } catch (err) {
        console.error(`Error fetching from ${url}:`, err);
        setter([]);
      }
    };

    fetchData("http://localhost:5000/api/projects", setProjects);
    fetchData("http://localhost:5000/api/comics", setComics);
    fetchData("http://localhost:5000/api/cart/all", setCarts);
    fetchData("http://localhost:5000/api/users", setUsers);
    fetchData("http://localhost:5000/api/funds", setFunds);

  }, []);

  const totalProjects = projects.length;
  const totalComics = comics.length;
  const totalCarts = carts.length;
  const totalUsers = users.length;
  const totalFunds = funds.length;


  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background-color: #2d0a48;
          color: #fff;
        }
        header {
          background-color: #482a57;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        header h1 {
          font-size: 1.5rem;
          letter-spacing: 2px;
        }
        header a {
          color: #ff3658;
          text-decoration: none;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        main {
          text-align: center;
          padding: 2rem;
        }
        main h2 {
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
          color: #ff3658;
        }
        .picture-box {
          width: 80%;
          max-width: 700px;
          height: 200px;
          background-color: #482a57;
          margin: 0 auto 2rem;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        .picture-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 15px;
        }
        .card-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          justify-items: center;
        }
        /* ✅ Center the last Fund card */
        .card-container > .card:last-child {
          grid-column: 2;
        }
        .card {
          background-color: #482a57;
          width: 250px;
          border-radius: 12px;
          padding: 1.2rem;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          transition: transform 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        .id-box {
          background-color: #2d0a48;
          padding: 0.8rem;
          border-radius: 8px;
          margin: 1rem 0;
          font-size: 1.1rem;
          font-weight: bold;
        }
        .card a {
          background-color: #ff3658;
          color: #fff;
          text-decoration: none;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          font-weight: 600;
          display: inline-block;
          transition: background-color 0.3s;
        }
        .card a:hover {
          background-color: #ff4b70;
        }
      `}</style>

      <header>
        <h1>📊📉 Dashboard 📊📉</h1>
        <a href="/" className="home-link">
          <h1>合 H</h1>
        </a>
      </header>

      <main>
        <h2>Administration</h2>

        <div className="picture-box">
          <img
            src="https://wallpapercave.com/wp/wp2729546.jpg"
            alt="comic-image"
          />
        </div>

        <div className="card-container">
          <div className="card">
            <a href="/definingDestiny">Defining</a>
            <div className="id-box">POST request creates</div>
          </div>

          <div className="card">
            <a href="/infiniteSpiral">Featured</a>
            <div className="id-box">POST request creates</div>
          </div>

          <div className="card">
            <a href="/define">Define</a>
            <div className="id-box">{totalProjects}</div>
          </div>

          <div className="card">
            <a href="/featured">Featured</a>
            <div className="id-box">{totalComics}</div>
          </div>

          <div className="card">
            <a href="/cart_Check">Cart</a>
            <div className="id-box">{totalCarts}</div>
          </div>

          <div className="card">
            <a href="/user">User</a>
            <div className="id-box">{totalUsers}</div>
          </div>

          {/* ✅ Centered Fund Card */}
          <div className="card">
            <a href="/fund">Fund</a>
            <div className="id-box">{totalFunds}</div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
