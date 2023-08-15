import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-red-800"></div>
    </div>
  );
};

export default Loader;
