import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import back from "../assets/images/arrow.png";
import placeHolder from "../assets/images/placeholder.png";
import { uploadFile } from "../api/firebase_service";
import axios from "axios";
import host from "../consts/auth_consts";

const AddCategory = ({ user }) => {
  const [catTitle, setCatTitle] = useState("");
  const [catImage, setCatImage] = useState(null);
  const [subCat, setSubCat] = useState("");
  const [loading, setLoading] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [status, setStatus] = useState(null);
  const ref = useRef();

  const addSubCategory = () => {
    if (subCat.length > 0) {
      setSubCategories((prev) => [{ title: subCat }, ...prev]);
      setSubCat("");
    }
  };

  const removeSubCategory = (index) => {
    const filtered = subCategories.filter((_, i) => i !== index);
    setSubCategories(filtered);
  };

  const goBackAndReplace = (newUrl) => {
    window.history.go(-1);
    window.history.replaceState(null, "", newUrl);
  };

  const saveCategory = async () => {
    try {
      if (!catTitle) {
        throw new Error("Category title is required");
      }

      if (!catImage) {
        throw new Error("Category image is required");
      }

      setLoading(true);

      const imageUrl = await uploadFile(
        catImage,
        `categories/${user._id}/${catImage.name}`,
        setStatus
      );

      if (imageUrl.url) {
        const response = await axios.post(`${host}/api/addCategory`, {
          adminId: user._id,
          imageUrl: imageUrl.url,
          title: catTitle,
          subcategories: subCategories,
        });

        if (response.status !== 200) {
          throw new Error(response.data);
        }
        goBackAndReplace("/category");
      } else {
        throw new Error(imageUrl.error);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-gray-100 py-5 overflow-y-scroll scrollbar-none">
      <div className="absolute top-0 bg-red-800 w-full p-2 flex item-center justify-between text-xl font-bold text-white">
        <div className="flex items-center">
          <Link className={loading ? "hidden" : ""} to="/category" replace>
            <img
              className="p-2 h-8 bg-white rounded-full cursor-pointer"
              src={back}
              alt="arrow"
            />
          </Link>
          <p className="ml-2">
            {loading ? "Saving Category..." : "Add Category"}
          </p>
        </div>
        <button
          disabled={loading}
          onClick={saveCategory}
          className="py-1 w-20 bg-white rounded-md flex items-center justify-center gap-2 text-red-800 text-xs"
        >
          {loading ? (
            <>
              <p>{status}%</p>
              <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-red-800"></div>
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>

      {/* Category Form */}
      <div className="flex flex-col items-center mt-10 w-full flex-1">
        <input
          onChange={(e) => setCatImage(e.target.files[0])}
          type="file"
          accept="image/*"
          hidden
          ref={ref}
        />
        <div className="flex items-center justify-center w-52 h-52 rounded-lg overflow-hidden shadow-md">
          <img
            src={catImage ? URL.createObjectURL(catImage) : placeHolder}
            alt="placeHolder"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
        <button
          disabled={loading}
          onClick={() => ref.current.click()}
          className="w-40 py-2 mt-2 disabled:bg-gray-400 bg-red-800 rounded-md text-white"
        >
          Add Image
        </button>
        <div className="flex flex-col w-full bg-white shadow-md gap-1 p-10 mt-6">
          <h1 className="text-red-800 font-bold">Title</h1>
          <input
            disabled={loading}
            onChange={(e) => setCatTitle(e.target.value)}
            value={catTitle}
            placeholder="Enter category title"
            type="text"
            className="ring-1 disabled:ring-gray-400 ring-red-800"
          />
          <div className="flex mt-2 gap-2 justify-center">
            <input
              disabled={loading}
              value={subCat}
              onChange={(e) => setSubCat(e.target.value)}
              placeholder="Enter subcategory"
              type="text"
              className="ring-1 disabled:ring-gray-400 ring-red-800"
            />
            <button
              disabled={loading}
              onClick={addSubCategory}
              className="py-1 w-20 disabled:bg-gray-400 bg-red-800 rounded-md text-white text-xs"
            >
              Add
            </button>
          </div>
          {subCategories.length > 0 && (
            <h1 className="text-red-800 font-bold">SubCategories</h1>
          )}
          {subCategories.map((sub, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-2 items-center py-1"
            >
              <li className="text-xs font-semibold">{sub.title}</li>
              <button
                disabled={loading}
                onClick={() => removeSubCategory(index)}
                className="p-1 w-20 disabled:bg-gray-400 bg-red-800 rounded-md text-white text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
