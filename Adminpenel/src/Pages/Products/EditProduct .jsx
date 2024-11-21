import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProduct = () => {
    const { id } = useParams(); // Get product ID from URL
    const navigate = useNavigate()
    console.log(id);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        categoryName: "",
        subcategoryName: "",
        innersubcategoryName: '',
        productName: "",
        productDescription: "",
        productSubDescription: "",
        refrenceCompany: "",
        productTag: "",
        refrenceCompanyUrl: "",
        Variant: [
            {
                color: "",
                weight: "",
                flover: "",
                price: "",
                discountPrice: "",
                finalPrice: "",
                stock: "",
                eggLess: false,
            },
        ],
        productImage: [],
    });

    // State to store dynamic data
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [innersubcategories, setInnersubcategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [flowers, setFlowers] = useState([]);
    const [weights, setWeights] = useState([]);
    const [refCompany, setRefCompany] = useState([]);
    const [tag, setTag] = useState([]);


    // State to store filtered subcategories
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [filteredInnersubcategories, setFilteredInnersubcategories] = useState([]);


    // Fetch product details and dynamic data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch dynamic data
                const categoryResponse = await axios.get(
                    "http://localhost:8000/api/get-main-category"
                );
                const subcategoryResponse = await axios.get(
                    "http://localhost:8000/api/get-subcategory"
                );
                const colorResponse = await axios.get("http://localhost:8000/api/get-color");
                const flowerResponse = await axios.get(
                    "http://localhost:8000/api/get-flover"
                );
                const weightResponse = await axios.get(
                    "http://localhost:8000/api/get-size"
                );
                const refCompanyResponse = await axios.get(
                    "http://localhost:8000/api/all-ref-companies"
                );
                const tagResponse = await axios.get("http://localhost:8000/api/get-tags");

                const innersubcategoryResponse = await axios.get('http://localhost:8000/api/get-inner-subcategory');

                setCategories(categoryResponse.data.data);
                setSubcategories(subcategoryResponse.data.data);
                setInnersubcategories(innersubcategoryResponse.data.data);
                setColors(colorResponse.data.data);
                setFlowers(flowerResponse.data.data);
                setWeights(weightResponse.data.data);
                setRefCompany(refCompanyResponse.data.data);
                setTag(tagResponse.data.data);

                // Fetch product details
                const productResponse = await axios.get(
                    `http://localhost:8000/api/get-single-product/${id}`
                );
                const productData = productResponse.data.data;
                setFormData({
                    ...productData,
                    categoryName: productData.categoryName ? productData.categoryName._id : "",
                    subcategoryName: productData.subcategoryName ? productData.subcategoryName._id : "",
                    refrenceCompany: productData.refrenceCompany ? productData.refrenceCompany._id : "",
                    productTag: productData.productTag ? productData.productTag._id : "",
                    Variant: productData.Variant || [],
                    productImage: [], // Reset images for new uploads
                });
            } catch (error) {
                console.error("Error fetching data", error);
                toast.error("Error loading data!");
            }
        };

        fetchData();
    }, [id]);

    // Handle input change
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value,
    //     });

    //     // If categoryName changes, filter subcategories
    //     if (name === 'categoryName') {
    //         const filteredSubcategories = subcategories.filter(
    //             (subcategory) => subcategory.categoryName._id === value
    //         );
    //         setFilteredSubcategories(filteredSubcategories);
    //     }
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Updating form data based on the changed field
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
            ...(name === "categoryName" && {
                subcategoryName: '',
                innersubcategoryName: ''
            }),
            ...(name === "subcategoryName" && {
                innersubcategoryName: ''
            }),
        }));

        // Filter subcategories when categoryName changes
        if (name === "categoryName") {
            const filteredSubcategories = subcategories.filter(
                (subcategory) => subcategory.categoryName._id === value
            );
            setFilteredSubcategories(filteredSubcategories);
        }

        // Filter innersubcategories when subcategoryName changes
        if (name === "subcategoryName") {
            const filteredInnersubcategories = innersubcategories.filter(
                (innersubcategory) => innersubcategory.subcategoryName._id === value
            );
            setFilteredInnersubcategories(filteredInnersubcategories);
        }
    };




    // Handle file change for images
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            productImage: e.target.files,
        });
    };

    // Handle variant change
    const handleVariantChange = (index, e) => {
        const { name, value } = e.target; // Get the field name and value
        const updatedVariants = [...formData.Variant]; // Clone the variants array

        // Update the specific field of the variant
        updatedVariants[index][name] = value;

        // Automatically calculate finalPrice when price or discountPrice changes
        if (name === 'price' || name === 'discountPrice') {
            const price = parseFloat(updatedVariants[index].price) || 0;
            const discount = parseFloat(updatedVariants[index].discountPrice) || 0;

            updatedVariants[index].finalPrice = price - (price * (discount / 100));
        }

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
                    color: "",
                    weight: "",
                    flover: "",
                    price: "",
                    discountPrice: "",
                    finalPrice: "",
                    stock: "",
                    eggLess: false,
                },
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
                toast.error("Please fill out all fields in variants.");
                setIsLoading(false);
                return;
            }
        }

        const form = new FormData();
        form.append("categoryName", formData.categoryName);
        form.append("subcategoryName", formData.subcategoryName);
        form.append('innersubcategoryName', formData.innersubcategoryName);
        form.append("productName", formData.productName);
        form.append("productDescription", formData.productDescription);
        form.append("productSubDescription", formData.productSubDescription);
        form.append("refrenceCompany", formData.refrenceCompany);
        form.append("productTag", formData.productTag);
        form.append("refrenceCompanyUrl", formData.refrenceCompanyUrl)

        // Append variants
        form.append("Variant", JSON.stringify(formData.Variant));

        // Append new images
        for (let i = 0; i < formData.productImage.length; i++) {
            form.append("productImage", formData.productImage[i]);
        }

        try {
            await axios.put(`http://localhost:8000/api/update-product/${id}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Product updated successfully!");
            navigate("/all-products")
        } catch (err) {
            console.log(err)
            toast.error(err.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };
    console.log(formData)
    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Product</h4>
                </div>
                <div className="links">
                    <Link to="/all-products" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-3">
                        <label htmlFor="categoryName" className="form-label">Category Name<sup className="text-danger">*</sup></label>
                        <select name="categoryName" className="form-select" id="categoryName" value={formData.categoryName} onChange={handleChange}>
                            <option value="" disabled>Select Category</option>
                            {categories.map((item, index) => (
                                <option key={index} value={item._id}>
                                    {item.mainCategoryName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label htmlFor="subcategoryName" className="form-label">Subcategory Name<sup className="text-danger">*</sup></label>
                        <select
                            name="subcategoryName"
                            className="form-select"
                            id="subcategoryName"
                            value={formData.subcategoryName}
                            onChange={handleChange}
                        // required
                        >
                            <option value="" selected disabled>Select Subcategory</option>
                            {filteredSubcategories.map((item, index) => (
                                <option key={index} value={item._id}>{item.subcategoryName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label htmlFor="innersubcategoryName" className="form-label">Inner Subcategory Name<sup className='text-danger'>*</sup></label>
                        <select
                            name="innersubcategoryName"
                            className="form-select"
                            id="innersubcategoryName"
                            value={formData.innersubcategoryName}
                            onChange={handleChange}
                            disabled={!formData.subcategoryName}  // Disable until subcategory is selected
                        // required
                        >
                            <option value="" selected disabled>Select Inner Subcategory</option>
                            {filteredInnersubcategories.map((item, index) => (
                                <option key={index} value={item._id}>{item.innerSubcategoryName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label htmlFor="productName" className="form-label">Product Name<sup className="text-danger">*</sup></label>
                        <input type="text" name='productName' className="form-control" id="productName" value={formData.productName} onChange={handleChange} />
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="productDescription" className="form-label">Product Description<sup className="text-danger">*</sup></label>
                        <textarea name='productDescription' className="form-control" id="productDescription" value={formData.productDescription} onChange={handleChange} />
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="productSubDescription" className="form-label">Product Sub Description<sup className="text-danger">*</sup></label>
                        <textarea name='productSubDescription' className="form-control" id="productSubDescription" value={formData.productSubDescription} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="productTag" className="form-label">Product Tag<sup className="text-danger">*</sup></label>
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
                        <label htmlFor="refrenceCompany" className="form-label">Refrence Company<sup className="text-danger">*</sup></label>
                        <select name='refrenceCompany' className="form-select" id="refrenceCompany" value={formData.refrenceCompany} onChange={handleChange}>
                            <option value="" selected disabled>Select Category</option>
                            {
                                refCompany.map((item, index) =>
                                    <option value={item._id}>{item.refCompanyName}</option>
                                )
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="refrenceCompanyUrl" className="form-label">Company Refrence Url<sup className="text-danger">*</sup></label>
                        <input type="text" name="refrenceCompanyUrl" id="refrenceCompanyUrl" className='form-control' value={formData.refrenceCompanyUrl} onChange={handleChange} />
                    </div>


                    {/* Variant Fields */}
                    <div className="col-md-12">
                        <label className="form-label">Product Variants<sup className="text-danger">*</sup></label>
                        {formData.Variant.map((variant, index) => (
                            <div key={index} className="variant-container">
                                <div className="row">
                                    <div className="col-md-3">
                                        <label htmlFor={`color-${index}`} className="form-label">Color<sup className="text-danger">*</sup></label>
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
                                        <label htmlFor={`weight-${index}`} className="form-label">Weight<sup className="text-danger">*</sup></label>
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
                                        <label htmlFor={`flover-${index}`} className="form-label">Flover<sup className="text-danger">*</sup></label>
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
                                        <label htmlFor={`price-${index}`} className="form-label">Price<sup className="text-danger">*</sup></label>
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
                                        <label htmlFor={`discountPrice-${index}`} className="form-label">Discount Price<sup className="text-danger">*</sup></label>
                                        <input
                                            type="number"
                                            name="discountPrice"
                                            className="form-control"
                                            value={variant.discountPrice}
                                            onChange={(e) => handleVariantChange(index, e)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor={`finalPrice-${index}`} className="form-label">Final Price<sup className='text-danger'>*</sup></label>
                                        <input
                                            type="number"
                                            name="finalPrice"
                                            className="form-control"
                                            value={variant.finalPrice}
                                            readOnly // Make the field read-only
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor={`stock-${index}`} className="form-label">Stock<sup className="text-danger">*</sup></label>
                                        <input
                                            type="number"
                                            name="stock"
                                            className="form-control"
                                            value={variant.stock}
                                            onChange={(e) => handleVariantChange(index, e)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Eggless<sup className="text-danger">*</sup></label>
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
                                            <label htmlFor={`eggLess-yes-${index}`} className="form-check-label">Eggless<sup className="text-danger">*</sup></label>
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
                                            <label htmlFor={`eggLess-no-${index}`} className="form-check-label">Egg<sup className="text-danger">*</sup></label>
                                        </div>
                                    </div>

                                </div>

                                <button type="button" className="btn btn-danger mt-2" onClick={() => handleRemoveVariant(index)}>Remove Variant</button>
                            </div>
                        ))}
                        <button type="button" className="btn btn-primary mt-2" onClick={handleAddVariant}>Add Variant</button>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="productImage" className="form-label">Product Images<sup className="text-danger">*</sup></label>
                        <input type="file" className="form-control" id="productImage" name="productImage" multiple onChange={handleFileChange} />
                    </div>

                    <div className="col-md-12 text-center">
                        <button type="submit" className="btn btn-success" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProduct;
