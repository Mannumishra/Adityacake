const mongoose = require("mongoose")

const ShopCategorySchema = new mongoose.Schema({
    shopName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    shopCategoryName: {
        type: String,
        required: true
    }
})


const ShopCategory = mongoose.model("ShopCategory" ,ShopCategorySchema)

module.exports = ShopCategory