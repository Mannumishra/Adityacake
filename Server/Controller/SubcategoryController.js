const fs = require('fs');
const path = require('path');
const MainCategory = require("../Model/MainCategoryModel");
const Subcategory = require("../Model/SubcategoryModel");

// Helper function to delete an image file
const deleteImageFile = (relativeFilePath) => {
    const absolutePath = path.join(__dirname, "..", relativeFilePath);
    fs.unlink(absolutePath, (err) => {
        if (err) {
            console.error("Failed to delete image:", err);
        } else {
            console.log("Image deleted:", absolutePath);
        }
    });
};

// Create a new subcategory
const createSubcategory = async (req, res) => {
    const { categoryName, subcategoryName, subcategoryStatus } = req.body;
    const subcategoryImage = req.file ? req.file.path : null;

    if (!categoryName) {
        return res.status(400).json({ success: false, message: "Category Name is required" });
    }
    if (!subcategoryName) {
        return res.status(400).json({ success: false, message: "Sub Category Name is required" });
    }

    const validCategoryId = await MainCategory.findById(categoryName);
    if (!validCategoryId) {
        return res.status(404).json({ success: false, message: "Invalid Category Id" });
    }

    try {
        const subcategory = new Subcategory({
            categoryName,
            subcategoryName,
            subcategoryStatus: subcategoryStatus || "False",
            subcategoryImage
        });
        await subcategory.save();
        res.status(201).json({ message: "Subcategory created successfully", data: subcategory });
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

// Update a subcategory by ID and delete the old image if a new one is provided
const updateSubcategory = async (req, res) => {
    console.log(req.body)
    const { categoryName, subcategoryName, subcategoryStatus } = req.body;
    const subcategoryImage = req.file ? req.file.path : null;

    try {
        const subcategory = await Subcategory.findById(req.params.id);

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        // If a new image is provided, delete the old image
        if (subcategoryImage && subcategory.subcategoryImage) {
            deleteImageFile(subcategory.subcategoryImage);
        }

        // Update the subcategory with new data
        subcategory.categoryName = categoryName;
        subcategory.subcategoryName = subcategoryName;
        subcategory.subcategoryStatus = subcategoryStatus;
        if (subcategoryImage) {
            subcategory.subcategoryImage = subcategoryImage;
        }

        await subcategory.save();
        res.status(200).json({ message: "Subcategory updated successfully", data: subcategory });
    } catch (error) {
        console.error("Error updating subcategory:", error);
        res.status(500).json({ message: "Error updating subcategory", error });
    }
};

// Delete a subcategory by ID and delete the associated image
const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
        
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        // Delete the image if it exists
        if (subcategory.subcategoryImage) {
            deleteImageFile(subcategory.subcategoryImage);
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
