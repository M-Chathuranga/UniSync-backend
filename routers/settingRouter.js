// routers/settingRouter.js
import express from "express";
import { getSettings, updateSettings } from "../controllers/settingController.js";

const settingRouter = express.Router();

// GET /settings - Retrieve user profile and settings
settingRouter.get("/", getSettings);

// PUT /settings - Update allowance or preferences (Toggles/Theme)
settingRouter.put("/", updateSettings);

export default settingRouter;