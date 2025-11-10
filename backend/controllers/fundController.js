import Fund from "../models/Fund.js";

// GET all funds
export const getFunds = async (req, res) => {
  try {
    const funds = await Fund.find();
    res.json({ success: true, data: funds });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching funds", error: err.message });
  }
};

// POST create new fund
export const createFund = async (req, res) => {
  try {
    const { userId, title, price, quantity, total } = req.body;

    // Auto-generate numeric ID
    const lastFund = await Fund.findOne().sort({ _id: -1 });
    const nextId = lastFund ? lastFund._id + 1 : 1;

    const newFund = new Fund({
      _id: nextId,
      userId,
      title,
      price,
      quantity,
      total,
    });

    await newFund.save();
    res.json({ success: true, message: "Fund created successfully", data: newFund });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating fund", error: err.message });
  }
};

// DELETE by ID
export const deleteFund = async (req, res) => {
  try {
    const { id } = req.params;
    const fund = await Fund.findOneAndDelete({ _id: id });

    if (!fund) {
      return res.status(404).json({ success: false, message: "Fund not found" });
    }

    res.json({ success: true, message: "Fund deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting fund", error: err.message });
  }
};
