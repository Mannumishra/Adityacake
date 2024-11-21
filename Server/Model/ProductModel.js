const mongoose = require("mongoose")

const VariantSchema = new mongoose.Schema({
    color: {
        type: mongoose.Schema.ObjectId,
        ref: "Color",
        required: true,
    },
    weight: {
        type: mongoose.Schema.ObjectId,
        ref: "Size",
        required: true,
    },
    flover: {
        type: mongoose.Schema.ObjectId,
        ref: "Flover",
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    finalPrice: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        default: 0
    },
    eggLess: {
        type: String,
        required: true
    }
});

const productSchema = new mongoose.Schema({
    categoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "Main-Category",
        required: true
    },
    subcategoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "Subcategory",
        required: true
    },
    innersubcategoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "InnerSubcategory",
    },
    productName: {
        type: String,
        required: true,
    },
    productSubDescription: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
        required: true,
    },
    productTag: {
        type: mongoose.Schema.ObjectId,
        ref: "TagModel"
    },
    refrenceCompany: {
        type: mongoose.Schema.ObjectId,
        ref: "RefrenceCompany"
    },
    refrenceCompanyUrl: {
        type: String,
    },
    Variant: {
        type: [VariantSchema],
        required: true,
    },
    productImage: {
        type: [String],
        required: true
    },
    sku:{
        type:String,
        default:"SKU001"
    }
})


const Product = mongoose.model("Product", productSchema)

module.exports = Product