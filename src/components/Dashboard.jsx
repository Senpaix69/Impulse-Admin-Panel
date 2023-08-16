import React from "react";
import bg from "../assets/images/background.jpg";

const Dashboard = ({ user }) => {
  return (
    <div className="h-full p-8 z-10 relative bg-gray-100">
      <div className="h-56 absolute inset-0 -z-10 overflow-hidden ">
        <img src={bg} alt="background" />
      </div>
      <div className="bg-white m-auto p-4 rounded-md flex flex-col mt-[10%]">
        <img
          className="m-auto rounded-full p-[1.4px] h-24 w-24 border-2 border-red-800"
          src={user.downloadableProfileUrl}
          alt="profileImg"
        />
        <div className="mt-4 text-center">
          <h1 className="font-bold text-red-800">{user.name}</h1>
          <h1 className="text-sm">{user.email}</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
