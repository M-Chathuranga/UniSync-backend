import mongoose from 'mongoose';

const fixedExpenseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true // e.g., Boarding Fee, Electricity Bill
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('FixedExpense', fixedExpenseSchema);