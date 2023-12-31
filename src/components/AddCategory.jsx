import React, { useEffect, useRef, useState } from "react";
import back from "../assets/images/arrow.png";
import placeHolder from "../assets/images/placeholder.png";
import deleteImg from "../assets/images/trash.png";
import { uploadFile, deleteImage } from "../api/firebase_service";
import axios from "axios";
import host from "../consts/auth_consts";
import ConfirmDialog from "./common/ConfirmDialog";
import { equalArrays } from "../utils";
import {
  ADD_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "../consts/api_consts";

const AddCategory = ({ user, category, setAdding }) => {
  const [catTitle, setCatTitle] = useState("");
  const [catImage, setCatImage] = useState(null);
  const [subCat, setSubCat] = useState("");
  const [loading, setLoading] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [pageTitle, setPageTitle] = useState("Add Category");
  const [subCategories, setSubCategories] = useState([]);
  const [status, setStatus] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
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

  useEffect(() => {
    if (category) {
      setPageTitle("Edit Category");
      setCatImage(category.imageUrl);
      setCatTitle(category.title);
      setSubCategories(category.subcategories);
    }
  }, [category]);

  useEffect(() => {
    checkIsEditing();
  }, [catTitle, catImage, subCategories]);

  const deleteCategory = async () => {
    setShowDelete(false);
    try {
      setLoading(true);
      setPageTitle("Deleting Category...");
      await deleteImage(category.imageUrl);
      const response = await axios.post(`${host}${DELETE_CATEGORY}`, {
        _id: category._id,
      });
      if (response.status === 200) {
        setAdding(false);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const checkIsEditing = () => {
    if (
      category &&
      equalArrays(subCategories, category.subcategories) &&
      catTitle.toLocaleLowerCase().trim() ===
        category.title.toLocaleLowerCase().trim() &&
      catImage === category.imageUrl
    ) {
      if (isEditing) setIsEditing(false);
      return;
    }
    if (!isEditing) setIsEditing(true);
  };

  const saveCategory = async () => {
    if (!isEditing) {
      return;
    }

    try {
      if (!catTitle) {
        throw new Error("Category title is required");
      }

      if (!catImage) {
        throw new Error("Category image is required");
      }

      setLoading(true);
      setPageTitle("Saving Category...");

      let imageUrl;
      if (!category || catImage !== category?.imageUrl) {
        if (category?.imageUrl) {
          await deleteImage(category.imageUrl);
        }
        const uploadResult = await uploadFile(
          catImage,
          `categories/${user._id}/${catImage.name}`,
          setStatus
        );
        if (!uploadResult.url) {
          throw new Error(uploadResult.error);
        }
        imageUrl = uploadResult.url;
      } else {
        imageUrl = category.imageUrl;
      }

      const requestData = {
        _id: category?._id ?? null,
        adminId: user._id,
        imageUrl,
        title: catTitle,
        subcategories: subCategories,
      };

      const response = await axios.post(
        `${host}${category ? UPDATE_CATEGORY : ADD_CATEGORY}`,
        requestData
      );

      if (response.status !== 200) {
        throw new Error(response.data);
      }
      setAdding(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setPageTitle(category ? "Edit Category" : "Add Category");
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-gray-100 py-5 overflow-y-scroll scrollbar-none">
      <div className="absolute top-0 bg-red-800 w-full p-2 px-3 flex item-center justify-between text-xl font-bold text-white">
        <div className="flex items-center">
          <button
            onClick={() => setAdding(false)}
            className={loading ? "hidden" : ""}
          >
            <img
              className="p-2 h-9 bg-white rounded-full cursor-pointer"
              src={back}
              alt="arrow"
            />
          </button>
          <p className="ml-2">{pageTitle}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-1 items-center">
          {category && (
            <button
              onClick={() => setShowDelete(true)}
              disabled={loading}
              className="p-1 bg-white h-9 w-9 rounded-full flex items-center justify-center gap-2 text-red-800 text-xs"
            >
              {pageTitle.includes("Deleting") && loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-red-800"></div>
              ) : (
                <img className="h-6 p-[2px]" src={deleteImg} alt="delete" />
              )}
            </button>
          )}
          {isEditing && (
            <button
              disabled={loading}
              onClick={saveCategory}
              className="py-1 h-8 w-20 bg-white rounded-md flex items-center justify-center gap-2 text-red-800 text-xs"
            >
              {pageTitle.includes("Saving") && loading ? (
                <>
                  <p>{status}%</p>
                  <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-red-800"></div>
                </>
              ) : (
                "Save"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Category Form */}
      <div className="flex flex-col items-center mt-16 w-full flex-1">
        <input
          name="imageFile"
          onChange={(e) => setCatImage(e.target.files[0])}
          type="file"
          accept="image/*"
          hidden
          ref={ref}
        />
        <div className="flex items-center justify-center w-52 h-52 rounded-lg overflow-hidden shadow-md">
          <img
            src={
              catImage
                ? catImage?.name
                  ? URL.createObjectURL(catImage)
                  : catImage
                : placeHolder
            }
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
            name="title"
            disabled={loading}
            onChange={(e) => setCatTitle(e.target.value)}
            value={catTitle}
            placeholder="Enter category title"
            type="text"
            className="ring-1 disabled:ring-gray-400 ring-red-800"
          />
          <div className="flex mt-2 gap-2 justify-center">
            <input
              name="subcat"
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
      <ConfirmDialog
        message={"Delete this category?"}
        showModal={showDelete}
        confirm={deleteCategory}
        cancel={() => setShowDelete(false)}
      />
    </div>
  );
};

export default AddCategory;
