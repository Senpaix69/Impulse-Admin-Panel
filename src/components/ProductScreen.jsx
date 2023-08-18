import React, { useEffect, useState } from "react";
import Loader from "./common/Loader";
import emptyImg from "../assets/images/nothing.png";
import addImg from "../assets/images/add.png";
import host from "../consts/auth_consts";
import AddProduct from "./AddProduct";
import { GET_ALL_CATEGORIES, GET_ALL_ITEMS } from "../consts/api_consts";
import axios from "axios";
import Dropdown from "./common/Dropdown";
import Search from "./common/Search";

const ProductScreen = ({ adding, setAdding, user }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [addProduct, setAddProduct] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const handleCategoryClick = (category) => {
    if (selectedCategory.title !== category.title)
      setSelectedCategory(category);
  };

  const handleSubCategoryClick = (subCat) => {
    if (selectedSubCategory.title !== subCat.title)
      setSelectedSubCategory(subCat);
  };

  useEffect(() => {
    if (!adding) {
      setEditProduct(null);
      setAddProduct(false);
    }
  }, [adding]);

  useEffect(() => {
    if (selectedCategory) {
      getProducts();
    }
  }, [selectedCategory]);

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${host}${GET_ALL_ITEMS}/${selectedCategory._id}`
      );
      if (res.status === 200) {
        setProducts(res.data);
      }
    } catch (e) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${host}${GET_ALL_CATEGORIES}`);
      if (res.status === 200) {
        setCategories(res.data);
        if (!selectedCategory) setSelectedCategory(res.data[0]);
        if (!selectedSubCategory)
          setSelectedSubCategory(res.data[0].subcategories);
      }
    } catch (e) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adding) getCategories();
  }, [adding]);

  return editProduct ? (
    <AddProduct user={user} setAdding={setAdding} />
  ) : addProduct ? (
    <AddProduct user={user} setAdding={setAdding} />
  ) : (
    <div className="h-full bg-gray-100 py-5 overflow-y-scroll scrollbar-none">
      <div className="absolute top-0 bg-red-800 z-10 w-full p-2 px-3 flex item-center flex-col gap-2 text-xl font-bold text-white">
        <div className="flex w-full items-center justify-between">
          <p className="ml-12 md:ml-0 my-auto">Products</p>
          <button
            onClick={() => {
              setAddProduct(true);
              setAdding(true);
            }}
          >
            <img
              className="p-2 h-9 bg-white rounded-full cursor-pointer"
              src={addImg}
              alt="category"
            />
          </button>
        </div>
        <Search />

        {/* DropDowns Menu */}
        <div className="flex items-center justify-between">
          <Dropdown
            position={"left-4"}
            list={categories}
            selected={selectedCategory}
            onChange={(value) => handleCategoryClick(value)}
          />

          <Dropdown
            position={"right-4"}
            list={selectedCategory?.subcategories}
            selected={selectedSubCategory}
            onChange={(value) => handleSubCategoryClick(value)}
          />
        </div>
      </div>
      {loading && <Loader />}

      {categories.length === 0 && (
        <div className="flex w-full h-full items-center justify-center">
          <img className="h-72" src={emptyImg} alt="empty" />
        </div>
      )}

      {categories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 mt-[132px] gap-4 px-2">
          {/* Product List */}
          {categories.map((category, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setEditProduct(category);
                  setAdding(true);
                }}
                className="col-span-1 relative h-56 cursor-pointer flex flex-col bg-white rounded-md gap-2 items-center justify-center p-4 shadow-sm hover:shadow-md"
              >
                <img
                  className="h-40"
                  src={category.imageUrl}
                  alt="categoryImage"
                />
                <p className="text-xs md:text-sm">{category.title}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductScreen;
