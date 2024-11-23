const fs = require('fs');
const path = require('path');
const Product = require('../Model/ProductModel');
const { error } = require('console');

// deleteImageFile function to delete images
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

const createProduct = async (req, res) => {
    console.log(req.body);
    const { categoryName, subcategoryName, productName, productSubDescription, productDescription, productTag, refrenceCompany, Variant, refrenceCompanyUrl, innersubcategoryName } = req.body;
    const errorMessage = [];

    // Validation for required fields
    if (!categoryName) errorMessage.push("Category Name is required");
    if (!subcategoryName) errorMessage.push("Subcategory Name is required");
    if (!productName) errorMessage.push("Product Name is required");
    if (!productSubDescription) errorMessage.push("Product Sub Description is required");
    if (!productDescription) errorMessage.push("Product Description is required");
    if (!productTag) errorMessage.push("Product Tag is required");
    if (!refrenceCompany) errorMessage.push("Reference Company is required");
    if (!Variant) errorMessage.push("Variant is required");

    // If there are any missing fields, return an error
    if (errorMessage.length > 0) {
        if (req.files) {
            req.files.forEach((file) => deleteImageFile(file.path));
        }
        return res.status(400).json({ errors: errorMessage });
    }

    // Check if product name already exists
    const existingProduct = await Product.findOne({
        productName: { $regex: `^${productName.trim()}$`, $options: 'i' } // Case-insensitive check
    });

    if (existingProduct) {
        if (req.files) {
            req.files.forEach((file) => deleteImageFile(file.path)); // Cleanup uploaded files if product name is not unique
        }
        return res.status(400).json({ message: 'Product with this name already exists' });
    }

    // If no images are uploaded
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Product Images are required"
        });
    }

    // Generate a unique SKU code for the product
    const generateSKU = async () => {
        // Find the last product created and get its SKU
        const lastProduct = await Product.findOne().sort({ createdAt: -1 }).select('sku');
        if (lastProduct) {
            const lastSku = lastProduct.sku; // Get the last SKU
            const lastSkuNumber = parseInt(lastSku.split('SKU')[1]); // Extract the number part of the SKU
            return `SKU${(lastSkuNumber + 1).toString().padStart(3, '0')}`; // Increment and pad with leading zeros
        }
        return 'SKU001'; // Default SKU if no products exist
    };

    // Proceed with creating the product
    const productData = {
        categoryName,
        subcategoryName,
        productName,
        productSubDescription,
        productDescription,
        productTag,
        refrenceCompany,
        innersubcategoryName,
        refrenceCompanyUrl,
        Variant: JSON.parse(Variant), // Assuming it's a stringified JSON
        productImage: req.files.map(file => file.path), // Save paths to the uploaded images
        sku: await generateSKU(), // Generate unique SKU
    };

    try {
        const product = new Product(productData);
        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// Read Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('categoryName')
            .populate('subcategoryName')
            .populate('productTag')
            .populate('refrenceCompany')
            .populate('innersubcategoryName')
            .populate({
                path: 'Variant.color',
                model: 'Color',
            })
            .populate({
                path: 'Variant.weight',
                model: 'Size',
            })
            .populate({
                path: 'Variant.flover',
                model: 'Flover',
            });

        res.status(200).json({ data: products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get Single Product
const getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id).populate('categoryName subcategoryName innersubcategoryName productTag refrenceCompany');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ data: product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get Single Product
const getProductByname = async (req, res) => {
    const { name } = req.params;
    try {
        const product = await Product.findOne({productName:name}).populate('categoryName subcategoryName innersubcategoryName productTag refrenceCompany');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ data: product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Update Product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);

    // Collect updated data from the request body
    const updatedData = {
        categoryName: req.body.categoryName,
        subcategoryName: req.body.subcategoryName,
        productName: req.body.productName,
        productSubDescription: req.body.productSubDescription,
        productDescription: req.body.productDescription,
        productTag: req.body.productTag,
        refrenceCompany: req.body.refrenceCompany,
        refrenceCompanyUrl: req.body.refrenceCompanyUrl,
        innersubcategoryName: req.body.innersubcategoryName,
        Variant: JSON.parse(req.body.Variant), // Assuming it's a stringified JSON
    };

    // If new images are uploaded, add them to the updated data
    if (req.files && req.files.length > 0) {
        updatedData.productImage = req.files.map(file => file.path);
    }

    try {
        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product name is unique (to avoid updating to an existing product name)
        if (req.body.productName && req.body.productName !== product.productName) {
            const existingProduct = await Product.findOne({
                productName: { $regex: `^${req.body.productName.trim()}$`, $options: 'i' }, // Case-insensitive check
            });

            if (existingProduct) {
                // If a product with the same name exists, return an error
                return res.status(400).json({ message: 'Product with this name already exists' });
            }
        }

        // If new images are provided, delete the old ones
        if (req.files && req.files.length > 0) {
            product.productImage.forEach((imagePath) => {
                deleteImageFile(imagePath); // Delete old images from file storage
            });
        }

        // Update the product in the database
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

        // Return the updated product data in the response
        res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


// Delete Product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete images using the deleteImageFile function
        product.productImage.forEach((imagePath) => {
            deleteImageFile(imagePath); // Use deleteImageFile here
        });

        // Delete the product from the database
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductByname
};
