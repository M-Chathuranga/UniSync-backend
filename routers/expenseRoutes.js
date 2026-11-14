import express from 'express';
import { addExpense, getExpenses , addVoiceExpense, getCategoryExpenseSummary, getMonthlyExpenseSummary, updateExpense, deleteExpense} from '../controllers/expenseController.js';

const expenseRouter = express.Router();



expenseRouter.post('/add', addExpense);
expenseRouter.get('/', getExpenses);
expenseRouter.put('/:id', updateExpense); 
expenseRouter.delete('/:id', deleteExpense); 
expenseRouter.post("/voice", addVoiceExpense); 
expenseRouter.get('/summary/category', getCategoryExpenseSummary);
expenseRouter.get('/summary/monthly', getMonthlyExpenseSummary);

export default expenseRouter;