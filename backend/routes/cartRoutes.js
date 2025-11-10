// backend/routes/cartRoutes.js
import express from "express";
import Cart from "../models/cartModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================================
// 1️⃣ Add item to current user's cart
// ============================================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, price, quantity } = req.body;
    if (!title || !price || !quantity) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const total = price * quantity;
    const newCart = new Cart({
      userId: req.user.id,
      title,
      price,
      quantity,
      total,
      isDeleted: false,
    });

    await newCart.save();
    res.status(201).json({ success: true, data: newCart });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ success: false, message: "Server error adding to cart" });
  }
});

// ============================================================
// 2️⃣ Fetch current user's own cart
// ============================================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userCart = await Cart.find({ userId: req.user.id, isDeleted: false });
    res.json({ success: true, data: userCart });
  } catch (err) {
    console.error("Error fetching user's cart:", err);
    res.status(500).json({ success: false, message: "Server error fetching cart" });
  }
});


// ============================================================
// 4️⃣ Permanent Delete (remove from DB)
// ============================================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Cart.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted)
      return res.status(404).json({ success: false, message: "Item not found" });

    res.json({ success: true, message: "🗑️ Cart permanently deleted" });
  } catch (err) {
    console.error("Error deleting cart item:", err);
    res.status(500).json({ success: false, message: "Server error deleting cart item" });
  }
});

// ============================================================
// 5️⃣ Fetch all carts (Admin view)
// ============================================================
router.get("/all", async (req, res) => {
  try {
    const carts = await Cart.find().populate("userId", "email");
    const formatted = carts.map((cart, i) => ({
      _id: cart._id,
      ID: i + 1,
      user: cart.userId?.email || "",
      title: cart.title,
      price: cart.price,
      quantity: cart.quantity,
      total: cart.total,
      isDeleted: cart.isDeleted,
      createdAt: cart.createdAt
        ? new Date(cart.createdAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "N/A",
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error("Error fetching carts:", err);
    res.status(500).json({ success: false, message: "Server error fetching all carts" });
  }
});
// 🧠 GET all carts
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json({
      success: true,
      count: carts.length,
      data: carts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching carts.",
    });
  }
});


export default router;
