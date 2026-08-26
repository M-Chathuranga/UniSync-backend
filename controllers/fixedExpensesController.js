import FixedExpense from '../models/fixedExpenseModel.js';

//Calculate Fixed Expense 
export const addFixedExpense = async (req, res) => {
    try {
        const { userId, title, amount } = req.body;
        const newExpense = new FixedExpense({ userId, title, amount });
        await newExpense.save();
        
        res.status(201).json({ message: "Expense added successfully", data: newExpense });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Safe Daily Limit calculation

export const getSafeDailyLimit = async (req, res) => {
    try {
        const { userId, monthlyAllowance, remainingDays } = req.body;

        // User's fixed expenses
        const expenses = await FixedExpense.find({ userId });
        const totalFixedExpenses = expenses.reduce((acc, item) => acc + item.amount, 0);

        // Safe Daily Limit Formula
        const remainingBalance = monthlyAllowance - totalFixedExpenses;
        const safeDailyLimit = remainingBalance / remainingDays;

        res.status(200).json({
            monthlyAllowance,
            totalFixedExpenses,
            remainingBalance,
            safeDailyLimit: safeDailyLimit > 0 ? safeDailyLimit : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};