import React, { useState } from "react";
import LeftSide from "./LeftSide";

const HomeScreen = ({ handleSignOut, user, RightScreen }) => {
  const [menu, setMenu] = useState(false);

  return (
    <div className="flex h-screen w-full relative">
      <div
        onClick={() => setMenu(!menu)}
        className="bg-white rounded-full top-5 left-3 p-2 md:hidden absolute z-30 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </div>
      <div
        className={`absolute overflow-hidden z-20 md:relative transition-all duration-300 md:translate-x-0 w-[25%] h-full mr-1 ${
          menu ? "translate-x-0 w-[70%]" : "-translate-x-full"
        }`}
      >
        <LeftSide handleSignOut={handleSignOut} />
      </div>

      <div className="flex-1">
        <RightScreen user={user} />
      </div>
    </div>
  );
};

export default HomeScreen;
