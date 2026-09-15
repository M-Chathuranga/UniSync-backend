import Notification from "../models/Notification.js";

// ==========================================
// Get all notifications for logged-in user
// ==========================================
export const getNotifications = async (req, res) => {
    try {
        // Get the authenticated user's ID from the JWT token
        const userId = req.user.id;

        // Fetch only THIS user's notifications, sorted newest first
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        // Return 200 Success with the notifications array
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ==========================================
// Mark a specific notification as read (Update)
// ==========================================
export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id; // Secure: only the owner can mark their notification

        // Find the notification AND verify it belongs to the logged-in user
        const notification = await Notification.findOne({ _id: notificationId, userId });

        if (!notification) {
            // Return 404 if not found OR if it belongs to another user (data isolation)
            return res.status(404).json({ message: "Notification not found" });
        }

        // Update the isRead field to true
        notification.isRead = true;
        await notification.save();

        // Return 200 Success with updated document
        res.status(200).json({
            message: "Notification marked as read",
            data: notification
        });
    } catch (error) {
        console.error("Error updating notification status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ==========================================
// Delete a specific notification (Delete)
// ==========================================
export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id; // Secure: only the owner can delete their notification

        // Find AND delete only if the notification belongs to the logged-in user
        const deletedNotification = await Notification.findOneAndDelete({
            _id: notificationId,
            userId  // Strict data isolation: prevents deleting another user's notification
        });

        if (!deletedNotification) {
            // Return 404 if not found OR if it belongs to another user
            return res.status(404).json({ message: "Notification not found" });
        }

        // Return 200 Success
        res.status(200).json({
            message: "Notification deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};