import mongoose from 'mongoose';

const fixedExpenseSchema = new mongoose.Schema({
    userId: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

const FixedExpense = mongoose.model('FixedExpense', fixedExpenseSchema);
export default FixedExpense;