import express from "express";
import { getDailySummary } from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();

// Route: GET /dashboard/summary
dashboardRouter.get("/summary", getDailySummary);

export default dashboardRouter;