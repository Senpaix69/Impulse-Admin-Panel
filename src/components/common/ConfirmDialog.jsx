import React from "react";
import AppLogo from "./AppLogo";

const ConfirmDialog = ({ showModal, confirm, cancel, message }) => {
  return (
    <div>
      {showModal && (
        <div className="fixed h-screen w-full z-50 bg-black bg-opacity-30 inset-0 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md min-w-[300px] shadow-md">
            <AppLogo />
            <p className="mb-4">{message}</p>
            <div className="flex gap-2">
              <button
                onClick={confirm}
                className="bg-red-800 flex-1 text-white py-2 px-4 rounded-lg mr-2"
              >
                Yes
              </button>
              <button
                onClick={cancel}
                className="bg-gray-300 flex-1 text-gray-700 py-2 px-4 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmDialog;
