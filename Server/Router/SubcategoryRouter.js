const { createSubcategory, getAllSubcategories, getSubcategoryById, updateSubcategory, deleteSubcategory } = require("../Controller/SubcategoryController");
const upload = require("../MiddleWare/Multer");

const SubcCategoryRouter = require("express").Router()

SubcCategoryRouter.post("/create-subcategory", upload.single('subcategoryImage'), createSubcategory);
SubcCategoryRouter.get("/get-subcategory", getAllSubcategories);
SubcCategoryRouter.get("/get-single-subcategory/:id", getSubcategoryById);
SubcCategoryRouter.put("/update-subcategory/:id", upload.single('subcategoryImage'), updateSubcategory);
SubcCategoryRouter.delete("/delete-subcategory/:id", deleteSubcategory);


module.exports = SubcCategoryRouter