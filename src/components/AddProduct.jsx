import React, { useEffect, useRef, useState } from "react";
import back from "../assets/images/arrow.png";
import deleteImg from "../assets/images/trash.png";
import CustomInput from "./common/CustomInput";
import { equalArrays } from "../utils";
import { uploadFile } from "../api/firebase_service";
import ColorPicker from "./common/ColorPicker";
import BtnChips from "./common/BtnChips";
import ConfirmDialog from "./common/ConfirmDialog";
import axios from "axios";
import host from "../consts/auth_consts";
import { ADD_ITEM } from "../consts/api_consts";

const AddProduct = ({ user, product, setAdding, categories }) => {
  const [pageTitle, setPageTitle] = useState("Add Product");
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  useEffect(() => setSelectedSubCategory(null), [selectedCategory]);
  useEffect(
    () => checkIsEditing(),
    [
      title,
      description,
      privacyPolicy,
      productType,
      videoUrl,
      available,
      colors,
      price,
      images,
    ]
  );
  useEffect(() => {
    if (product?.images) {
      setAvaiable(product.availableQuantity);
      setColors(product.colors);
      setDescription(product.description);
      setImages(product.images);
      setPrice(product.price);
      setPrivacyPolicy(product.privacyPolicy);
      setProductType(product.productType);
      setVideoUrl(product.videoUrl);
      setPageTitle("Edit Product");
    }
  }, [product]);

  // Methods
  const handleDeleteImage = (index) => {
    const deletedImage = images[index];
    setDeletedImages((prev) => [deletedImage, ...prev]);

    const filteredImgs = images.filter((_, i) => i !== index);
    setImages(filteredImgs);
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
      const imagesUrl = await Promise.all(
        images.map(async (image) => {
          const result = await uploadFile(
            image,
            `items/${selectedCategory._id}_${selectedCategory.title}/${user._id}/${image.name}`
          );
          setStatus(((images.indexOf(image) + 1) / images.length) * 100);
          return result.url;
        })
      );

      const requestData = {
        title,
        images: imagesUrl,
        rating: 0.0,
        price: Number(price),
        productType,
        colors,
        availableQuantity: available,
        description,
        videoUrl,
        categoryId: selectedCategory._id,
        subCatId: selectedSubCategory._id,
        privacyPolicy,
      };

      const response = await axios.post(`${host}${ADD_ITEM}`, requestData);

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
      product.images &&
      equalArrays(images, product.images) &&
      equalArrays(colors, product.colors) &&
      title.trim().toLowerCase() === product.title.trim().toLowerCase() &&
      description.trim().toLowerCase() ===
        product.description.trim().toLowerCase() &&
      privacyPolicy.trim().toLowerCase() ===
        product.privacyPolicy.trim().toLowerCase() &&
      price === product.price &&
      videoUrl.toLocaleLowerCase().trim() ===
        product.videoUrl.toLocaleLowerCase().trim() &&
      productType.toLocaleLowerCase().trim() ===
        product.productType.toLocaleLowerCase().trim() &&
      available === product.availableQuantity;

    setIsEditing(!isContentEqual || !isEditing);
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
        <div className="flex gap-1 items-center">
          {product && (
            <button
              onClick={() => setShowDelete(true)}
              disabled={loading}
              className="p-1 bg-white h-9 w-9 rounded-full flex items-center justify-center gap-2 text-red-800 text-xs"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-red-800"></div>
              ) : (
                <img className="h-6 p-[2px]" src={deleteImg} alt="delete" />
              )}
            </button>
          )}
          {isEditing && (
            <button
              disabled={loading}
              onClick={saveProduct}
              className="py-1 h-8 w-20 bg-white rounded-md flex items-center justify-center gap-2 text-red-800 text-xs"
            >
              {!product && loading ? (
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

      <div className="mb-20">
        <div className="flex flex-col items-center mt-16 w-full flex-1">
          <input
            onChange={(e) => setImages((prev) => [...e.target.files, ...prev])}
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
                <span className="font-bold">Note:</span> Click on specific image
                to delete it.
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

        <div className="flex flex-col w-full bg-white shadow-md gap-2 p-10 mt-6">
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
              <h1 className="text-sm font-semibold text-red-800">
                Picked Colors
              </h1>
              <h1 className="text-sm font-semibold text-red-800">Hex Value</h1>
              <h1 className="text-sm font-semibold text-red-800">Action</h1>
              {colors.map((color, index) => (
                <>
                  <div
                    key={index}
                    style={{ backgroundColor: color }}
                    className="m-auto col-span-1 w-8 h-8 rounded-full border"
                  ></div>
                  <p key={index + 10} className="m-auto col-span-1">
                    {color}
                  </p>
                  <button
                    key={index + 20}
                    onClick={() =>
                      setColors((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="px-3 py-2 bg-red-100 text-red-800 rounded-lg"
                  >
                    Remove Color
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
              className="w-full ring-1 disabled:ring-gray-400 ring-red-800"
              placeholder="Enter description here"
              rows="8"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <textarea
              value={privacyPolicy}
              className="mt-2 w-full ring-1 disabled:ring-gray-400 ring-red-800"
              placeholder="Enter privacy policy here"
              onChange={(e) => setPrivacyPolicy(e.target.value)}
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>

      <ConfirmDialog
        message={"Delete this product?"}
        showModal={showDelete}
        // confirm={deleteCategory}
        cancel={() => setShowDelete(false)}
      />
    </div>
  );
};

export default AddProduct;
