import React from "react";
import { Link, useLocation } from "react-router-dom";
import AppLogo from "../common/AppLogo";

const LeftSide = ({ setIsSignOut }) => {
  const location = useLocation();

  return (
    <div className="h-full w-full p-2 pt-4 bg-white shadow-md flex flex-col gap-4">
      <AppLogo />

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
    </div>
  );
};

export default LeftSide;
