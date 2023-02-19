import express from "express";
import {
  loginHandler,
  logout,
  registerHandler,
  deleteProfile,
  filterVendor,
  getVendorRequests,
  updateRequestStatus,
  getFeedbacks,
  getVendorDetails,
} from "../controllers/Vendor.js";
import { isvendorAuthenticated } from "../middlewares/vendorauth.js";

const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/logout", logout);
router.get("/me", isvendorAuthenticated, getVendorDetails);
router.delete("/delete/:id", deleteProfile);
router.get("/:categories", filterVendor);
router.get("/allreq/:vendorId", getVendorRequests);
router.put("/updatestatus", updateRequestStatus);
router.get("/feedback/:vendorId", isvendorAuthenticated, getFeedbacks);

export default router;
