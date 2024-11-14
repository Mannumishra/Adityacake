const { createSubcategory, getAllSubcategories, getSubcategoryById, updateSubcategory, deleteSubcategory } = require("../Controller/SubcategoryController")

const SubcCategoryRouter = require("express").Router()

SubcCategoryRouter.post("/create-subcategory", createSubcategory)
SubcCategoryRouter.get("/get-subcategory", getAllSubcategories)
SubcCategoryRouter.get("/get-single-subcategory/:id", getSubcategoryById)
SubcCategoryRouter.put("/update-subcategory/:id", updateSubcategory)
SubcCategoryRouter.delete("/delete-subcategory/:id", deleteSubcategory)


module.exports = SubcCategoryRouter