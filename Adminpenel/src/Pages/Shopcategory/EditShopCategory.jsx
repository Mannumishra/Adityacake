import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditShopCategory = () => {
    const { id } = useParams(); // Get the shop category ID from the URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        shopName: '', // Shop ID
        shopCategoryName: '', // Category name
    });
    const [shops, setShops] = useState([]); // To store shop options fetched from the backend
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all shops to populate the dropdown
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/get-shops');
                setShops(response.data.data); // Assuming the API response contains `shops` array
            } catch (error) {
                toast.error('Failed to fetch shops');
            }
        };

        fetchShops();
    }, []);

    // Fetch the shop category details by ID
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/get-shop-category/${id}`);
                const category = response.data.data;
                setFormData({
                    shopName: category.shopName, // Assuming this holds the shop ID
                    shopCategoryName: category.shopCategoryName,
                });
            } catch (error) {
                toast.error('Failed to fetch category details');
            }
        };

        fetchCategory();
    }, [id]);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Send PUT request to update the shop category
            await axios.put(`http://localhost:8000/api/update-shop-category/${id}`, formData);

            // Show success message
            toast.success('Shop category updated successfully!');
            setIsLoading(false);
            navigate('/all-shop-category'); // Redirect to the page showing all shop categories
        } catch (error) {
            setIsLoading(false);
            toast.error(error.response?.data?.message || 'Failed to update shop category');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Shop Category</h4>
                </div>
                <div className="links">
                    <Link to="/all-shop-category" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="shopName" className="form-label">Select Shop</label>
                        <select
                            name="shopName"
                            className="form-control"
                            id="shopName"
                            value={formData.shopName}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Select a Shop
                            </option>
                            {shops.map((shop) => (
                                <option key={shop._id} value={shop._id}>
                                    {shop.shopName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="shopCategoryName" className="form-label">Category Name</label>
                        <input
                            type="text"
                            name="shopCategoryName"
                            className="form-control"
                            id="shopCategoryName"
                            value={formData.shopCategoryName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-12 text-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`${isLoading ? 'not-allowed' : 'allowed'}`}
                        >
                            {isLoading ? 'Please Wait...' : 'Update Category'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditShopCategory;
