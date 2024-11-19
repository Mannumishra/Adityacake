import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllProductTag = () => {
    const [productTags, setProductTags] = useState([]);

    // Fetch product tags from the API
    useEffect(() => {
        const fetchProductTags = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/get-producttag'); // Replace with your actual API endpoint
                setProductTags(response.data.data);
                console.log(response)
            } catch (error) {
                console.error('Error fetching product tags:', error);
            }
        };

        fetchProductTags();
    }, []);

    return (
        <>
            <div className="bread">
                <div className="head">
                    <h4>All Product Tags</h4>
                </div>
                <div className="links">
                    <Link to="/add-product-tag" className="add-new">
                        Add New <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            </div>

            <section className="mt-2 main-table table-responsive">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Tag Heading</th>
                            <th scope="col">Sort Description</th>
                            <th scope="col">Image</th>
                            <th scope="col">Multipul Products</th>
                            <th scope="col">Price Range</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productTags.length > 0 ? (
                            productTags.map((tag) => (
                                <tr key={tag._id}>
                                    <td>{tag.tagHeading}</td>
                                    <td>{tag.sortDescription}</td>
                                    <td>
                                        <img
                                            src={`http://localhost:8000/${tag.image}`}
                                            alt={tag.tagHeading}
                                            style={{ width: '100px', height: 'auto' }}
                                        />
                                    </td>
                                    <td>
                                        {tag.multipulProduct.map((productId) => (
                                            <span key={productId}>{productId.productName}, </span>
                                        ))}
                                    </td>
                                    <td>
                                        {tag.priceRange.map((range, index) => (
                                            <div key={index}>
                                                <strong>Min:</strong> {range.priceMinimum}{' '}
                                                <strong>Max:</strong> {range.priceMaximum}{' '}
                                                <img
                                                    src={`http://localhost:8000/${range.priceRangeImage}`}
                                                    alt={`Price Range ${index}`}
                                                    style={{ width: '50px', height: 'auto' }}
                                                />
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        <Link to={`/edit-product-tag/${tag._id}`} className="btn btn-success btn-sm">Edit</Link>
                                        <button className="btn btn-danger">
                                            Delete <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No Product Tags Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default AllProductTag;