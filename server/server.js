import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import callRouter from "./routes/callRoutes.js";
import Call from "./models/Call.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*" },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query && socket.handshake.query.userId;
  console.log(`User Connected: ${userId}`);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // WebRTC signaling is relayed through Socket.IO; media travels directly between callers.
  socket.on("call:offer", async ({ to, offer }, acknowledge) => {
    const targetSocketId = userSocketMap[to];
    if (!targetSocketId) return acknowledge?.({ success: false });
    const call = await Call.create({ callerId: userId, receiverId: to });
    io.to(targetSocketId).emit("call:incoming", { from: userId, offer, callId: call._id.toString() });
    acknowledge?.({ success: true, callId: call._id.toString() });
  });

  socket.on("call:answer", async ({ to, answer, callId }) => {
    const targetSocketId = userSocketMap[to];
    if (callId) await Call.findByIdAndUpdate(callId, { status: "completed" });
    if (targetSocketId) io.to(targetSocketId).emit("call:answer", { from: userId, answer });
  });

  socket.on("call:ice-candidate", ({ to, candidate }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) io.to(targetSocketId).emit("call:ice-candidate", { from: userId, candidate });
  });

  socket.on("call:end", async ({ to, callId, status = "completed" }) => {
    const targetSocketId = userSocketMap[to];
    if (callId) await Call.findByIdAndUpdate(callId, { status, endedAt: new Date() });
    if (targetSocketId) io.to(targetSocketId).emit("call:end", { from: userId });
  });

  socket.on("typing", ({ to, isTyping }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) io.to(targetSocketId).emit("typing", { from: userId, isTyping: Boolean(isTyping) });
  });

  socket.on("disconnect", (reason) => {
    console.log(`User Disconnected: ${userId} (${reason})`);
    // Only remove mapping if the disconnecting socket matches the stored socket id
    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Allow larger payloads for base64 image uploads (adjust as needed)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// Error handler for oversized payloads
app.use((err, req, res, next) => {
  if (err && (err.type === "entity.too.large" || err.status === 413)) {
    console.error("PayloadTooLargeError:", err.message || err);
    return res.status(413).json({ success: false, message: "Payload too large" });
  }
  next(err);
});

app.get("/api/status", (req, res) => res.send("Server is Live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/calls", callRouter);

await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is running on PORT:" + PORT));
