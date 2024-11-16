const { createInnerSubcategory, getAllInnerSubcategories, getInnerSubcategoryById, updateInnerSubcategory, deleteInnerSubcategory } = require("../Controller/InnerSubcategoryController")
const upload = require("../MiddleWare/Multer")

const InnerSubcategoryRouter = require("express").Router()

InnerSubcategoryRouter.post("/create-inner-subcategory", upload.single("Image"), createInnerSubcategory)
InnerSubcategoryRouter.get("/get-inner-subcategory", getAllInnerSubcategories)
InnerSubcategoryRouter.get("/single-inner-subcategory/:id", getInnerSubcategoryById)
InnerSubcategoryRouter.put("/update-inner-subcategory/:id", upload.single("Image"), updateInnerSubcategory)
InnerSubcategoryRouter.delete("/delete-inner-subcategory/:id", deleteInnerSubcategory)

module.exports = InnerSubcategoryRouter