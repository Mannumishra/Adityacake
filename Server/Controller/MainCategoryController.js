const fs = require("fs");
const path = require("path");
const MainCategory = require("../Model/MainCategoryModel");


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

// Create Main Category
const createMainCategory = async (req, res) => {
    try {
        const { mainCategoryName, mainCategoryStatus } = req.body;
        const mainCategoryImage = req.file ? req.file.path : null;

        if (!mainCategoryName || !mainCategoryImage) {
            if (mainCategoryImage) deleteImageFile(mainCategoryImage);
            return res.status(400).json({ message: "Main category name and image are required." });
        }

        const newCategory = new MainCategory({
            mainCategoryName,
            mainCategoryImage,
            mainCategoryStatus: mainCategoryStatus || "False",
        });

        await newCategory.save();
        res.status(201).json({ message: "Main Category created successfully", data: newCategory });
    } catch (error) {
        if (req.file) deleteImageFile(req.file.path);
        console.error("Error creating main category:", error);
        res.status(500).json({ message: "Error creating main category", error: error.message });
    }
};

const updateMainCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { mainCategoryName, mainCategoryStatus } = req.body;
        const mainCategoryImage = req.file ? req.file.path : null;

        const category = await MainCategory.findById(id);
        if (!category) {
            if (mainCategoryImage) deleteImageFile(mainCategoryImage);
            return res.status(404).json({ message: "Main Category not found" });
        }

        // Delete old image if a new one is uploaded
        if (mainCategoryImage && category.mainCategoryImage) {
            deleteImageFile(category.mainCategoryImage);
        }

        category.mainCategoryName = mainCategoryName || category.mainCategoryName;
        category.mainCategoryImage = mainCategoryImage || category.mainCategoryImage;
        category.mainCategoryStatus = mainCategoryStatus || category.mainCategoryStatus;

        await category.save();
        res.status(200).json({ message: "Main Category updated successfully", data: category });
    } catch (error) {
        if (req.file) deleteImageFile(req.file.path);
        console.error("Error updating main category:", error);
        res.status(500).json({ message: "Error updating main category", error: error.message });
    }
};


// Delete Main Category
const deleteMainCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await MainCategory.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: "Main Category not found" });
        }

        // Delete the image file from local storage
        if (category.mainCategoryImage) {
            deleteImageFile(category.mainCategoryImage);
        }

        res.status(200).json({ message: "Main Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting main category:", error);
        res.status(500).json({ message: "Error deleting main category", error: error.message });
    }
};

// Get All Main Categories
const getAllMainCategories = async (req, res) => {
    try {
        const categories = await MainCategory.find();
        res.status(200).json({ message: "Main Categories retrieved successfully", data: categories });
    } catch (error) {
        console.error("Error retrieving main categories:", error);
        res.status(500).json({ message: "Error retrieving main categories", error: error.message });
    }
};

// Get Single Main Category by ID
const getSingleMainCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await MainCategory.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Main Category not found" });
        }

        res.status(200).json({ message: "Main Category retrieved successfully", data: category });
    } catch (error) {
        console.error("Error retrieving main category:", error);
        res.status(500).json({ message: "Error retrieving main category", error: error.message });
    }
};

module.exports = {
    createMainCategory,
    updateMainCategory,
    deleteMainCategory,
    getAllMainCategories,
    getSingleMainCategory,
};

