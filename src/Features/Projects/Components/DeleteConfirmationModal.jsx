/* eslint-disable react/prop-types */

const DeleteConfirmationModal = ({
  project,
  isVisible,
  onCancel,
  onConfirm,
  deleteLoading,
}) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Confirm Delete
        </h2>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete the project{" "}
          <strong>{project?.projectName}</strong>?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded text-white flex items-center justify-center ${
              deleteLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
            onClick={onConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
