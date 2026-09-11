import User from "../models/user.js";
import FixedExpense from "../models/fixedExpenseModel.js";
import Expense from "../models/Expense.js";
import Notification from "../models/Notification.js";

// ==========================================
// Get Daily Budget Summary & Trigger Alerts
// ==========================================
export const getDailySummary = async (req, res) => {
    try {
        // 1. Get logged-in user ID from authentication middleware
        const userId = req.user.id;

        // 2. Fetch user data to check monthly allowance and alert preferences
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 3. Calculate total fixed expenses for the user
        const fixedExpenses = await FixedExpense.find({ userId });
        const totalFixedExpenses = fixedExpenses.reduce((sum, item) => sum + item.amount, 0);

        // 4. Calculate remaining days in the current month
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        // Get total days in the current month
        const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
        const remainingDays = totalDaysInMonth - now.getDate() + 1; // Include today

        // 5. Calculate the Safe Daily Limit
        const remainingMonthlyAllowance = user.monthlyAllowance - totalFixedExpenses;
        const safeDailyLimit = remainingDays > 0 ? (remainingMonthlyAllowance / remainingDays) : 0;

        // 6. Define start and end time for TODAY
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const endOfDay = new Date(now.setHours(23, 59, 59, 999));

        // 7. Get total expenses incurred TODAY
        const todaysExpenses = await Expense.find({
            userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        const totalSpentToday = todaysExpenses.reduce((sum, item) => sum + item.amount, 0);

        // 8. Calculate remaining balance for today
        const remainingDailyBalance = safeDailyLimit - totalSpentToday;
        const isOverBudget = totalSpentToday > safeDailyLimit && safeDailyLimit > 0;

        // 9. Auto-generate a Notification if budget is exceeded and alerts are enabled
        if (isOverBudget && user.preferences?.dailyLimitAlerts) {
            // Prevent duplicate alerts for the same day
            const existingAlert = await Notification.findOne({
                userId,
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            });

            if (!existingAlert) {
                const newNotification = new Notification({
                    userId,
                    title: "Daily Limit Exceeded!",
                    message: `You spent Rs. ${totalSpentToday.toFixed(2)} today. Your safe daily limit is Rs. ${safeDailyLimit.toFixed(2)}.`,
                    type: "warning"
                });
                await newNotification.save();
            }
        }

        // 10. Return 200 Success with dashboard data
        res.status(200).json({
            monthlyAllowance: user.monthlyAllowance,
            totalFixedExpenses,
            safeDailyLimit: safeDailyLimit > 0 ? Number(safeDailyLimit.toFixed(2)) : 0,
            totalSpentToday: Number(totalSpentToday.toFixed(2)),
            remainingDailyBalance: Number(remainingDailyBalance.toFixed(2)),
            isOverBudget
        });

    } catch (error) {
        // Return 500 Internal Server Error
        console.error("Error generating daily summary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};