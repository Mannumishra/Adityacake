import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllShopCategory = () => {
    const [shopCategories, setShopCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch shop categories from the backend
    const fetchShopCategories = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/get-shop-category');
            setShopCategories(response.data.data); // Assuming the response contains a `data` field with shop categories
        } catch (error) {
            toast.error('Error fetching shop categories!');
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    // Handle delete shop category
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this shop category!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8000/api/delete-shop-category/${id}`);
                    fetchShopCategories(); // Refresh the list after deletion
                    Swal.fire('Deleted!', 'Your shop category has been deleted.', 'success');
                } catch (error) {
                    Swal.fire('Error!', 'There was an issue deleting the shop category.', 'error');
                }
            }
        });
    };

    // Use effect to fetch data on mount
    useEffect(() => {
        fetchShopCategories();
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Shop Categories</h4>
                </div>
                <div className="links">
                    <Link to="/add-shop-category" className="add-new">
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
                            <th scope="col">Shop Category Name</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="text-center">Loading...</td>
                            </tr>
                        ) : shopCategories.length > 0 ? (
                            shopCategories.map((category, index) => (
                                <tr key={category._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{category.shopName.shopName}</td> {/* Assuming populated shopName */}
                                    <td>{category.shopCategoryName}</td>
                                    <td>
                                        <Link to={`/edit-shop-category/${category._id}`} className="bt edit">
                                            Edit <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDelete(category._id)} className="bt delete">
                                            Delete <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No shop categories found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default AllShopCategory;
