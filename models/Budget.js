import mongoose from "mongoose";

// Budget model — stores user-defined monthly budget targets per category (optional feature)
const budgetSchema = new mongoose.Schema({
    // Reference to the User who owns this budget entry
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // Category this budget applies to (e.g., "Food", "Transport")
    category: {
        type: String,
        required: true,
        trim: true
    },
    // The maximum amount the user wants to spend in this category per month
    limitAmount: {
        type: Number,
        required: true,
        min: 0
    },
    // The month this budget applies to (1 = January, 12 = December)
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    // The year this budget applies to (e.g., 2026)
    year: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
