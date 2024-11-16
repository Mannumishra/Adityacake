import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        categoryName: '',
        subcategoryName: '',
        productName: '',
        productDescription: '',
        productSubDescription: '',
        refrenceCompany: '',
        productTag: "",
        Variant: [{
            color: '',
            weight: '',
            flover: '',
            price: '',
            discountPrice: '',
            finalPrice: '',
            stock: '',
            eggLess: false
        }],
        productImage: [],
    });

    // State to store categories, subcategories, and other dynamic data
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [flowers, setFlowers] = useState([]);
    const [weights, setWeights] = useState([]);
    const [refCompany, setRefCompany] = useState([]);
    const [tag, setTag] = useState([]);


    // Fetch dynamic data (categories, subcategories, colors, etc.) on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryResponse = await axios.get('http://localhost:8000/api/get-main-category');
                const subcategoryResponse = await axios.get('http://localhost:8000/api/get-subcategory');
                const colorResponse = await axios.get('http://localhost:8000/api/get-color');
                const flowerResponse = await axios.get('http://localhost:8000/api/get-flover');
                const weightResponse = await axios.get('http://localhost:8000/api/get-size');
                const refcompanyResponse = await axios.get('http://localhost:8000/api/all-ref-companies');
                const tagResponse = await axios.get('http://localhost:8000/api/get-tags');

                setCategories(categoryResponse.data.data);
                setSubcategories(subcategoryResponse.data.data);
                setColors(colorResponse.data.data);
                setFlowers(flowerResponse.data.data);
                setWeights(weightResponse.data.data);
                setRefCompany(refcompanyResponse.data.data);
                setTag(tagResponse.data.data);
            } catch (error) {
                console.error('Error fetching data', error);
                toast.error('Error loading data!');
            }
        };

        fetchData();
    }, []);


    // Handle input change for form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle file change for images
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            productImage: e.target.files,
        });
    };

    const handleVariantChange = (index, e) => {
        const { name, value } = e.target; // Get the field name and value
        const updatedVariants = [...formData.Variant]; // Clone the variants array
        updatedVariants[index][name] = value; // Update the specific field of the variant
        setFormData({
            ...formData,
            Variant: updatedVariants, // Update the state
        });
    };


    // Add new variant
    const handleAddVariant = () => {
        setFormData({
            ...formData,
            Variant: [
                ...formData.Variant,
                {
                    color: '',
                    weight: '',
                    flover: '',
                    price: '',
                    discountPrice: '',
                    finalPrice: '',
                    stock: '',
                    eggLess: false
                }
            ],
        });
    };

    // Remove variant
    const handleRemoveVariant = (index) => {
        const updatedVariants = formData.Variant.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            Variant: updatedVariants,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate that all required fields in variants are filled
        for (const variant of formData.Variant) {
            if (!variant.color || !variant.weight || !variant.flover) {
                toast.error('Please fill out all fields in variants.');
                setIsLoading(false);
                return;
            }
        }

        const form = new FormData();
        form.append('categoryName', formData.categoryName);
        form.append('subcategoryName', formData.subcategoryName);
        form.append('productName', formData.productName);
        form.append('productDescription', formData.productDescription);
        form.append('productSubDescription', formData.productSubDescription);
        form.append('refrenceCompany', formData.refrenceCompany);
        form.append('productTag', formData.productTag);

        // Append variants
        form.append('Variant', JSON.stringify(formData.Variant));

        // Append images to FormData
        for (let i = 0; i < formData.productImage.length; i++) {
            form.append('productImage', formData.productImage[i]);
        }

        try {
            await axios.post('http://localhost:8000/api/create-product', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Product added successfully!');
        } catch (err) {
            toast.error('Error adding product!');
        } finally {
            setIsLoading(false);
        }
    };

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
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label htmlFor="categoryName" className="form-label">Category Name</label>
                        <select name='categoryName' className="form-select" id="categoryName" value={formData.categoryName} onChange={handleChange}>
                            <option value="" selected disabled>Select Category</option>
                            {
                                categories.map((item, index) =>
                                    <option value={item._id}>{item.mainCategoryName}</option>
                                )
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="subcategoryName" className="form-label">Subcategory Name</label>
                        <select name='subcategoryName' className="form-select" id="subcategoryName" value={formData.subcategoryName} onChange={handleChange}>
                            <option value="" selected disabled>Select Subcategory</option>
                            {
                                subcategories.map((item, index) =>
                                    <option value={item._id}>{item.subcategoryName}</option>
                                )
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="productName" className="form-label">Product Name</label>
                        <input type="text" name='productName' className="form-control" id="productName" value={formData.productName} onChange={handleChange} />
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="productDescription" className="form-label">Product Description</label>
                        <textarea name='productDescription' className="form-control" id="productDescription" value={formData.productDescription} onChange={handleChange} />
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="productSubDescription" className="form-label">Product Sub Description</label>
                        <textarea name='productSubDescription' className="form-control" id="productSubDescription" value={formData.productSubDescription} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="productTag" className="form-label">Product Tag</label>
                        <select name='productTag' className="form-select" id="productTag" value={formData.productTag} onChange={handleChange}>
                            <option value="" selected disabled>Select Category</option>
                            {
                                tag.map((item, index) =>
                                    <option value={item._id}>{item.tagName}</option>
                                )
                            }
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="refrenceCompany" className="form-label">Refrence Company</label>
                        <select name='refrenceCompany' className="form-select" id="refrenceCompany" value={formData.refrenceCompany} onChange={handleChange}>
                            <option value="" selected disabled>Select Category</option>
                            {
                                refCompany.map((item, index) =>
                                    <option value={item._id}>{item.refCompanyName}</option>
                                )
                            }
                        </select>
                    </div>

                    {/* Variant Fields */}
                    <div className="col-md-12">
                        <label className="form-label">Product Variants</label>
                        {formData.Variant.map((variant, index) => (
                            <div key={index} className="variant-container">
                                <div className="row">
                                    <div className="col-md-3">
                                        <label htmlFor={`color-${index}`} className="form-label">Color</label>
                                        <select
                                            name="color"
                                            className="form-select"
                                            id={`color-${index}`}
                                            value={variant.color} // Link to the specific variant's color
                                            onChange={(e) => handleVariantChange(index, e)}
                                        >
                                            <option value="" disabled>Select Color</option>
                                            {colors.map((item) => (
                                                <option key={item._id} value={item._id}>
                                                    {item.colorName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-3">
                                        <label htmlFor={`weight-${index}`} className="form-label">Weight</label>
                                        <select
                                            name="weight"
                                            className="form-select"
                                            id={`weight-${index}`}
                                            value={variant.weight} // Link to the specific variant's weight
                                            onChange={(e) => handleVariantChange(index, e)}
                                        >
                                            <option value="" disabled>Select Weight</option>
                                            {weights.map((item) => (
                                                <option key={item._id} value={item._id}>
                                                    {item.sizeweight}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-3">
                                        <label htmlFor={`flover-${index}`} className="form-label">Flover</label>
                                        <select
                                            name="flover"
                                            className="form-select"
                                            id={`flover-${index}`}
                                            value={variant.flover} // Link to the specific variant's flover
                                            onChange={(e) => handleVariantChange(index, e)}
                                        >
                                            <option value="" disabled>Select Flover</option>
                                            {flowers.map((item) => (
                                                <option key={item._id} value={item._id}>
                                                    {item.floverName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-3">
                                        <label htmlFor={`price-${index}`} className="form-label">Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            className="form-control"
                                            value={variant.price}
                                            onChange={(e) => handleVariantChange(index, e)}
                                        />
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-md-3">
                                        <label htmlFor={`discountPrice-${index}`} className="form-label">Discount Price</label>
                                        <input
                                            type="number"
                                            name="discountPrice"
                                            className="form-control"
                                            value={variant.discountPrice}
                                            onChange={(e) => handleVariantChange(index, e)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor={`finalPrice-${index}`} className="form-label">Final Price</label>
                                        <input
                                            type="number"
                                            name="finalPrice"
                                            className="form-control"
                                            value={variant.finalPrice}
                                            onChange={(e) => handleVariantChange(index, e)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor={`stock-${index}`} className="form-label">Stock</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            className="form-control"
                                            value={variant.stock}
                                            onChange={(e) => handleVariantChange(index, e)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Eggless</label>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                name={`eggLess-${index}`}
                                                id={`eggLess-yes-${index}`}
                                                className="form-check-input"
                                                value="true"
                                                checked={variant.eggLess === true}
                                                onChange={(e) => handleVariantChange(index, { target: { name: 'eggLess', value: true } })}
                                            />
                                            <label htmlFor={`eggLess-yes-${index}`} className="form-check-label">Eggless</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                name={`eggLess-${index}`}
                                                id={`eggLess-no-${index}`}
                                                className="form-check-input"
                                                value="false"
                                                checked={variant.eggLess === false}
                                                onChange={(e) => handleVariantChange(index, { target: { name: 'eggLess', value: false } })}
                                            />
                                            <label htmlFor={`eggLess-no-${index}`} className="form-check-label">Egg</label>
                                        </div>
                                    </div>

                                </div>

                                <button type="button" className="btn btn-danger mt-2" onClick={() => handleRemoveVariant(index)}>Remove Variant</button>
                            </div>
                        ))}
                        <button type="button" className="btn btn-primary mt-2" onClick={handleAddVariant}>Add Variant</button>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="productImage" className="form-label">Product Images</label>
                        <input type="file" className="form-control" id="productImage" name="productImage" multiple onChange={handleFileChange} />
                    </div>

                    <div className="col-md-12 text-center">
                        <button type="submit" className="btn btn-success" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddProduct;
