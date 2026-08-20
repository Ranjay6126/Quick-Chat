import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getCallHistory } from "../controllers/callController.js";

const callRouter = express.Router();
callRouter.get("/:userId", protectRoute, getCallHistory);

export default callRouter;
