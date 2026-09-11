// controllers/settingController.js
import User from "../models/user.js";

// ==========================================
// Fetch User Profile & Settings for UI
// ==========================================
export const getSettings = async (req, res) => {
    try {
        // Get logged-in user ID securely from token payload
        const userId = req.user.id;

        // Fetch user data excluding sensitive password field
        const user = await User.findById(userId).select(
            "firstName lastName email image monthlyAllowance preferences"
        );

        // Return 404 if user is not found in database
        if (!user) {
            return res.status(404).json({
                message: "User profile not found."
            });
        }

        // Return user settings with 200 Success status
        res.status(200).json({
            message: "Settings retrieved successfully",
            data: user
        });
    } catch (error) {
        // Log error details for server logs
        console.error("Error fetching settings:", error);

        // Return 500 Internal Server Error status
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// ==========================================
// Update Budget Settings & User Preferences
// ==========================================
export const updateSettings = async (req, res) => {
    try {
        // Get logged-in user ID securely from token payload
        const userId = req.user.id;

        // Extract settings fields from request body
        const { monthlyAllowance, dailyLimitAlerts, voiceLogging, appearance } = req.body;

        // Build dynamic object to update only provided values
        const updateData = {};

        if (monthlyAllowance !== undefined) {
            updateData.monthlyAllowance = monthlyAllowance;
        }
        if (dailyLimitAlerts !== undefined) {
            updateData["preferences.dailyLimitAlerts"] = dailyLimitAlerts;
        }
        if (voiceLogging !== undefined) {
            updateData["preferences.voiceLogging"] = voiceLogging;
        }
        if (appearance !== undefined) {
            updateData["preferences.appearance"] = appearance;
        }

        // Update user record in database and return new updated document
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("firstName lastName email image monthlyAllowance preferences");

        // Return 404 if user does not exist
        if (!updatedUser) {
            return res.status(404).json({
                message: "User profile not found."
            });
        }

        // Return updated settings with 200 Success status
        res.status(200).json({
            message: "Settings updated successfully",
            data: updatedUser
        });
    } catch (error) {
        // Log error details for server logs
        console.error("Error updating settings:", error);

        // Return 500 Internal Server Error status
        res.status(500).json({
            message: "Internal server error"
        });
    }
};