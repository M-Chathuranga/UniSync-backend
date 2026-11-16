import express from "express";
import { createUser, deleteUser, loginUser,  } from "../controllers/authController.js";


const authRouter = express.Router();

// Public Authentication Routes
authRouter.post("/register",createUser );
authRouter.post("/login", loginUser);
authRouter.delete("/delete", deleteUser);



export default authRouter;