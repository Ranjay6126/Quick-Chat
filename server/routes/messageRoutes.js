import express from "express";
import {protectRoute} from "../middleware/auth.js"
import { getMessages, getUserForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUserForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send", protectRoute, sendMessage);   

export default messageRouter;
