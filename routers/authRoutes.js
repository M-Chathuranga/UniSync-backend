import express from "express";
import { createUser, loginUser,  } from "../controllers/authController.js";


const authRouter = express.Router();

// Public Authentication Routes
authRouter.post("/register",createUser );
authRouter.post("/login", loginUser);



export default authRouter;