const express = require('express');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../Controller/ProductController');
const upload = require('../MiddleWare/Multer');
const ProductRouter = express.Router();

ProductRouter.post('/create-product', upload.array("productImage", 5), createProduct);
ProductRouter.get('/all-product', getProducts);
ProductRouter.get('/get-single-product/:id', getProduct);
ProductRouter.put('/update-product/:id', upload.array("productImage", 5), updateProduct);
ProductRouter.delete('/delete-product/:id', deleteProduct);

module.exports = ProductRouter;