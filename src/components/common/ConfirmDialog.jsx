import React from "react";

const ConfirmDialog = ({ showModal, confirm, cancel }) => {
  return (
    <div>
      {showModal && (
        <div className="fixed h-screen w-full z-50 bg-black bg-opacity-20 inset-0 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md">
            <p className="mb-4">Are you sure you want to sign out?</p>
            <div className="flex gap-2">
              <button
                onClick={confirm}
                className="bg-red-800 flex-1 text-white py-2 px-4 rounded mr-2"
              >
                Yes
              </button>
              <button
                onClick={cancel}
                className="bg-gray-300 flex-1 text-gray-700 py-2 px-4 rounded"
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
