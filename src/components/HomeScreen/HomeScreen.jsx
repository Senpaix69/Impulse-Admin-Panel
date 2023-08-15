import React, { useEffect, useState } from "react";
import LeftSide from "./LeftSide";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useLocation } from "react-router-dom";

const HomeScreen = ({ handleSignOut, user, RightScreen }) => {
  const [menu, setMenu] = useState(false);
  const [isSignOut, setIsSignOut] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (menu) {
      setMenu(false);
    }
  }, [location]);

  const confirmSignOut = () => {
    setIsSignOut(false);
    handleSignOut();
  };

  const cancelSignOut = () => {
    setIsSignOut(false);
  };

  return (
    <div className="flex h-screen w-full relative">
      {menu && (
        <div
          onClick={() => setMenu(false)}
          className="fixed h-screen w-full z-20 bg-black bg-opacity-20 inset-0"
        ></div>
      )}
      <div
        onClick={() => setMenu(!menu)}
        className={`bg-white rounded-full transition-all duration-300 left-3 p-2 md:hidden absolute z-30 cursor-pointer ${
          menu ? "translate-y-5" : "translate-y-[4px]"
        }`}
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
        <LeftSide setIsSignOut={setIsSignOut} handleSignOut={handleSignOut} />
      </div>

      <div className="flex-1 relative">
        <RightScreen user={user} />
      </div>

      <ConfirmDialog
        confirm={confirmSignOut}
        cancel={cancelSignOut}
        showModal={isSignOut}
      />
    </div>
  );
};

export default HomeScreen;
