import express from 'express';
import { addFixedExpense, getSafeDailyLimit } from '../controllers/fixedExpenseController.js';

const fixedExpenseRouter = express.Router();

fixedExpenseRouter.post('/add', addFixedExpense);
fixedExpenseRouter.post('/calculate-limit', getSafeDailyLimit);

export default fixedExpenseRouter;