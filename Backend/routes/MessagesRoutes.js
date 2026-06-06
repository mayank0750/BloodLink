import express from "express";
import { createMessage } from "../controllers/MessageController.js";
import { getAllMessages } from "../controllers/MessageController.js";
import { deleteMessage } from "../controllers/MessageController.js";
import { protect, authorize } from '../middleware/auth.js'

const MessagesRoutes = express.Router();

MessagesRoutes.post("/", createMessage);
MessagesRoutes.get("/all", protect, authorize('admin'), getAllMessages);
MessagesRoutes.delete("/delete/:id", protect, authorize('admin'), deleteMessage);

export default MessagesRoutes;