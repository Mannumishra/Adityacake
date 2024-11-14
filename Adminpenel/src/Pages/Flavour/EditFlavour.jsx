import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditFlavour = () => {
    const { id } = useParams(); // Get the flavour ID from the URL
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [flavourData, setFlavourData] = useState({
        flavourName: '',
        flavourStatus: false // Use boolean for checkbox state
    });
    const [btnLoading, setBtnLoading] = useState(false);

    console.log(flavourData)

    useEffect(() => {
        const fetchFlavour = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/get-single-flower/${id}`);
                
                // Check the structure of the response
                console.log(response.data); // Debugging line

                if (response.data && response.data.data) {
                    setFlavourData({
                        flavourName: response.data.data.flavourName || '', // Ensure it matches the API response
                        flavourStatus: response.data.data.flavourStatus === 'True' // Convert string to boolean
                    });
                } else {
                    toast.error('Flavour data not found');
                }
            } catch (error) {
                toast.error(error.response ? error.response.data.message : 'Error fetching flavour data');
            }
        };

        fetchFlavour(); // Call the function to fetch flavour data
    }, [id]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFlavourData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnLoading(true); // Set loading state to true

        const updatedData = {
            flavourName: flavourData.flavourName,
            flavourStatus: flavourData.flavourStatus ? 'True' : 'False' // Convert boolean back to string
        };

        try {
            const response = await axios.put(`http://localhost:8000/api/update-flower/${id}`, updatedData);
            toast.success(response.data.message); // Show success message
            navigate('/all-flower'); // Redirect to the all flavours page
        } catch (error) {
            toast.error(error.response ? error.response.data.message : 'Error updating flavour');
        } finally {
            setBtnLoading(false); // Reset loading state
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Flavour</h4>
                </div>
                <div className="links">
                    <Link to="/all-flower" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label htmlFor="flavourName" className="form-label">Flavour Name</label>
                        <input
                            type="text"
                            name='flavourName'
                            className="form-control"
                            id="flavourName"
                            value={flavourData.flavourName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="flavourStatus" className="form-label">Active</label>
                        <input
                            type="checkbox"
                            name='flavourStatus'
                            className="form-check-input"
                            id="flavourStatus"
                            checked={flavourData.flavourStatus}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12 text-center">
                        <button type="submit" disabled={btnLoading} className={`${btnLoading ? 'not-allowed' : 'allowed'}`}>
                            {btnLoading ? "Please Wait..." : "Update Flavour"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditFlavour;
