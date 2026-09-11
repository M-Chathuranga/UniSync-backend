import FixedExpense from '../models/fixedExpenseModel.js';
import User from '../models/user.js';

//add a Fixed Expense 
export const addFixedExpense = async (req, res) => {
    try {
        const {title, amount } = req.body;

        const userId = req.user.id || req.user._id; // Assuming you have user authentication and the user ID is available in req.user
        
        // create and save new fixedd  expense
        const newExpense = new FixedExpense({ userId, title, amount });
        await newExpense.save();
        
        res.status(201).json(
            {
                 message: "Expense added successfully", 
                 data: newExpense 

            }
        );
    } catch (error) {
        console.error("Error adding fixed expense:", error);
        res.status(500).json(
            {
                 message: error.message 
            }
        );
    }
};

// Safe Daily Limit calculation

export const getSafeDailyLimit = async (req, res) => {
    try {
        const userId = req.user.id;
        const { remainingDays } = req.body; // Expected from frontend calendar

        if (!remainingDays || remainingDays <= 0) {
            return res.status(400).json({ message: "Invalid remaining days" });
        }

        // 1. Fetch the user to get their configured monthly allowance
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Fetch all fixed expenses for this user
        const expenses = await FixedExpense.find({ userId });
        
        // 3. Calculate total fixed expenses sum
        const totalFixedExpenses = expenses.reduce((acc, item) => acc + item.amount, 0);

        // 4. Safe Daily Limit Formula
        const remainingBalance = user.monthlyAllowance - totalFixedExpenses;
        const safeDailyLimit = remainingBalance / remainingDays;

        res.status(200).json({
            monthlyAllowance: user.monthlyAllowance,
            totalFixedExpenses,
            remainingBalance,
            safeDailyLimit: safeDailyLimit > 0 ? safeDailyLimit : 0
        });

    } catch (error) {
        console.error("Error calculating limit:", error);

        res.status(500).json(
            { message: error.message });
    }
};