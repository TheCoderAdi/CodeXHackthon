import express from "express";
import {
  allMessagesVendor,
  allMessageUser,
  giveFeedback,
  newMessage,
  particularMessage,
  particularVendor,
  vendorMessages,
} from "../controllers/Message&Feedback.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { isvendorAuthenticated } from "../middlewares/vendorauth.js";

const router = express.Router();
router.post("/addmessage", isAuthenticated, newMessage);

//Get all messages for user
router.get("/:userID", allMessageUser);

//Get all messages for vendor
router.get("/vendors/:vendorID", allMessagesVendor);

// Get all messages for a particular user
router.get("/user/:vendorId", isAuthenticated, particularMessage);

// Get all messages for a particular vendor
router.get("/vendor/:userId", isvendorAuthenticated, vendorMessages);

// Create a new feedback
router.post("/feedbacks/:vendorI", isAuthenticated, giveFeedback);

// Get all feedbacks for a particular vendor
router.get("/feedbacks/:vendorId", isAuthenticated, particularVendor);

export default router;
