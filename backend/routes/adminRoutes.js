import express from "express";
import Admin from "../models/Admin.js";

const router = express.Router();

// 🔹 Only one admin (already in DB), so this checks credentials
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({});
    if (!admin) {
      return res.status(404).json({ message: "Admin not found in database" });
    }

    if (username === admin.username && password === admin.password) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
