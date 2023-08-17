import React, { useEffect, useState } from "react";
import LeftSide from "./LeftSide";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useLocation } from "react-router-dom";

const HomeScreen = ({ handleSignOut, user, RightScreen }) => {
  const [menu, setMenu] = useState(false);
  const [adding, setAdding] = useState(false);
  const [isSignOut, setIsSignOut] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (menu) {
      setMenu(false);
    }
  }, [location.pathname]);

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
        className={`rounded-full transition-all duration-300 left-3 p-2 md:hidden absolute z-30 cursor-pointer ${
          menu
            ? "translate-y-5 text-white bg-red-800"
            : "translate-y-[6px] bg-white"
        } ${location.pathname === "/addCategory" || adding ? "hidden" : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-5 w-5"
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
        className={`absolute z-20 md:relative overflow-hidden transition-all duration-300 md:translate-x-0 w-[25%] h-full mr-1 ${
          menu ? "translate-x-0 w-[70%]" : "-translate-x-full"
        }`}
      >
        <LeftSide setIsSignOut={setIsSignOut} handleSignOut={handleSignOut} />
      </div>

      <div className="flex-1 relative">
        <RightScreen user={user} setAdding={setAdding} adding={adding} />
      </div>

      <ConfirmDialog
        confirm={confirmSignOut}
        cancel={cancelSignOut}
        showModal={isSignOut}
        message={"Are you sure you want to sign out?"}
      />
    </div>
  );
};

export default HomeScreen;
