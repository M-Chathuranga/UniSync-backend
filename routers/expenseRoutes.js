import express from 'express';
import { addExpense, getExpenses , addVoiceExpense, getCategoryExpenseSummary, getMonthlyExpenseSummary} from '../controllers/expenseController.js';

const expenseRouter = express.Router();



expenseRouter.post('/add', addExpense);
expenseRouter.post("/voice", addVoiceExpense); // Voice Logging Endpoint
expenseRouter.get('/', getExpenses);
expenseRouter.get('/summary/category', getCategoryExpenseSummary);
expenseRouter.get('/summary/monthly', getMonthlyExpenseSummary);

export default expenseRouter;