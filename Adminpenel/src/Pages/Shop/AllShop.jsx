import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllShop = () => {
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch shops from the backend
    const fetchShops = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/get-shops');
            setShops(response.data.data); // Assuming the response contains a data field with the shops array
        } catch (error) {
            toast.error('Error fetching shops!');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle delete shop
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this shop!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8000/api/delete-shop/${id}`);
                    fetchShops(); // Refresh the shops list after deletion
                    Swal.fire('Deleted!', 'Your shop has been deleted.', 'success');
                } catch (error) {
                    Swal.fire('Error!', 'There was an issue deleting the shop.', 'error');
                }
            }
        });
    };

    // Use effect to fetch data on mount
    useEffect(() => {
        fetchShops();
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Shops</h4>
                </div>
                <div className="links">
                    <Link to="/add-shop" className="add-new">
                        Add New <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            </div>

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Shop Name</th>
                            <th scope="col">Shop Image</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                        ) : (
                            shops.length > 0 ? shops.map((shop, index) => (
                                <tr key={shop._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{shop.shopName}</td>
                                    <td>
                                        <img 
                                            src={`http://localhost:8000/${shop.shopImage}`}
                                            alt={shop.shopName} 
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                        />
                                    </td>
                                    <td>
                                        <Link to={`/edit-shop/${shop._id}`} className="bt edit">
                                            Edit <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDelete(shop._id)} className="bt delete">
                                            Delete <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" className="text-center">No shops found</td></tr>
                            )
                        )}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default AllShop;
