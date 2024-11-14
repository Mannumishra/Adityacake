import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllProduct = () => {
    const [data, steData] = useState([])

    const getApiData = async () => {
        try {
            const res = await axios.get("https://ro.digiindiasolutions.com/api/get-task")
            // console.log(res)
            steData(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getApiData()
    }, [])
    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Product List </h4>
                </div>
                <div className="links">
                    <Link to="/add-product" className="add-new">Add New <i class="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <div className="filteration">
                <div className="selects">
                    {/* <select>
                        <option>Ascending Order </option>
                        <option>Descending Order </option>
                    </select> */}
                </div>
                <div className="search">
                    <label htmlFor="search">Search </label> &nbsp;
                    <input type="text" name="search" id="search" />
                </div>
            </div>

            <section className="d-table ">
                <table class="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Custmor Mobile</th>
                            <th scope="col">Looking For</th>
                            <th scope="col">Perpose of wisit</th>
                            <th scope="col">field Exicutive name</th>
                            <th scope="col">field Exicutive ID</th>
                            <th scope="col">Date</th>
                            <th scope="col">Time</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item, index) =>
                                <tr key={index}>
                                    <th scope="row">{index+1}</th>
                                    <td>{item.customerName.customerName}</td>
                                    <td>{item.customerName.mobileNumber}</td>
                                    <td>{item.lookingFor.lookingFor}</td>
                                    <td>{item.visitePurpose.visitePurpose}</td>
                                    <td>{item.fieldExecutiveName.name}</td>
                                    <td>{item.fieldExecutiveName.vendorId}</td>
                                    <td>{item.date}</td>
                                    <td>{item.time}</td>
                                    <td><Link className="bt edit">Edit <i class="fa-solid fa-pen-to-square"></i></Link></td>
                                    <td><Link className="bt delete" >Delete <i class="fa-solid fa-trash"></i></Link></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </section>
        </>
    )
}

export default AllProduct