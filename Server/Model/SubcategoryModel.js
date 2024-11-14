const mongoose = require("mongoose")

const SubCategorySchema = new mongoose.Schema({
    categoryName:{
        type:mongoose.Schema.ObjectId,
        ref:"Main-Category",
        required:true
    },
    subcategoryName:{
        type:String,
        required:true
    },
    subcategoryStatus:{
        type:String,
        default:"False"
    }
},{timestamps:true})

const Subcategory = mongoose.model("Subcategory" ,SubCategorySchema)

module.exports = Subcategory