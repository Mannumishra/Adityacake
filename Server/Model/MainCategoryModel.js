const mongoose = require("mongoose")

const MainCategorySchema = new mongoose.Schema({
    mainCategoryName: {
        type: String,
        required: true
    },
    mainCategoryImage: {
        type: String,
        required: true
    },
    mainCategoryStatus: {
        type: String,
        default: "False"
    }
}, { timestamps: true })

const MainCategory = mongoose.model("Main-Category", MainCategorySchema)

module.exports = MainCategory