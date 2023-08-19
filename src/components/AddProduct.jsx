import React, { useEffect, useRef, useState } from "react";
import back from "../assets/images/arrow.png";
import deleteImg from "../assets/images/trash.png";
import CustomInput from "./common/CustomInput";
import { equalArrays, hexToInt, intToHex, matchColors } from "../utils";
import { uploadFile, deleteImage } from "../api/firebase_service";
import ColorPicker from "./common/ColorPicker";
import BtnChips from "./common/BtnChips";
import ConfirmDialog from "./common/ConfirmDialog";
import Loader from "./common/Loader";
import axios from "axios";
import host from "../consts/auth_consts";
import {
  ADD_ITEM,
  DELETE_ITEM,
  GET_ITEM_DETAILS,
  UPDATE_ITEM,
} from "../consts/api_consts";

const AddProduct = ({ user, product, setAdding, categories }) => {
  const [pageTitle, setPageTitle] = useState("Add Product");
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [productDetail, setProductDetails] = useState(null);
  const [status, setStatus] = useState(0);
  const [deletedImages, setDeletedImages] = useState([]);

  // Form Data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [productType, setProductType] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [price, setPrice] = useState(0);
  const [available, setAvaiable] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState([]);
  const ref = useRef();

  useEffect(() => {
    if (product && selectedCategory) {
      const selectedSubCategory = selectedCategory?.subcategories.find(
        (subcat) => subcat._id === product.subCatId
      );
      setSelectedSubCategory(selectedSubCategory);
    } else if (selectedSubCategory) {
      setSelectedSubCategory(null);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (productDetail?.images) {
      setTitle(productDetail.title);
      setAvaiable(productDetail.availableQuantity);
      setColors(productDetail.colors.map((color) => intToHex(color)));
      setDescription(productDetail.description);
      setImages(productDetail.images);
      setPrice(productDetail.price);
      setPrivacyPolicy(productDetail.privacyPolicy);
      setProductType(productDetail.productType);
      setVideoUrl(productDetail.videoUrl);
      const selectedCategory = categories.find(
        (category) => category._id === product.categoryId
      );
      setSelectedCategory(selectedCategory);
    } else if (product) {
      setPageTitle("Edit Product");
      fetchDetails();
    }
  }, [product, productDetail]);

  useEffect(() => {
    if (pageTitle && pageTitle !== "Add Product") checkIsEditing();
  }, [
    title,
    description,
    privacyPolicy,
    productType,
    videoUrl,
    available,
    colors,
    price,
    images,
  ]);

  // Methods
  const fetchDetails = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${host}${GET_ITEM_DETAILS}/${product.itemId}`
      );
      if (response.status === 200) setProductDetails(response.data);
      else throw new Error("Network Error");
    } catch (e) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoader(false);
    }
  };

  const handleDeleteImage = (index) => {
    const deletedImage = images[index];
    setDeletedImages((prev) => [deletedImage, ...prev]);

    const filteredImgs = images.filter((_, i) => i !== index);
    setImages(filteredImgs);
  };

  const deleteProduct = async () => {
    setShowDelete(false);
    try {
      setLoading(true);
      const response = await axios.delete(
        `${host}${DELETE_ITEM}/${product.itemId}`
      );
      if (response.status !== 200) {
        throw new Error("Network error");
      }
      images.forEach(async (image) => {
        if (!image.name) await deleteImage(image);
      });
      setAdding(false);
    } catch (e) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async () => {
    if (!isEditing) {
      return;
    }

    const requiredFields = [
      {
        validate: () => images.length > 0,
        message: "Please select at least one image",
      },
      {
        validate: () => colors.length > 0,
        message: "Please select at least one color",
      },
      {
        validate: () => !!selectedCategory,
        message: "Please select a category",
      },
      {
        validate: () => !!selectedSubCategory,
        message: "Please select a sub-category",
      },
      { validate: () => !!description, message: "Please enter description" },
      {
        validate: () => !!privacyPolicy,
        message: "Please enter privacy policy",
      },
      { validate: () => !!title, message: "Please enter product title" },
      { validate: () => !!productType, message: "Please enter product type" },
    ];

    for (const { validate, message } of requiredFields) {
      if (!validate()) {
        alert(message);
        return;
      }
    }

    setLoading(true);
    setPageTitle("Saving Product...");

    try {
      // Deleting Images
      deletedImages.forEach(async (image) => {
        if (!image.name) await deleteImage(image);
      });

      const imagesUrl = await Promise.all(
        images.map(async (image, index) => {
          let result;
          if (image.name) {
            result = await uploadFile(
              image,
              `items/${selectedCategory._id}_${selectedCategory.title}/${user._id}/${image.name}`
            );
          }
          const statusPercentage = ((index + 1) / images.length) * 100;
          setStatus(statusPercentage.toFixed(1));

          return image.name ? result.url : image;
        })
      );

      const colorsRgba = colors.map((color) => {
        if (color.startsWith("#")) {
          return hexToInt(color);
        } else {
          return color;
        }
      });

      const requestData = {
        _id: product?.itemId,
        title,
        images: imagesUrl,
        rating: 0.0,
        price: Number(price),
        productType,
        colors: colorsRgba,
        availableQuantity: available,
        description,
        videoUrl,
        categoryId: selectedCategory._id,
        subCatId: selectedSubCategory._id,
        privacyPolicy,
      };

      const response = await axios.post(
        `${host}${productDetail ? UPDATE_ITEM : ADD_ITEM}`,
        requestData
      );

      if (response.status !== 200) {
        throw new Error(response.data);
      }
      setAdding(false);
    } catch (e) {
      alert(`Error: ${e.message}`);
    } finally {
      setPageTitle(product ? "Edit Product" : "Add Product");
      setLoading(false);
      setStatus(0);
    }
  };

  const checkIsEditing = () => {
    const isContentEqual =
      productDetail?.images &&
      equalArrays(images, productDetail.images) &&
      matchColors(colors, productDetail.colors) &&
      title.trim().toLowerCase() === productDetail.title.trim().toLowerCase() &&
      description.trim().toLowerCase() ===
        productDetail.description.trim().toLowerCase() &&
      privacyPolicy.trim().toLowerCase() ===
        productDetail.privacyPolicy.trim().toLowerCase() &&
      price === productDetail.price &&
      videoUrl.toLowerCase().trim() ===
        productDetail.videoUrl.toLowerCase().trim() &&
      productType.toLowerCase().trim() ===
        productDetail.productType.toLowerCase().trim() &&
      available === productDetail.availableQuantity;

    if (isEditing !== !isContentEqual) {
      setIsEditing(!isContentEqual);
    }
  };

  return (
    <div className="h-full bg-gray-100 py-5 overflow-y-scroll scrollbar-none">
      <div className="absolute top-0 bg-red-800 w-full z-10 p-2 px-3 flex item-center justify-between text-xl font-bold text-white">
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
        <div
          className={`flex gap-1 duration-300 transition-all items-center ${
            loader ? "opacity-0" : "opacity-100"
          }`}
        >
          <button
            onClick={() => setShowDelete(true)}
            disabled={loading}
            className={`p-1 bg-white h-9 w-9 rounded-full flex items-center justify-center gap-2 text-red-800 text-xs ${
              product ? "opacity-100" : "opacity-0"
            }`}
          >
            {pageTitle.includes("Deleting") && loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-red-800"></div>
            ) : (
              <img className="h-6 p-[2px]" src={deleteImg} alt="delete" />
            )}
          </button>
          <button
            disabled={loading}
            onClick={saveProduct}
            className={`py-1 h-8 w-20  duration-300 transition-color rounded-md flex items-center justify-center gap-2 text-red-800 text-xs ${
              isEditing
                ? "bg-white"
                : "bg-red-900 text-white cursor-not-allowed"
            }`}
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
        </div>
      </div>

      {loader ? (
        <Loader />
      ) : (
        <div className="mb-20">
          <div className="flex flex-col items-center mt-16 w-full flex-1">
            <input
              name="imageFile"
              onChange={(e) =>
                setImages((prev) => [...e.target.files, ...prev])
              }
              type="file"
              multiple
              accept="image/*"
              hidden
              ref={ref}
            />
            <button
              disabled={loading}
              onClick={() => ref.current.click()}
              className="py-2 px-6 mt-2 disabled:bg-gray-400 bg-red-800 rounded-md text-white"
            >
              Add Image
            </button>

            {/* Render Images */}
            {images.length > 0 && (
              <div>
                <div className="flex mt-4 flex-wrap gap-1 max-h-[310px] p-2 bg-red-100 overflow-y-scroll">
                  {images.map((image, index) => (
                    <button
                      onClick={() => handleDeleteImage(index)}
                      key={index}
                      className="h-36 w-36 flex-grow bg-white rounded-lg p-1 shadow-md"
                    >
                      <img
                        src={image.name ? URL.createObjectURL(image) : image}
                        alt="placeHolder"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </button>
                  ))}
                </div>
                <p className="p-2 bg-red-100 text-red-800">
                  <span className="font-bold">Note:</span> Click on specific
                  image to delete it.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col text-xs md:text-sm gap-2 mx-2 items-start">
            <BtnChips
              list={categories}
              title={"Select Category *"}
              onSelect={(value) => setSelectedCategory(value)}
              selected={selectedCategory}
            />

            {selectedCategory && (
              <BtnChips
                list={selectedCategory.subcategories}
                title={"Select SubCategory *"}
                onSelect={(value) => setSelectedSubCategory(value)}
                selected={selectedSubCategory}
              />
            )}
          </div>

          <div className="flex flex-col w-full bg-white shadow-md gap-2 p-6 md:p-10 mt-6">
            <h1 className="m-auto text-red-800 font-bold">Product Details *</h1>
            <CustomInput
              title={"Title"}
              disabled={loading}
              placeholder={"Enter product title"}
              value={title}
              onChange={(value) => setTitle(value)}
            />
            <CustomInput
              title={"Product Type"}
              disabled={loading}
              placeholder={"eg: tech / household product"}
              value={productType}
              onChange={(value) => setProductType(value)}
            />
            <CustomInput
              title={"Video (optional)"}
              disabled={loading}
              placeholder={"Place url here"}
              value={videoUrl}
              onChange={(value) => setVideoUrl(value)}
            />

            <div className="flex gap-2 w-full items-center">
              <div className="flex-1">
                <CustomInput
                  title={"Price"}
                  disabled={loading}
                  placeholder={"0"}
                  value={price}
                  inputType={"number"}
                  onChange={(value) => setPrice(value)}
                />
              </div>
              <div className="flex-1">
                <CustomInput
                  title={"Avaiable Quantity"}
                  disabled={loading}
                  placeholder={"0"}
                  value={available}
                  inputType={"number"}
                  onChange={(value) => setAvaiable(value)}
                />
              </div>
            </div>
            {colors.length > 0 && (
              <div className="grid grid-cols-3 mt-2 p-4 gap-2 text-xs text-center bg-gray-100 rounded-md shadow-md items-start">
                <h1 className="text-sm font-semibold text-red-800">Colors</h1>
                <h1 className="text-sm font-semibold text-red-800">
                  Hex Value
                </h1>
                <h1 className="text-sm font-semibold text-red-800">Action</h1>
                {colors.map((color, index) => (
                  <>
                    <div
                      style={{ backgroundColor: color }}
                      className="m-auto col-span-1 w-8 h-8 rounded-full border"
                    ></div>
                    <p className="m-auto col-span-1">{color}</p>
                    <button
                      onClick={() =>
                        setColors((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="py-2 w-20 m-auto bg-red-100 text-red-800 rounded-lg"
                    >
                      Remove
                    </button>
                  </>
                ))}
              </div>
            )}

            <ColorPicker
              onPick={(color) =>
                setColors((prev) => {
                  if (!prev.includes(color)) return [color, ...prev];
                  else return prev;
                })
              }
            />

            <div className="w-full">
              <textarea
                name="description"
                className="w-full ring-1 disabled:ring-gray-400 ring-red-800"
                placeholder="Enter description here"
                rows="8"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <textarea
                name="privacyPolicy"
                value={privacyPolicy}
                className="mt-2 w-full ring-1 disabled:ring-gray-400 ring-red-800"
                placeholder="Enter privacy policy here"
                onChange={(e) => setPrivacyPolicy(e.target.value)}
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        message={"Delete this product?"}
        showModal={showDelete}
        confirm={deleteProduct}
        cancel={() => setShowDelete(false)}
      />
    </div>
  );
};

export default AddProduct;
