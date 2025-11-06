



import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userID).select("-Passwrod");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
