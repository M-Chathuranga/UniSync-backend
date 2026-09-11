import User from "../models/user.js";

// Update Monthly Allowance

async function updateMonthlyAllowance(req, res) {
    try {
        const userId = req.user.id; // Get user ID from authenticated token payload
        const { monthlyAllowance } = req.body;

        // Validate allowance input
        if (monthlyAllowance === undefined || monthlyAllowance < 0) {
            return res.status(400).json({ message: "Invalid monthly allowance value" });
        }

        // Find user by ID and update the monthlyAllowance field
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { monthlyAllowance },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Monthly allowance updated successfully",
            monthlyAllowance: updatedUser.monthlyAllowance
        });

    } catch (error) {
        console.error("Error updating monthly allowance:", error);
        res.status(500).json({ message: "Error updating monthly allowance" });
    }
}

export { updateMonthlyAllowance };