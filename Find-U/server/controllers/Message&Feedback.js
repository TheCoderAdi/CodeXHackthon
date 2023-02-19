import { Feedback } from "../models/Feedback.js";
import { Message } from "../models/Message.js";

export const giveFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { vendorI } = req.params;
    const userId = req.user.id;
    const newFeedback = new Feedback({
      vendor: vendorI,
      ratings: [{ user: userId, value: rating }],
      comments: [{ user: userId, value: comment }],
    });
    await newFeedback.save();
    res.status(201).json({ success: true, newFeedback });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

export const particularVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const feedbacks = await Feedback.find({ vendor: vendorId }).populate(
      "ratings.user",
      "name"
    );
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

export const newMessage = async (req, res) => {
  try {
    const { vendorId, message } = req.body;
    const userId = req.user.id;
    const newMessage = new Message({
      user: userId,
      vendor: vendorId,
      message,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

export const particularMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const vendorId = req.params.vendorId;
    const messages = await Message.find({ user: userId, vendor: vendorId });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
export const vendorMessages = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const userId = req.params.userId;
    const messages = await Message.find({ vendor: vendorId, user: userId });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

export const allMessageUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const messages = await Message.find({ user: userID })
      .populate("user", "name")
      .populate("vendor", "name message");
    if (!messages || messages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "You don't have any messages" });
    }
    const filterMessage = messages.filter(
      (message) => message.messageType !== "newFoodRequest"
    );
    const formattedMessages = filterMessage.map((message) => ({
      user: message.user.name,
      vendor: message.vendor.name,
      vendorId: message.vendor._id,
      message: message.message,
      createdAt: message.createdAt,
    }));
    return res.status(200).json({
      success: true,
      messages: formattedMessages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
export const allMessagesVendor = async (req, res) => {
  try {
    const { vendorID } = req.params;
    const messages = await Message.find({ vendor: vendorID })
      .populate("user", "name")
      .populate("vendor", "name message");
    if (!messages || messages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "You don't have any messages" });
    }
    const filterMessage = messages.filter(
      (message) => message.messageType !== "newFoodRequest"
    );
    const formattedMessages = filterMessage.map((message) => ({
      user: message.user.name,
      vendor: message.vendor.name,
      userId: message.user._id,
      message: message.message,
      createdAt: message.createdAt,
    }));
    return res.status(200).json({
      success: true,
      messages: formattedMessages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
