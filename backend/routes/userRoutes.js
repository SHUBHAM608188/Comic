import express from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  registerUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/", registerUser); // add new user

export default router;
