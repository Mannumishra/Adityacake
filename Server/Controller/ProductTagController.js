const ProductTag = require("../Model/ProducttagModel");
const fs = require("fs");
const path = require("path");
const mongoose = require('mongoose');

// Helper function to delete an image file
const deleteImageFile = (relativeFilePath) => {
    const absolutePath = path.join(__dirname, "..", relativeFilePath);
    fs.unlink(absolutePath, (err) => {
        if (err) {
            console.error(`Failed to delete image: ${absolutePath}`, err);
        } else {
            console.log(`Image deleted: ${absolutePath}`);
        }
    });
};


// Create a new Product Tag
exports.createProductTag = async (req, res) => {
    try {
        console.log(req.files)
        console.log(req.body)
        const { tagHeading, sortDescription, multipulProduct, priceRange } = req.body;
        const image = req.files ? req.files.image[0].path : null;

        const parsedPriceRange = priceRange ? JSON.parse(priceRange) : [];

        // Add image paths for priceRange items if they are uploaded
        if (req.files && req.files.priceRangeImages) {
            req.files.priceRangeImages.forEach((file, index) => {
                if (parsedPriceRange[index]) {
                    parsedPriceRange[index].priceRangeImage = file.path;
                }
            });
        }

        const newProductTag = new ProductTag({
            tagHeading,
            sortDescription,
            image,
            multipulProduct,
            priceRange: parsedPriceRange,
        });

        const savedProductTag = await newProductTag.save();

        res.status(201).json({
            success: true,
            message: "Product tag created successfully",
            data: savedProductTag,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Failed to create product tag",
            error: error.message,
        });
    }
};

exports.updateProductTag = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.files);

        const { id } = req.params;
        const updates = req.body;
        const newImage = req.file ? req.file.filename : null;

        const productTag = await ProductTag.findById(id);
        if (!productTag) {
            if (newImage) deleteImageFile(newImage);
            return res.status(404).json({
                success: false,
                message: "Product tag not found",
            });
        }

        // Delete the old tag image if a new one is uploaded
        if (newImage && productTag.image) {
            deleteImageFile(productTag.image);
        }

        // Parse and validate multipulProduct field
        const parsedMultipulProduct = updates.multipulProduct
            ? JSON.parse(updates.multipulProduct).map(productId => {
                if (!mongoose.Types.ObjectId.isValid(productId)) {
                    throw new Error(`Invalid product ID: ${productId}`);
                }
                return mongoose.Types.ObjectId(productId);
            })
            : [];

        // Process priceRange updates
        const parsedPriceRange = updates.priceRange ? JSON.parse(updates.priceRange) : [];

        if (req.files && req.files.priceRangeImages) {
            req.files.priceRangeImages.forEach((file, index) => {
                if (parsedPriceRange[index]) {
                    // Delete old priceRange image if a new one is uploaded
                    const oldImage = productTag.priceRange[index]?.priceRangeImage;
                    if (oldImage) deleteImageFile(oldImage);

                    parsedPriceRange[index].priceRangeImage = file.filename;
                }
            });
        }

        const updatedProductTag = await ProductTag.findByIdAndUpdate(
            id,
            {
                ...updates,
                multipulProduct: parsedMultipulProduct,
                image: newImage || productTag.image,
                priceRange: parsedPriceRange,
            },
            { new: true, runValidators: true }
        ).populate("multipulProduct");

        res.status(200).json({
            success: true,
            message: "Product tag updated successfully",
            data: updatedProductTag,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update product tag",
            error: error.message,
        });
    }
};

// Get all Product Tags
exports.getAllProductTags = async (req, res) => {
    try {
        const productTags = await ProductTag.find().populate("multipulProduct");

        res.status(200).json({
            success: true,
            data: productTags
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product tags",
            error: error.message
        });
    }
};

// Get a single Product Tag by ID
exports.getProductTagById = async (req, res) => {
    try {
        const { id } = req.params;

        const productTag = await ProductTag.findById(id).populate("multipulProduct");

        if (!productTag) {
            return res.status(404).json({
                success: false,
                message: "Product tag not found"
            });
        }

        res.status(200).json({
            success: true,
            data: productTag
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product tag",
            error: error.message
        });
    }
};

// Delete a Product Tag by ID
exports.deleteProductTag = async (req, res) => {
    try {
        const { id } = req.params;

        const productTag = await ProductTag.findByIdAndDelete(id);

        if (!productTag) {
            return res.status(404).json({
                success: false,
                message: "Product tag not found",
            });
        }

        // Delete the main image
        if (productTag.image) {
            deleteImageFile(productTag.image);
        }

        // Delete all priceRange images
        const priceRangeImages = productTag.priceRange.map(
            (range) => range.priceRangeImage)
        deleteImageFile(priceRangeImages);

        res.status(200).json({
            success: true,
            message: "Product tag deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete product tag",
            error: error.message,
        });
    }
};
