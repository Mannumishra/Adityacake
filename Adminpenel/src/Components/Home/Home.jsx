import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Header from '../Header/Header'
import Dashboard from '../../Pages/Dashboard/Dashboard'
import AllCategory from '../../Pages/Category/AllCategory'
import AddCategory from '../../Pages/Category/AddCategory'
import EditCategory from '../../Pages/Category/EditCategory'
import AllProduct from '../../Pages/Products/AllProduct'
import AddProduct from '../../Pages/Products/AddProduct'
import AllBanner from '../../Pages/Banners/AllBanner'
import AddBanner from '../../Pages/Banners/AddBanner'
import EditBanner from '../../Pages/Banners/EditBanner'
import AllShopBanner from '../../Pages/ShopBanner/AllShopBanner'
import AddShopBanner from '../../Pages/ShopBanner/AddShopBanner'
import EditShopBanner from '../../Pages/ShopBanner/EditShopBanner'
import AllTags from '../../Pages/Tags/AllTags'
import AddTag from '../../Pages/Tags/AddTag'
import EditTag from '../../Pages/Tags/EditTag'
import AllVoucher from '../../Pages/Vouchers/AllVoucher'
import CreateVoucher from '../../Pages/Vouchers/AddVoucher'
import AllOrder from '../../Pages/Orders/AllOrder'
import EditOrder from '../../Pages/Orders/EditOrder'
import AllUsers from '../../Pages/Users/AllUsers'
import AllSubCategory from '../../Pages/SubCategory/AllSubCategory'
import AddSubCategory from '../../Pages/SubCategory/AddSubCategory'
import EditSubCategory from '../../Pages/SubCategory/EditSubCategory'
import AllColor from '../../Pages/Color/AllColor'
import AddColor from '../../Pages/Color/AddColor'
import EditColor from '../../Pages/Color/EditColor'
import AllSize from '../../Pages/Size/AllSize'
import AddSize from '../../Pages/Size/AddSize'
import EditSize from '../../Pages/Size/EditSize'
import AllFlavour from '../../Pages/Flavour/AllFlavour'
import AddFlavour from '../../Pages/Flavour/AddFlavour'
import EditFlavour from '../../Pages/Flavour/EditFlavour'

const Home = () => {
  return (
    <>

      <Header />
      <div className="rightside">
        <Routes>
          <Route path={"/dashboard"} element={<Dashboard />} />

          {/* Category --  */}
          <Route path={"/all-category"} element={<AllCategory />} />
          <Route path={"/add-category"} element={<AddCategory />} />
          <Route path={"/edit-category/:id"} element={<EditCategory />} />

          {/* Subcategory */}

          <Route path={"/all-subcategory"} element={<AllSubCategory />} />
          <Route path={"/add-subcategory"} element={<AddSubCategory />} />
          <Route path={"/edit-subcategory/:id"} element={<EditSubCategory />} />

          {/* Color */}
          <Route path={"/all-color"} element={<AllColor />} />
          <Route path={"/add-color"} element={<AddColor />} />
          <Route path={"/edit-color/:id"} element={<EditColor />} />

          {/* Size */}
          <Route path={"/all-size"} element={<AllSize />} />
          <Route path={"/add-size"} element={<AddSize />} />
          <Route path={"/edit-size/:id"} element={<EditSize />} />

          {/* Flover */}
          <Route path={"/all-flover"} element={<AllFlavour />} />
          <Route path={"/add-flover"} element={<AddFlavour />} />
          <Route path={"/edit-flover/:id"} element={<EditFlavour />} />

          {/* Product --  */}
          <Route path={"/all-products"} element={<AllProduct />} />
          <Route path={"/add-product"} element={<AddProduct />} />
          <Route path={"/edit-product/:id"} element={<EditCategory />} />


          {/* --- Orders --- */}
          <Route path={"/all-users"} element={<AllUsers />} />

          {/* --- Vouchers --- */}
          <Route path={"/all-voucher"} element={<AllVoucher />} />   {/* // All Vouchers */}
          <Route path={"/add-voucher"} element={<CreateVoucher />} />

          {/* --- Tags --- */}
          <Route path={"/all-tags"} element={<AllTags />} />
          <Route path={"/add-tag"} element={<AddTag />} />
          <Route path={"/edit-tag/:id"} element={<EditTag />} />

          {/* --- Banners --- */}
          <Route path={"/all-banners"} element={<AllBanner />} />
          <Route path={"/add-banner"} element={<AddBanner />} />
          <Route path={"/edit-banner/:id"} element={<EditBanner />} />

          {/* --- Banners --- */}
          <Route path={"/all-shop-banners"} element={<AllShopBanner />} />
          <Route path={"/add-shop-banner"} element={<AddShopBanner />} />
          <Route path={"/edit-shop-banner/:id"} element={<EditShopBanner />} />

          {/* --- Orders --- */}
          <Route path={"/all-orders"} element={<AllOrder />} />
          <Route path={"/edit-order/:id"} element={<EditOrder />} />





          {/* all-shop */}

        </Routes>
      </div>

    </>
  )
}

export default Home