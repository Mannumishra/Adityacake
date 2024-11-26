import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddShop = () => {
    const [formData, setFormData] = useState({
        shopName: '',
        shopImage: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle file input change
    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            shopImage: e.target.files[0],
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Prepare form data for the POST request
        const data = new FormData();
        data.append('shopName', formData.shopName);
        data.append('shopImage', formData.shopImage);

        try {
            // Send POST request to the backend
            const response = await axios.post('http://localhost:8000/api/create-shop', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Show success message
            toast.success('Shop added successfully!');
            setIsLoading(false);
            navigate('/all-shop'); // Redirect to the page showing all shops
        } catch (error) {
            setIsLoading(false);
            toast.error(error.response?.data?.message || 'Failed to add shop');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Shop</h4>
                </div>
                <div className="links">
                    <Link to="/all-shops" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="col-md-6">
                        <label htmlFor="shopName" className="form-label">Shop Name</label>
                        <input
                            type="text"
                            name="shopName"
                            className="form-control"
                            id="shopName"
                            value={formData.shopName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="shopImage" className="form-label">Shop Image</label>
                        <input
                            type="file"
                            name="shopImage"
                            className="form-control"
                            id="shopImage"
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                    <div className="col-12 text-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`${isLoading ? 'not-allowed' : 'allowed'}`}
                        >
                            {isLoading ? 'Please Wait...' : 'Add Shop'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddShop;
