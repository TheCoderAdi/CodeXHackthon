import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
    required: true,
  },
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      value: { type: Number, required: true },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      value: { type: String },
    },
  ],
});

export const Feedback = mongoose.model("feedback", feedbackSchema);
