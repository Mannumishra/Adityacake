const MainCategory = require("../Model/MainCategoryModel");
const Subcategory = require("../Model/SubcategoryModel");

// Create a new subcategory
const createSubcategory = async (req, res) => {
    const { categoryName, subcategoryName, subcategoryStatus } = req.body;

    // Validate required fields
    if (!categoryName) {
        return res.status(400).json({
            success: false,
            message: "Category Name is required"
        });
    }
    if (!subcategoryName) {
        return res.status(400).json({
            success: false,
            message: "Sub Category Name is required"
        });
    }

    // Check if category exists
    const validCategoryId = await MainCategory.findById(categoryName);
    if (!validCategoryId) {
        return res.status(404).json({
            success: false,
            message: "Invalid Category Id"
        });
    }

    try {
        const subcategory = new Subcategory({
            categoryName,
            subcategoryName,
            subcategoryStatus: subcategoryStatus || "False" // Set default status if not provided
        });
        await subcategory.save();
        res.status(201).json({
            message: "Subcategory created successfully",
            data: subcategory,
        });
    } catch (error) {
        console.error("Error creating subcategory:", error);
        res.status(500).json({ message: "Error creating subcategory", error });
    }
};

// Get all subcategories
const getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate("categoryName");
        res.status(200).json({ data: subcategories });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({ message: "Error fetching subcategories", error });
    }
};

// Get a single subcategory by ID
const getSubcategoryById = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate("categoryName");
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json({ data: subcategory });
    } catch (error) {
        console.error("Error fetching subcategory:", error);
        res.status(500).json({ message: "Error fetching subcategory", error });
    }
};

const updateSubcategory = async (req, res) => {
    const { categoryName, subcategoryName, subcategoryStatus } = req.body;
    console.log("Update Request Body:", req.body); // Log the request body

    try {
        const subcategory = await Subcategory.findByIdAndUpdate(
            req.params.id,
            {
                categoryName,
                subcategoryName,
                subcategoryStatus
            },
            { new: true }
        );

        console.log("Updated Subcategory:", subcategory); // Log the updated subcategory

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json({ message: "Subcategory updated successfully", data: subcategory });
    } catch (error) {
        console.error("Error updating subcategory:", error);
        res.status(500).json({ message: "Error updating subcategory", error });
    }
};

// Delete a subcategory by ID
const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        res.status(500).json({ message: "Error deleting subcategory", error });
    }
};

// Export all controller functions
module.exports = {
    createSubcategory,
    getAllSubcategories,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory,
};
