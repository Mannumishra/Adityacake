import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCategory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        categoryName: '',
        categoryImage: null,
        categoryStatus: 'False',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prevData => ({ ...prevData, categoryImage: files[0] }));
        } else {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const handleCheckboxChange = () => {
        setFormData(prevData => ({
            ...prevData,
            categoryStatus: prevData.categoryStatus === 'True' ? 'False' : 'True'
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const uploadData = new FormData();
        uploadData.append('mainCategoryName', formData.categoryName);
        uploadData.append('mainCategoryImage', formData.categoryImage);
        uploadData.append('mainCategoryStatus', formData.categoryStatus);

        try {
            const response = await axios.post('http://localhost:8000/api/create-main-category', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(response.data.message);
            navigate('/all-category'); // Redirect to the category list
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding category");
            console.error("Error adding category:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Category</h4>
                </div>
                <div className="links">
                    <Link to="/all-category" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="categoryName" className="form-label">Category Name</label>
                        <input
                            type="text"
                            name='categoryName'
                            className="form-control"
                            id="categoryName"
                            value={formData.categoryName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="categoryImage" className="form-label">Category Image</label>
                        <input
                            type="file"
                            name='categoryImage'
                            className="form-control"
                            id="categoryImage"
                            accept="image/*"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="categoryActive"
                                id="categoryActive"
                                checked={formData.categoryStatus === 'True'}
                                onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor="categoryActive">
                                Active in Homepage
                            </label>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
                            {isLoading ? "Please Wait..." : "Add Category"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddCategory;
