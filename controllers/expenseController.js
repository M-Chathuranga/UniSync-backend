import Expense from "../models/Expense.js";
import mongoose from "mongoose";
import User from "../models/user.js";

// ==========================================
// Add new daily/variable expense
// ==========================================
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

// ==========================================
// Get all daily expenses for logged-in user
// ==========================================
export const getExpenses = async (req, res) => {
    try {
        // Fetch securely using token ID, not URL parameters
        const userId = req.user.id; 

        // Find expenses and sort by newest first
        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ 
            message: "Internal server error" 
        });
    }
};


// ==========================================
// Add Expense via Voice Input
// ==========================================
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

// ==========================================
// Get Category-wise Expense Summary (Pie Chart)
// ==========================================
export const getCategoryExpenseSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        // Group total spending amount by category for the active user
        const summary = await Expense.aggregate([
            { 
                $match: { userId: new mongoose.Types.ObjectId(userId) } 
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