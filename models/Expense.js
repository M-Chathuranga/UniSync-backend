import mongoose from "mongoose";

// Define schema for day-to-day variable expenses
const expenseSchema = new mongoose.Schema({
    // Properly reference the User ID using ObjectId
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    
    isVoiceEntry: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
    
}, { 
    timestamps: true 
});

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;