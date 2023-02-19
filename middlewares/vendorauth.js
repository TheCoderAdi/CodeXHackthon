import jwt from "jsonwebtoken";
import { Vendor } from "../models/Vendor.js";

export const isvendorAuthenticated = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader)
    return res
      .status(401)
      .json({ success: false, message: "Please login first" });
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];
  try {
    const decodedData = jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.user = await Vendor.findById(decodedData.id);
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
  next();
};
