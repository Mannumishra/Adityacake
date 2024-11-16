const express = require("express")
const { connectDb } = require("./DB/ConntectDb")
const cors = require("cors")
const BannerRouter = require("./Router/BannerRouter")
const MainCategoryRouter = require("./Router/MainCategoryRouter")
const SubcCategoryRouter = require("./Router/SubcategoryRouter")
const ColorRouter = require("./Router/ColorRouter")
const SizeRouter = require("./Router/SizeRouter")
const FloverRouter = require("./Router/FloverRouter")
const RefrenceRouter = require("./Router/RefrenceRouter")
const TagRouter = require("./Router/tagRoutes")
const CategoryTitelRouter = require("./Router/categoryTitelRoutes")
const ProductRouter = require("./Router/productRoutes")
const InnerSubcategoryRouter = require("./Router/InnerSubcategoryRouter")

const app = express()

app.use(cors())
app.use(express.json())
app.set(express.static("./Public"))
app.use("/Public", express.static("Public"))

app.get("/", (req, res) => {
    res.send("Server Is Running")
})

app.use("/api", BannerRouter)
app.use("/api", MainCategoryRouter)
app.use("/api", SubcCategoryRouter)
app.use("/api", ColorRouter)
app.use("/api", SizeRouter)
app.use("/api", FloverRouter)
app.use("/api", RefrenceRouter)
app.use("/api", TagRouter)
app.use("/api", CategoryTitelRouter)
app.use("/api", ProductRouter)
app.use("/api", InnerSubcategoryRouter)

app.listen(8000, () => {
    console.log("Server Start")
})


connectDb()