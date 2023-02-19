import express from "express";
import {
  getUserDetails,
  loginHandler,
  logout,
  registerHandler,
  deleteProfile,
  createRequest,
  giveFeedback,
} from "../controllers/User.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getUserDetails);
router.delete("/delete/:id", deleteProfile);
router.post("/request", isAuthenticated, createRequest);
router.post("/feedback/:vendorID", isAuthenticated, giveFeedback);

export default router;
