import mongoose from "mongoose";
const fundSchema = new mongoose.Schema({
  cartId: String,
  userId: String,
  title: String,
  price: Number,
  quantity: Number,
  totalAmount: Number,
});
export default mongoose.model("Fund", fundSchema, "fundsDB");
