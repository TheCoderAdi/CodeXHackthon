import { User } from "../models/User.js";
import { Message } from "../models/Message.js";
import bcrypt from "bcryptjs";
import sendToken from "../utils/jwttoken.js";
import { Request } from "../models/Request.js";
import { Vendor } from "../models/Vendor.js";
import { Feedback } from "../models/Feedback.js";

export const registerHandler = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    if (!name || !password || !email)
      return res.status(400).json({
        success: false,
        message: "Username , email and password are required",
      });
    const existingUser = await User.findOne({ email, name });
    if (existingUser)
      return res.status(401).json({
        success: false,
        message: "Username/Email already exists",
      });
    if (password.length < 8)
      return res.status(400).json({
        success: false,
        message: "Password must be minimum 8 charachter",
      });
    const hashPass = bcrypt.hashSync(password, 10);
    await User.create({
      name,
      email,
      password: hashPass,
      role: "user",
    });
    let user = await User.findOne({ email });
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
    const user = await User.findOne({ email });
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
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
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
    const userId = await User.findById(id);
    if (!password)
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    const comparePass = bcrypt.compareSync(password, userId.password);
    if (!comparePass)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });

    await User.findByIdAndRemove(id);
    return res.status(200).json({ success: true, message: "Account deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createRequest = async (req, res) => {
  try {
    const { category, item, description } = req.body;
    if (!category || !item || !description)
      return res
        .status(400)
        .json({ success: false, message: "All fields are mandatory" });
    const userId = req.user.id;
    let vendors;
    if (category === "food")
      vendors = await Vendor.find({ categories: "food" });
    else vendors = await Vendor.find({ categories: "medical" });

    // create request for each food vendor
    const requests = await Promise.all(
      vendors.map(async (vendor) => {
        const request = await Request.create({
          user: userId,
          vendor: vendor._id,
          category,
          item,
          description,
        });

        const message = await Message.create({
          user: userId,
          vendor: vendor._id,
          message: `New ${category} request from user ${userId}`,
          messageType: "newFoodRequest",
        });

        return request;
      })
    );

    res
      .status(201)
      .json({ success: true, message: "Request sent to the vendors" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
//feedback system
export const giveFeedback = async (req, res) => {
  try {
    const { vendorID } = req.params;
    const { ratings, comments } = req.body;

    // Check if the vendor exists
    const vendor = await Vendor.findById(vendorID);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    let user = req.user.id;
    // Create the feedback object
    const feedback = new Feedback({
      vendor: vendorID,
      ratings: [
        {
          user,
          value: ratings,
        },
      ],
      comments: [
        {
          user,
          value: comments,
        },
      ],
    });

    // Save the feedback to the database
    await feedback.save();

    res
      .status(201)
      .json({ success: true, message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
