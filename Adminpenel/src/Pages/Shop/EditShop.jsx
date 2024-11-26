import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditShop = () => {
    const { id } = useParams(); // Get the shop ID from the URL
    const navigate = useNavigate();

    const [shopName, setShopName] = useState('');
    const [shopImage, setShopImage] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);

    // Fetch the shop data when the component mounts
    const fetchShopData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/shop-by-id/${id}`);
            const shop = response.data.data;
            setShopName(shop.shopName);
            setShopImage(shop.shopImage);
        } catch (error) {
            toast.error('Error fetching shop data!');
        }
    };

    useEffect(() => {
        fetchShopData();
    }, [id]);

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        try {
            const updatedShop = new FormData();
            updatedShop.append('shopName', shopName);
            updatedShop.append('shopImage', shopImage);

            await axios.put(`http://localhost:8000/api/update-shop/${id}`, updatedShop, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Shop updated successfully!');
            navigate('/all-shop'); // Redirect to All Shops page after success
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating shop');
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Shop</h4>
                </div>
                <div className="links">
                    <Link to="/all-shops" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="shopName" className="form-label">Shop Name</label>
                        <input 
                            type="text" 
                            name="shopName" 
                            className="form-control" 
                            id="shopName" 
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)} 
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
                            onChange={(e) => setShopImage(e.target.files[0])} 
                        />
                        {shopImage && typeof shopImage === 'string' && (
                            <img src={`http://localhost:8000/${shopImage}`} alt="Shop Preview" style={{ width: '100px', marginTop: '10px' }} />
                        )}
                    </div>
                    <div className="col-12 text-center">
                        <button 
                            type="submit" 
                            className={`${btnLoading ? 'not-allowed' : 'allowed'}`} 
                            disabled={btnLoading}
                        >
                            {btnLoading ? 'Please Wait...' : 'Update Shop'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditShop;
