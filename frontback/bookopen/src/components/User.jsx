import React, { useEffect, useState } from "react";
import "./Define.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const text = await res.text();
      const data = JSON.parse(text);

      if (data.success && Array.isArray(data.data)) {
        const formatted = data.data.map((user) => ({
          ID: user._id,
          email: user.email || "N/A",
          password: user.password || "N/A",
          updatedAt: new Date(user.updatedAt).toLocaleString() || "N/A",
        }));
        setUsers(formatted);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("User deleted successfully");
        fetchUsers();
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.ID);
    setEditEmail(user.email);
    setEditPassword("");
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: editEmail, password: editPassword }),
      });
      const data = await res.json();
      if (data.success) {
        alert("User updated successfully");
        setEditingUser(null);
        setEditPassword("");
        fetchUsers();
      } else {
        alert("Failed to update user");
      }
    } catch (err) {
      console.error("Update error:", err);
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

        <h2 className="define-title">Users Management</h2>

        <div className="table-wrapper">
          {loading ? (
            <p className="no-data">Loading users...</p>
          ) : users.length > 0 ? (
            <table className="define-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.ID}>
                    <td>{index + 1}</td>
                    <td>
                      {editingUser === user.ID ? (
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="form-control"
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>
                      {editingUser === user.ID ? (
                        <input
                          type="password"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="form-control"
                        />
                      ) : (
                        "Password"
                      )}
                    </td>
                    <td>{user.updatedAt}</td>
                    <td>
                      {editingUser === user.ID ? (
                        <>
                          <button
                            onClick={() => handleUpdate(user.ID)}
                            className="save-btn"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="cancel-btn"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(user)}
                            className="update-btn"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.ID)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No users found in the database.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
