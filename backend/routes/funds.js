import express from "express";
import Fund from "../models/Fund.js";
import { getFunds, createFund, deleteFund } from "../controllers/fundController.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const fund = new Fund(req.body);
    await fund.save();
    res.json({ success: true, message: "Saved to fundsDB", data: fund });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving fund", error });
  }
});


router.post("/", async (req, res) => {
  try {
    const fund = new Fund(req.body);
    await fund.save();
    res.json({ success: true, message: "Saved to fundsDB", data: fund });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving fund", error });
  }
});

// 🟢 POST (Add new fund)
router.post("/", async (req, res) => {
  try {
    const { userId, title, price, quantity, total } = req.body;
    const newFund = new Fund({ userId, title, price, quantity, total });
    await newFund.save();
    res.json({ success: true, message: "Fund added successfully", data: newFund });
  } catch (error) {
    console.error("Error adding fund:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔴 DELETE by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedFund = await Fund.findByIdAndDelete(req.params.id);
    if (!deletedFund) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.json({ success: true, message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ✅ GET all funds
router.get("/", async (req, res) => {
  try {
    const funds = await Fund.find();
    res.json({ success: true, data: funds });
  } catch (err) {
    console.error("Error fetching funds:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


//-----------------------------------------------------------------------------


router.post("/", async (req, res) => {
  try {
    const fund = new Fund(req.body);
    await fund.save();
    res.json({ success: true, message: "Saved to fundsDB", data: fund });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving fund", error });
  }
});



router.get("/", getFunds);
router.post("/", createFund);
router.delete("/:id", deleteFund);
export default router;
