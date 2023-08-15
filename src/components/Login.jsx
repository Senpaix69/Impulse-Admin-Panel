import React from "react";
import bg from "../assets/images/background.jpg";
import appLogo from "../assets/images/app_logo.png";

const Login = ({ handleSignIn }) => {
  return (
    <div className="m-auto h-full shadow-sm rounded-sm flex flex-col bg-gray-100">
      <div className="h-56 overflow-hidden relative z-10 flex flex-col md:flex-row items-center md:items-end">
        <img
          className="w-full absolute inset-0 -z-10"
          src={bg}
          alt="background"
        />
        <div className="md:m-4 mt-20 h-24 w-24 bg-white flex items-center content-center rounded-lg">
          <img src={appLogo} alt="appLogo" />
        </div>
        <h1 className="md:my-4 font-bold text-lg md:text-xl text-white">
          Impulse
        </h1>
      </div>
      <div className="flex items-center justify-center flex-1">
        <button
          onClick={handleSignIn}
          className="px-6 py-2 bg-red-800 rounded-md text-white"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
