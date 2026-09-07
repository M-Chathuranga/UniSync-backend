import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email : {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true 
        },
        firstName : {
            type: String,
            required: true,
            trim: true
        },
        lastName : {
            type: String,
            required: true,
            trim: true
        },
        password : {
            type: String,
            required: true    
        },
        isEmailVerified : {
            type: Boolean,
            default: false,
            required: true
        },
        image : {
            type: String,
            default :"/images/default-profile.png"
        },
        monthlyAllowance : {
            type: Number,
            default: 0         // to calculate daily limit
        },
        preferences : {
            dailyLimitAlerts : {
                type: Boolean,
                default: true   // UI settings screen to toggle switch
            },
            voiceLogging : {
                type: Boolean,
                default: true   // to voice input toggle
            }            
        },       
    },
    
    {
        timestamps: true
    }

)

const User = mongoose.model('User', userSchema);
export default User;