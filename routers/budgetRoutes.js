import express from "express";
import { addDailyExpense, getDailyExpenses } from "../controllers/budgetController.js";

const budgetRouter = express.Router();


budgetRouter.get("/:userId", getDailyExpenses);
budgetRouter.post("/", addDailyExpense);

export default budgetRouter;