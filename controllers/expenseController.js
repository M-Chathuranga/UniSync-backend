import Expense from "../models/Expense.js";
import mongoose from "mongoose";
import User from "../models/user.js";


const getCurrentMonthRange = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { startOfMonth, endOfMonth };
};


// Add new daily expense

export const addExpense = async (req, res) => {
    try {
        const { title, amount, category } = req.body;
        
        // Ensure user ID is securely taken from the authenticated token
        const userId = req.user.id; 

        // Create new expense record
        const newExpense = new Expense({ userId, title, amount, category });
        await newExpense.save();

        res.status(201).json({ 
            message: "Expense added successfully", 
            data: newExpense 
        });
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ 
            message: "Internal server error" 
        });
    }
};

// Get current month's expenses for logged-in user

export const getExpenses = async (req, res) => {
    try {
        // Fetch securely using token ID, not URL parameters
        const userId = req.user.id; 

        // Get the date range for the current month
        const { startOfMonth, endOfMonth } = getCurrentMonthRange();

        // Find expenses within the current month and sort by newest first
        const expenses = await Expense.find({
            userId,
            date: { $gte: startOfMonth, $lt: endOfMonth }
        }).sort({ date: -1 });

        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ 
            message: "Internal server error" 
        });
    }
};

// Update an Expence 

export const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount, category } = req.body;
        const userId = req.user.id;

        // Validate that the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid expense ID" });
        }

        // Update the expense only if it belongs to the logged-in user
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: id, userId },
            {
                ...(title && { title }),
                ...(amount !== undefined && { amount: Number(amount) }),
                ...(category && { category })
            },
            { new: true, runValidators: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found or unauthorized" });
        }

        res.status(200).json({
            message: "Expense updated successfully",
            data: updatedExpense
        });
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete an Expense

export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid expense ID" });
        }

        // Delete the expense only if it belongs to the logged-in user
        const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId });

        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found or unauthorized" });
        }

        res.status(200).json({
            message: "Expense deleted successfully",
            id
        });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add Expense via Voice Input

export const addVoiceExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const { voiceText } = req.body;

        // 1. Validate that voice text was provided
        if (!voiceText) {
            return res.status(400).json({
                message: "Voice transcript text is required."
            });
        }

        // 2. Verify the user exists in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // 3. Extract numeric amount from transcribed string using regex
        const amountMatch = voiceText.match(/\d+/);
        const amount = amountMatch ? parseFloat(amountMatch[0]) : null;

        if (!amount) {
            return res.status(400).json({
                message: "Could not detect a valid numeric amount from voice input."
            });
        }

        // 4. Extract title by stripping amount and filler words from text
        const title = voiceText
            .replace(/\d+/g, '')
            .replace(/(spent|rupees|rs|for|on|bought)/gi, '')
            .trim() || "Voice Expense";

        // 5. Auto-categorize by keyword matching
        let category = "Other";
        const lowerText = voiceText.toLowerCase();

        if (lowerText.includes("lunch") || lowerText.includes("dinner") || lowerText.includes("food") || lowerText.includes("tea") || lowerText.includes("canteen")) {
            category = "Food";
        } else if (lowerText.includes("bus") || lowerText.includes("train") || lowerText.includes("cab") || lowerText.includes("fuel") || lowerText.includes("fare")) {
            category = "Transport";
        } else if (lowerText.includes("boarding") || lowerText.includes("rent") || lowerText.includes("hostel")) {
            category = "Boarding";
        } else if (lowerText.includes("book") || lowerText.includes("study") || lowerText.includes("photocopy") || lowerText.includes("print")) {
            category = "Study";
        } else if (lowerText.includes("doctor") || lowerText.includes("medicine") || lowerText.includes("pharmacy")) {
            category = "Medical";
        }

        // 6. Create and save the voice expense with isVoiceEntry flag set to true
        const newVoiceExpense = new Expense({
            userId,
            title,
            amount,
            category,
            isVoiceEntry: true  // Flag this record as a voice-logged expense
        });

        await newVoiceExpense.save();

        res.status(201).json({
            message: "Voice expense logged successfully",
            data: newVoiceExpense
        });

    } catch (error) {
        console.error("Error processing voice expense:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};


// Get Category-wise current month Expense Summary (Pie Chart)

export const getCategoryExpenseSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startOfMonth, endOfMonth } = getCurrentMonthRange();

        // Group total spending amount by category for the active user
        const summary = await Expense.aggregate([
            { 
                $match: { userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                 } 
            },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    totalAmount: 1
                }
            }
        ]);

        res.status(200).json({
            message: "Category expense summary retrieved successfully",
            data: summary
        });

    } catch (error) {
        console.error("Error fetching category summary:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// ==========================================
// Get Monthly Expense Summary (Bar Chart / Line Chart)
// ==========================================
export const getMonthlyExpenseSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startOfMonth, endOfMonth } = getCurrentMonthRange();

        // Group expenses by month and year to show monthly spending trends
        const summary = await Expense.aggregate([
            { 
                $match: { userId: new mongoose.Types.ObjectId(userId) } 
            },
            {
                $group: {
                    _id: { 
                        year: { $year: "$date" }, 
                        month: { $month: "$date" } 
                    },
                    totalAmount: { $sum: "$amount" }
                }
            },
            { 
                $sort: { "_id.year": 1, "_id.month": 1 } 
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    totalAmount: 1
                }
            }
        ]);

        res.status(200).json({
            message: "Monthly expense summary retrieved successfully",
            data: summary
        });

    } catch (error) {
        console.error("Error fetching monthly summary:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};