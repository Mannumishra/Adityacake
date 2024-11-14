import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditColor = () => {
    const { id } = useParams(); // Get the color ID from the URL
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [colorData, setColorData] = useState({
        colorName: '',
        colorStatus: false // Use boolean for checkbox state
    });
    const [btnLoading, setBtnLoading] = useState(false);

    useEffect(() => {
        const fetchColor = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/get-single-color/${id}`);
                // Convert colorStatus to boolean for easier handling
                setColorData({
                    ...response.data.data,
                    colorStatus: response.data.data.colorStatus === 'True' // Assuming the API returns "True" or "False" as strings
                });
            } catch (error) {
                toast.error(error.response ? error.response.data.message : 'Error fetching color data');
            }
        };

        fetchColor(); // Call the function to fetch color data
    }, [id]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setColorData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnLoading(true); // Set loading state to true

        // Convert colorStatus back to string for the API request
        const updatedData = {
            ...colorData,
            colorStatus: colorData.colorStatus ? 'True' : 'False' // Convert boolean back to string
        };

        try {
            const response = await axios.put(`http://localhost:8000/api/update-color/${id}`, updatedData);
            toast.success(response.data.message); // Show success message
            navigate('/all-color'); // Redirect to the all colors page
        } catch (error) {
            toast.error(error.response ? error.response.data.message : 'Error updating color');
        } finally {
            setBtnLoading(false); // Reset loading state
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Color</h4>
                </div>
                <div className="links">
                    <Link to="/all-color" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label htmlFor="title" className="form-label">Color Name</label>
                        <input
                            type="text"
                            name='colorName'
                            className="form-control"
                            id="title"
                            value={colorData.colorName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="TagColour" className="form-label">Color</label>
                        <input
                            type="color"
                            name='colorName' // Use the same name as colorName for the hex value
                            className="form-control"
                            id="TagColour"
                            value={colorData.colorName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="colorStatus" className="form-label">Active</label>
                        <input
                            type="checkbox"
                            name='colorStatus'
                            className="form-check-input"
                            id="colorStatus"
                            checked={colorData.colorStatus}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12 text-center">
                        <button type="submit" disabled={btnLoading} className={`${btnLoading ? 'not-allowed' : 'allowed'}`}>
                            {btnLoading ? "Please Wait..." : "Update Tag"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditColor;
