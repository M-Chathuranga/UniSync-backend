import express from 'express';
import { addFixedExpense, getFixedExpenses, getSafeDailyLimit } from '../controllers/fixedExpenseController.js';

const fixedExpenseRouter = express.Router();

// Route: POST /fixedexpenses — add a new recurring fixed expense (rent, subscriptions, etc.)
fixedExpenseRouter.post('/', addFixedExpense);

// Route: GET /fixedexpenses — get all fixed expenses for the logged-in user
fixedExpenseRouter.get('/', getFixedExpenses);

// Route: POST /fixedexpenses/calculate-limit — calculate safe daily limit based on remaining days
fixedExpenseRouter.post('/calculate-limit', getSafeDailyLimit);

export default fixedExpenseRouter;