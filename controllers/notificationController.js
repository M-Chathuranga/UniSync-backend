import Notification from "../models/Notification.js";

// ==========================================
// Get all notifications for logged-in user
// ==========================================
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch notifications from database and sort by newest first
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        // Return 200 Success with data
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

        // Update the isRead field to true
        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true } // Return updated document
        );

        if (!updatedNotification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Return 200 Success
        res.status(200).json({
            message: "Notification marked as read",
            data: updatedNotification
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

        // Find the notification and delete it
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);

        if (!deletedNotification) {
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