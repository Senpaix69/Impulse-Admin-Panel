import React, { useEffect, useState } from "react";
import axios from "axios";
import emptyImg from "../assets/images/nothing.png";
import addImg from "../assets/images/add.png";
import Loader from "./common/Loader";
import { herokuAddr } from "../consts/auth_consts";

const CategoryScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${herokuAddr}/api/getAllCategories`);
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
    getCategories();
  }, []);

  return (
    <div className="h-full bg-gray-100 py-5 overflow-y-scroll scrollbar-none">
      <div className="absolute top-0 bg-red-800 w-full p-2 flex item-center justify-between text-2xl font-bold text-white">
        <p className="ml-12 md:ml-0">Categories</p>
        <img
          className="p-2 h-8 bg-white rounded-full cursor-pointer"
          src={addImg}
          alt="catImage"
        />
      </div>

      {loading && <Loader />}

      {categories.length === 0 && (
        <div className="flex w-full h-full items-center justify-center">
          <img className="h-72" src={emptyImg} alt="empty" />
        </div>
      )}

      <div className="grid grid-cols-3 mt-10 gap-4">
        {categories.map((category, index) => {
          return (
            <div
              key={index}
              className="col-span-1 h-56 flex flex-col bg-white rounded-sm gap-2 items-center justify-center p-4"
            >
              <img className="h-40" src={category.imageUrl} alt="catImage" />
              <p className="text-xs md:text-sm">{category.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryScreen;
