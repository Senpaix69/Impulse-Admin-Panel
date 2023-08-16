import React, { useState } from "react";
import Loader from "./common/Loader";
import emptyImg from "../assets/images/nothing.png";
import addImg from "../assets/images/add.png";
import edit from "../assets/images/edit.png";
import { Link } from "react-router-dom";

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  return (
    <div className="h-full bg-gray-100 py-5 overflow-y-scroll scrollbar-none">
      <div className="absolute top-0 bg-red-800 w-full p-2 flex item-center justify-between text-xl font-bold text-white">
        <p className="ml-12 md:ml-0">Products</p>
        <Link to="/addCategory">
          <img
            className="p-2 h-8 bg-white rounded-full cursor-pointer"
            src={addImg}
            alt="category"
          />
        </Link>
      </div>

      {loading && <Loader />}

      {products.length === 0 && (
        <div className="flex w-full h-full items-center justify-center">
          <img className="h-72" src={emptyImg} alt="empty" />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 mt-10 gap-4 px-2">
        {products.map((product, index) => {
          return (
            <div
              key={index}
              className="col-span-1 relative h-56 flex flex-col bg-white rounded-sm gap-2 items-center justify-center p-4"
            >
              <img
                className="h-40"
                src={product.imageUrl}
                alt="categoryImage"
              />
              <p className="text-xs md:text-sm">{product.title}</p>
              <img
                className="absolute h-5 top-2 right-2 cursor-pointer"
                src={edit}
                alt="edit"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductScreen;
