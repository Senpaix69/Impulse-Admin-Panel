import React, { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "./common/Loader";
import back from "../assets/images/arrow.png";
import placeHolder from "../assets/images/placeholder.png";

const AddCategory = () => {
  const [catTitle, setCatTitle] = useState("");
  const [catImage, setCatImage] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-full bg-gray-100 py-5 overflow-y-scroll scrollbar-none">
      <div className="absolute top-0 bg-red-800 w-full p-2 flex item-center text-2xl font-bold text-white">
        <Link to="/category" replace>
          <img
            className="p-2 h-8 bg-white rounded-full cursor-pointer"
            src={back}
            alt="arrow"
          />
        </Link>
        <p className="ml-2">Add Category</p>
      </div>

      {/* Category Form */}
      <div className="flex flex-col items-center mt-10 w-full h-full">
        <div className="h-40 w-40 rounded-lg overflow-hidden shadow-md">
          <img src={placeHolder} alt="placeHolder" />
        </div>
        <button className="w-40 py-2 mt-2 bg-red-800 rounded-md text-white">Add Image</button>
      </div>

      {loading && <Loader />}
    </div>
  );
};

export default AddCategory;
