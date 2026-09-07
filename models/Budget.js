import mongoose from 'mongoose';

const dailyExpenseSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
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
    category: { 
        type: String, 
        default: 'General' 
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

export default mongoose.model('DailyExpense', dailyExpenseSchema);