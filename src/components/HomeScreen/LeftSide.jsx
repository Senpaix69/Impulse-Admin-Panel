import React, { useState } from "react";
import ConfirmDialog from "../common/ConfirmDialog";
import appLogo from "../../assets/images/app_logo.png";
import { Link, useLocation } from "react-router-dom";

const LeftSide = ({ handleSignOut }) => {
  const [isSignOut, setIsSignOut] = useState(false);
  const location = useLocation();

  const confirmSignOut = () => {
    setIsSignOut(false);
    handleSignOut();
  };

  const cancelSignOut = () => {
    setIsSignOut(false);
  };

  return (
    <div className="h-full w-full pt-4 px-2 bg-white shadow-md flex flex-col gap-4">
      <div className="flex items-center border-b justify-center border-gray-200 pb-4">
        <img
          className="w-12 h-12 rounded-full p-[1.4px] border-2 border-red-800"
          src={appLogo}
          alt="applogo"
        />
        <p className="ml-2 text-2xl font-bold text-red-800">Impulse</p>
      </div>

      {/* Tiles */}
      <div className="flex-1 flex flex-col">
        <Link
          className={`p-2 rounded-l-md ${
            location.pathname === "/"
              ? "bg-red-200 text-red-800 border-r-4 border-red-800"
              : ""
          }`}
          to="/"
          replace
        >
          Dashboard
        </Link>
        <Link
          className={`p-2 rounded-l-md ${
            location.pathname === "/category"
              ? "bg-red-200 text-red-800 border-r-4 border-red-800"
              : ""
          }`}
          to="/category"
          replace
        >
          Categories
        </Link>
        <Link
          className={`p-2 rounded-l-md ${
            location.pathname === "/product"
              ? "bg-red-200 text-red-800 border-r-4 border-red-800"
              : ""
          }`}
          to="/product"
          replace
        >
          Products
        </Link>
      </div>

      <button
        onClick={() => setIsSignOut(true)}
        className="px-4 py-2 bg-red-800 rounded-md text-white text-sm"
      >
        Logout
      </button>

      <ConfirmDialog
        confirm={confirmSignOut}
        cancel={cancelSignOut}
        showModal={isSignOut}
      />
    </div>
  );
};

export default LeftSide;
