import FixedExpense from '../models/fixedExpenseModel.js';
import User from '../models/user.js';

// ==========================================
// Add a Fixed Expense (recurring bill/subscription)
// POST /fixedexpenses
// ==========================================
export const addFixedExpense = async (req, res) => {
    try {
        const { title, amount } = req.body;

        // Validate required fields
        if (!title || amount === undefined) {
            return res.status(400).json({ message: "Title and amount are required." });
        }

        // Get the authenticated user's ID from the JWT token payload
        const userId = req.user.id;

        // Create and save new fixed expense document
        const newExpense = new FixedExpense({ userId, title, amount });
        await newExpense.save();

        res.status(201).json({
            message: "Fixed expense added successfully",
            data: newExpense
        });
    } catch (error) {
        console.error("Error adding fixed expense:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ==========================================
// Get all Fixed Expenses for logged-in user
// GET /fixedexpenses
// ==========================================
export const getFixedExpenses = async (req, res) => {
    try {
        // Get the authenticated user's ID from the JWT token payload
        const userId = req.user.id;

        // Fetch only this user's fixed expenses, sorted alphabetically by title
        const expenses = await FixedExpense.find({ userId }).sort({ title: 1 });

        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching fixed expenses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ==========================================
// Calculate Safe Daily Limit
// POST /fixedexpenses/calculate-limit
// ==========================================
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

        // 4. Safe Daily Limit Formula: (Monthly Allowance - Fixed Costs) / Remaining Days
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
        res.status(500).json({ message: "Internal server error" });
    }
};