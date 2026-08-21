import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getCallHistory, getMyCallHistory } from "../controllers/callController.js";

const callRouter = express.Router();
callRouter.get("/my", protectRoute, getMyCallHistory);
callRouter.get("/:userId", protectRoute, getCallHistory);

export default callRouter;
