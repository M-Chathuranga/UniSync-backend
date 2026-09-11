import express from "express";
import { updateMonthlyAllowance } from "../controllers/userController.js";
import authenticateUser from "../middlewares/authentication.js";


const userRouter = express.Router();


userRouter.put('/allowance', authenticateUser, updateMonthlyAllowance)

export default userRouter;