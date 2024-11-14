import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
    const [isLoading, setIsloding] = useState(false)
    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Product</h4>
                </div>
                <div className="links">
                    <Link to="/all-products" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" >
                    <div class="col-md-4">
                        <label htmlFor="categoryName" class="form-label">State</label>
                        <select name='categoryName' className="form-select" id="categoryName">
                            <option selected>Category</option>
                            <option value="1"> 1</option>
                            <option value="1"> 1</option>
                            <option value="1"> 1</option>
                            <option value="1"> 1</option>
                            <option value="1"> 1</option>
                        </select>
                    </div>


                    <div className="col-md-6">
                        <label htmlFor="productName" className="form-label">Product Name</label>
                        <input type="text" name='productName' className="form-control" id="productName" />
                    </div>

                    <div className="col-12">
                        <label htmlFor="productDescription" className="form-label">Product Description</label>
                        <textarea name='productDescription' className="form-control" id="productDescription" />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Product Points</label>
                            <div className="d-flex mb-2">
                                <input type="text" className="form-control me-2"/>
                                <button type="button"  className="btn btn-danger">Remove</button>
                            </div>
                        <button type="button"  className="btn btn-primary">Add Point</button>
                    </div>

                    <div className="mb-4">
                        <div className="d-flex gap-2 align-items-start">
                            <img src='' className="img-thumbnail mb-2" style={{ width: '100px', height: '100px' }} />
                        </div>
                    </div>
                    <div className="mb-4">
                        <input
                            type="file"
                            name="images"
                            multiple
                            className="form-control-file border p-2 mt-1 rounded shadow-sm"
                        />
                    </div>


                    <div className="col-md-4">
                        <label htmlFor="price" className="form-label">Price</label>
                        <input type="number" name='price' className="form-control" id="price" />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="discountPrice" className="form-label">Discount Price</label>
                        <input type="number" name='discountPrice' className="form-control" id="discountPrice" />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="discountPercentage" className="form-label">Discount Percentage</label>
                        <input type="number" min="1" max="80" name='discountPercentage' className="form-control" id="discountPercentage" />
                    </div>


                    {/* <div className="col-md-4">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text"  name='tag' value={formData.tag} className="form-control" id="tag" />
                    </div> */}
                    <div class="col-md-4">
                        <label htmlFor="tag" class="form-label">Tag</label>
                        <select name='tag' className="form-select" id="tag">
                            <option value="1">1</option>
                            <option value="1">1</option>
                            <option value="1">1</option>
                            <option value="1">1</option>
                            <option value="1">1</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="sku" className="form-label">SKU</label>
                        <input type="text" name='sku' className="form-control" id="sku" />
                    </div>

                    {/* <div className="col-md-4">
                        <label htmlFor="inStock" className="form-label">In Stock</label>
                        <input type="checkbox"  name='inStock' checked={formData.inStock} className="form-check-input" id="inStock" />
                    </div> */}

                    <div className="col-md-4">
                        <label htmlFor="stockQuantity" className="form-label">Stock Quantity</label>
                        <input type="number" name='stockQuantity' className="form-control" id="stockQuantity" />
                    </div>

                    <div className="col-12 text-center">
                        <button type="submit" className={`${isLoading ? 'not-allowed' : 'allowed'}`}>{isLoading ? "Please Wait..." : "Add Product"}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddProduct;
