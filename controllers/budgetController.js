// daily expense limit is calculated based on monthly allowanceimport DailyExpense from '../models/dailyExpenseModel.js';
import DailyExpense from '../models/Budget.js';
// Add new daily expense
export const addDailyExpense = async (req, res) => {
    try {
        const { userId, title, amount, category } = req.body;
        const newExpense = new DailyExpense({ userId, title, amount, category });
        await newExpense.save();
        res.status(201).json({ message: "Daily expense added successfully", data: newExpense });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all daily expenses for a user
export const getDailyExpenses = async (req, res) => {
    try {
        const { userId } = req.params;
        const expenses = await DailyExpense.find({ userId }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

