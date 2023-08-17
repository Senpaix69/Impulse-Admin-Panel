import React, { useEffect, useState } from "react";
import axios from "axios";
import emptyImg from "../assets/images/nothing.png";
import addImg from "../assets/images/add.png";
import Loader from "./common/Loader";
import host from "../consts/auth_consts";
import { GET_ALL_CATEGORIES } from "../consts/api_consts";
import AddCategory from "./AddCategory";

const CategoryScreen = ({ user, setAdding, adding }) => {
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [addCategory, setAddCategory] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!adding) {
      setEditCategory(null);
      setAddCategory(false);
    }
  }, [adding]);

  const getCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${host}${GET_ALL_CATEGORIES}`);
      if (res.status === 200) {
        setCategories(res.data);
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

  return editCategory ? (
    <AddCategory user={user} category={editCategory} setAdding={setAdding} />
  ) : addCategory ? (
    <AddCategory user={user} setAdding={setAdding} />
  ) : (
    <div className="h-full bg-gray-100 py-5 overflow-y-scroll scrollbar-none">
      <div className="absolute top-0 bg-red-800 z-10 w-full p-2 px-3 flex item-center justify-between text-xl font-bold text-white">
        <p className="ml-12 md:ml-0 my-auto">Categories</p>
        <button
          onClick={() => {
            setAddCategory(true);
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

      {loading && <Loader />}

      {categories.length === 0 && (
        <div className="flex w-full h-full items-center justify-center">
          <img className="h-72" src={emptyImg} alt="empty" />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 mt-10 gap-4 px-2">
        {categories.map((category, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                setEditCategory(category);
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
    </div>
  );
};

export default CategoryScreen;
