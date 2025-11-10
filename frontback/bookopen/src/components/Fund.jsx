import React, { useState, useEffect } from "react";
import "./Fund.css";


const Fund = () => {
  const [fundsDB, setFundsDB] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const fundsRes = await fetch("http://localhost:5000/api/funds");
        const fundsData = await fundsRes.json();


        const usersRes = await fetch("http://localhost:5000/api/users");
        const usersData = await usersRes.json();

        if (fundsData.success && Array.isArray(fundsData.data) &&
            usersData.success && Array.isArray(usersData.data)) {


              const fundsList = fundsData.data.map((fund, index) => {
            const user = usersData.data.find(u => u._id === fund.userId);
            return {
              ID: index + 1, // numeric roll number
              userEmail: user ? user.email : "N/A",
              title: fund.title || "N/A",
              price: fund.price || 0,
              quantity: fund.quantity || 0,
              total: fund.totalAmount || 0,
            };
          });

          setFundsDB(fundsList);
        } else {
          console.log("No funds or users found");
          setFundsDB([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setFundsDB([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Total records
  const totalRecords = fundsDB.length;

  // Calculate grand total
  const grandTotal = fundsDB.reduce((acc, fund) => acc + fund.total, 0);

  return (
    <>
        <hooder><h1>Featured Comics</h1>
    <a href="/dashboard" className="home-link">
         <h1> ⏪ </h1>
        </a>
    </hooder>
    <div className="define-container">
      <div className="define-wrapper">
        <h1 className="define-title">💰 Funds </h1>

        {loading ? (
          <p>Loading data...</p>
        ) : fundsDB.length === 0 ? (
          <p>No fund records found.</p>
        ) : (
          <>
          <div className="fund-summary">
            <div className="summary-item">
              <span>Total Fund Records:</span> <strong>{totalRecords}</strong>
            </div>
            <div className="summary-item">
              <span>Grand Total:</span> <strong>₹{grandTotal}</strong>
            </div>
          </div>


            <table className="define-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User Email</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {fundsDB.map((fund) => (
                  <tr key={fund.ID}>
                    <td>{fund.ID}</td>
                    <td>{fund.userEmail}</td>
                    <td>{fund.title}</td>
                    <td>₹{fund.price}</td>
                    <td>{fund.quantity}</td>
                    <td>₹{fund.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default Fund;
