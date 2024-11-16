import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllInnerSubCategory = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [innerSubcategories, setInnerSubcategories] = useState([]);

    useEffect(() => {
        const fetchInnerSubCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/get-inner-subcategory');
                setInnerSubcategories(response.data.data);
            } catch (error) {
                toast.error("Error fetching inner subcategories");
                console.error("Error fetching inner subcategories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInnerSubCategories();
    }, []);

    if (isLoading) {
        return <p>Loading subcategories...</p>; // Loading state
    }

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Inner SubCategory List</h4>
                </div>
                <div className="links">
                    <Link to="/add-innersubcategory" className="add-new">Add New <i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <section className="d-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>S No</th>
                            <th>Category Name</th>
                            <th>Subcategory Name</th>
                            <th>Inner Subcategory Name</th>
                            <th>Image</th>
                            <th>Status</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {innerSubcategories.map((subcategory, index) =>
                            <tr key={subcategory._id}>
                                <td>{index + 1}</td>
                                <td>{subcategory.categoryName.mainCategoryName}</td>
                                <td>{subcategory.subcategoryName.subcategoryName}</td>
                                <td>{subcategory.innerSubcategoryName}</td>
                                <td>
                                    <img src={`http://localhost:8000/${subcategory.Image}`} alt={subcategory.innerSubcategoryName} style={{ width: '50px', height: '50px' }} />
                                </td>
                                <td>{subcategory.Status}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </>
    );
}

export default AllInnerSubCategory;
