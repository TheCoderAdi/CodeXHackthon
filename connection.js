import mongoose from "mongoose";

mongoose.set("strictQuery", false);
export const connectToDB = (url) =>
  mongoose.connect(url, () => {
    console.log("Connected to the database");
  });
