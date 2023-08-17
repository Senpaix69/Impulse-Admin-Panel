import React from "react";
import appLogo from "../../assets/images/app_logo.png";

const AppLogo = () => {
  return (
    <div className="flex items-center border-b justify-center border-gray-200 pb-4">
      <img
        className="w-12 h-12 rounded-full p-[1.4px] border-2 border-red-800"
        src={appLogo}
        alt="applogo"
      />
      <p className="ml-2 text-2xl font-bold text-red-800">Impulse</p>
    </div>
  );
};

export default AppLogo;
