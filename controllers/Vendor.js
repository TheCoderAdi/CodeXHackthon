import { Vendor } from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import sendToken from "../utils/jwttoken.js";
import { Request } from "../models/Request.js";
import { Feedback } from "../models/Feedback.js";

export const registerHandler = async (req, res) => {
  try {
    const { name, password, email, categories } = req.body;
    if (!name || !password || !email || !categories)
      return res.status(400).json({
        success: false,
        message: "Name, email, password and category  are required",
      });
    const existingUser = await Vendor.findOne({ email });
    if (existingUser)
      return res.status(401).json({
        success: false,
        message: "Email already exists",
      });
    if (password.length < 8)
      return res.status(400).json({
        success: false,
        message: "Password must be minimum 8 characters",
      });
    const hashPass = bcrypt.hashSync(password, 10);
    await Vendor.create({
      name,
      email,
      password: hashPass,
      role: "vendor",
      categories,
    });
    let user = await Vendor.findOne({ email });
    sendToken(user, 201, res, "Account created successfully");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    const user = await Vendor.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    const compPass = bcrypt.compareSync(password, user.password);
    if (!compPass)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    sendToken(user, 200, res, "Logged in successfully");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out",
    });
};

export const getVendorDetails = async (req, res) => {
  try {
    const user = await Vendor.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const vendor = await Vendor.findById(id);
    if (!password)
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    const comparePass = bcrypt.compareSync(password, vendor.password);
    if (!comparePass)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });

    await Vendor.findByIdAndRemove(id);
    return res.status(200).json({ success: true, message: "Account deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//vendor filter
export const filterVendor = async (req, res) => {
  try {
    const vendors = await Vendor.find({
      categories: req.params.categories,
    });
    res.status(200).json(vendors);
  } catch (err) {
    res.status(500).json({ message: "Error getting vendors." });
  }
};

export const getVendorRequests = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const requests = await Request.find({ vendor: vendorId })
      .populate("user", "id name email")
      .select("user category item description status");
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const request = await Request.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const getFeedbacks = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const feedbacks = await Feedback.find({ vendor: vendorId })
      .populate({
        path: "ratings.user",
        select: "name",
        model: "user",
        options: { alias: "ratingsUser" },
      })
      .populate({
        path: "comments.user",
        select: "name",
        model: "user",
        options: { alias: "commentsUser" },
      })
      .select(
        "ratings.value ratingsUser.name comments.value commentsUser.name"
      );

    res.status(200).json(feedbacks);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
