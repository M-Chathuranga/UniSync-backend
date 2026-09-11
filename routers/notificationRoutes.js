import express from "express";
import { getNotifications, markAsRead, deleteNotification } from "../controllers/notificationController.js";

const notificationRouter = express.Router();

// Route: GET /notifications/
notificationRouter.get("/", getNotifications);

// Route: PUT /notifications/:notificationId/read
notificationRouter.put("/:notificationId/read", markAsRead);

// Route: DELETE /notifications/:notificationId
notificationRouter.delete("/:notificationId", deleteNotification);

export default notificationRouter;