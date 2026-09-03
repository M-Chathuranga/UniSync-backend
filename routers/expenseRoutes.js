import express from 'express';
import { addDailyExpense, getDailyExpenses } from '../controllers/dailyExpenseController.js';

const router = express.Router();

router.post('/add', addDailyExpense);
router.get('/:userId', getDailyExpenses);

export default router;