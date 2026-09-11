import mongoose from "mongoose";

// Define schema for storing user notifications and budget alerts
const notificationSchema = new mongoose.Schema({
    // Reference to the User model using ObjectId
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // Title of the notification alert
    title: {
        type: String,
        required: true
    },
    // Detailed notification message content
    message: {
        type: String,
        required: true
    },
    // Category type of notification (e.g., "warning", "info")
    type: {
        type: String,
        default: "warning"
    },
    // Status flag to track if the user has viewed the notification
    isRead: {
        type: Boolean,
        default: false
    }
}, { 
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true 
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;