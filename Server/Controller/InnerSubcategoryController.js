const fs = require("fs");
const path = require("path");
const InnerSubcategory = require("../Model/InnerSubcategoryModel");


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

exports.createInnerSubcategory = async (req, res) => {
    console.log(req.body)
    try {
        const { categoryName, subcategoryName, innerSubcategoryName, Status } = req.body;

        if (!categoryName || !subcategoryName || !innerSubcategoryName) {
            if (req.file) {
                deleteImageFile(req.file.path); // Delete uploaded file if validation fails
            }
            return res.status(400).json({ message: "All fields are required." });
        }

        const Image = req.file ? req.file.path : null;
        const newInnerSubcategory = new InnerSubcategory({
            categoryName,
            subcategoryName,
            innerSubcategoryName,
            Image,
            Status,
        });

        const savedInnerSubcategory = await newInnerSubcategory.save();
        res.status(201).json({
            message: "Inner Subcategory created successfully.",
            data: savedInnerSubcategory,
        });
    } catch (error) {
        console.error("Error creating inner subcategory:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};
// Get all Inner Subcategories
exports.getAllInnerSubcategories = async (req, res) => {
    try {
        const innerSubcategories = await InnerSubcategory.find()
            .populate("categoryName")
            .populate("subcategoryName")
            .exec();

        res.status(200).json({
            message: "Inner Subcategories fetched successfully.",
            data: innerSubcategories,
        });
    } catch (error) {
        console.error("Error fetching inner subcategories:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// Get a single Inner Subcategory by ID
exports.getInnerSubcategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const innerSubcategory = await InnerSubcategory.findById(id)
            .populate("categoryName")
            .populate("subcategoryName")
            .exec();

        if (!innerSubcategory) {
            return res.status(404).json({ message: "Inner Subcategory not found." });
        }

        res.status(200).json({
            message: "Inner Subcategory fetched successfully.",
            data: innerSubcategory,
        });
    } catch (error) {
        console.error("Error fetching inner subcategory:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

exports.updateInnerSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName, subcategoryName, innerSubcategoryName, Status } = req.body;
        let Image = req.file ? req.file.path : null;  // Get new image path if updated

        // Fetch the existing inner subcategory to check for the old image
        const innerSubcategory = await InnerSubcategory.findById(id);

        if (!innerSubcategory) {
            return res.status(404).json({ message: "Inner Subcategory not found." });
        }

        // Prepare the updated data object
        const updatedData = {
            categoryName,
            subcategoryName,
            innerSubcategoryName,
            Status,
        };

        // If a new image is uploaded and it is different from the old one, delete the old image
        if (Image && innerSubcategory.Image && innerSubcategory.Image !== Image) {
            deleteImageFile(innerSubcategory.Image); // Delete the old image
            updatedData.Image = Image;  // Set the new image path
        } else if (Image) {
            updatedData.Image = Image;  // Only update the image if it's new
        }

        // Update the inner subcategory in the database
        const updatedInnerSubcategory = await InnerSubcategory.findByIdAndUpdate(id, updatedData, { new: true })
            .populate("categoryName")
            .populate("subcategoryName");

        if (!updatedInnerSubcategory) {
            return res.status(404).json({ message: "Inner Subcategory not found." });
        }

        res.status(200).json({
            message: "Inner Subcategory updated successfully.",
            data: updatedInnerSubcategory,
        });
    } catch (error) {
        console.error("Error updating inner subcategory:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};


exports.deleteInnerSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        const innerSubcategory = await InnerSubcategory.findById(id);

        if (!innerSubcategory) {
            return res.status(404).json({ message: "Inner Subcategory not found." });
        }

        // Delete the image from the local folder if it exists
        if (innerSubcategory.Image) {
            deleteImageFile(innerSubcategory.Image); // Use the utility function to delete the image
        }

        // Delete the inner subcategory from the database
        await innerSubcategory.deleteOne();

        res.status(200).json({
            message: "Inner Subcategory deleted successfully.",
            data: innerSubcategory,
        });
    } catch (error) {
        console.error("Error deleting inner subcategory:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};