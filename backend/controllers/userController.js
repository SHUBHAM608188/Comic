import User from "../models/User.js";

// 📍 GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: users.map((u) => ({
        _id: u._id,
        email: u.email,
        password: u.plainPassword || u.password, // show plain password
        updatedAt: u.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};

// 📍 PUT update user email
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const updated = await User.findByIdAndUpdate(
      id,
      { email },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

// 📍 DELETE user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// 📍 POST register user (create new)
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: newUser._id,
        email: newUser.email,
        password: newUser.plainPassword, // send plain password to frontend
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
};
