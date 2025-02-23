import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-800 transition duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
