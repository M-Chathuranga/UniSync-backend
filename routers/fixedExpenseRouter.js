import express from 'express';
import { addFixedExpense, getSafeDailyLimit } from '../controllers/fixedExpenseController.js';

const router = express.Router();

router.post('/add', addFixedExpense);
router.post('/calculate-limit', getSafeDailyLimit);

export default router;