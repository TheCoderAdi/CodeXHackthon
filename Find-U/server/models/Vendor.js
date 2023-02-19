import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "vendor" },
  categories: {
    type: String,
    enum: ["medical", "food"],
  },
});

vendorSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
};
export const Vendor = mongoose.model("vendor", vendorSchema);
