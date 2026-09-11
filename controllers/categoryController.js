import Category from "../models/Category.js";

// Create a customer category

async function createCategory(req,res) {

    try {
        const { name, icon } = req.body;
        const userId = req.user.id;

        if (!name) {
            return res.status(400).json({ message: "Category name is required." });
        }

        const newCategory = new Category({ userId, name, icon });
        await newCategory.save();

        res.status(201).json({
            message: "Category created successfully",
            data: newCategory
        });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get categories for logged in user
async function getCategories  (req, res)  {
    try {
        const userId = req.user.id;
        const categories = await Category.find({ userId });

        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
    

export { createCategory, getCategories };
