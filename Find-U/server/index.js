import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./connection.js";
import userRouter from "./routes/User.js";
import vendorRouter from "./routes/Vendor.js";
import messaggeRouter from "./routes/Message.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import { Message } from "./models/Message.js";

const app = express();
dotenv.config();
const server = http.createServer(app);

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//Configure the dotenv
connectToDB(process.env.MONGO_URI);
//listening the port
server.listen(process.env.PORT, () => {
  console.log("Server is connected");
});
app.get("/", (req, res) => {
  res.send("<h1>Hello from server</h1>");
});
app.use("/user", userRouter);
app.use("/vendor", vendorRouter);
app.use("/message", messaggeRouter);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
io.on("connection", (socket) => {
  // Listen for new messages from clients
  socket.on("new message", async (msg) => {
    try {
      // Create new message and save to the database
      const newMessage = new Message({
        user: msg.user,
        vendor: msg.vendor,
        message: msg.message,
        messageType: "otherMessages",
      });
      await newMessage.save();

      // Broadcast the new message to all clients except sender
      socket.broadcast.emit("new message", newMessage);
    } catch (error) {
      console.error(error);
    }
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
