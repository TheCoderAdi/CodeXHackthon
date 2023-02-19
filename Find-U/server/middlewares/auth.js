import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader)
    return res
      .status(401)
      .json({ success: false, message: "Please login first" });
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];
  try {
    const decodedData = jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
  } catch (err) {
    return res.status(401).json({ success: false, message: "Please Login" });
  }

  next();
};
