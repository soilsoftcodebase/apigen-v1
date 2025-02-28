/* eslint-disable react/prop-types */
import { Folder, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteProjectById } from "../projectsService"; // Ensure this service function exists
import { toast } from "react-toastify";

const ProjectCard = ({ project, onDelete, onClick }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent triggering card click

    if (!window.confirm(`Are you sure you want to delete "${project.projectName}"?`)) return;

    setDeleteLoading(true);
    try {
      await deleteProjectById(project.projectId);
      onDelete(project.projectId); // Notify parent to update UI
      toast.success("Project deleted successfully!", {
        autoClose: 4000,
        theme: "light",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(error.message || "Failed to delete the project.", {
        autoClose: 4000,
        theme: "light",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition duration-300 cursor-pointer relative"
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <Folder className="w-6 h-6 text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold text-blue-700 break-words" style={{ maxWidth: "90%" }}>
          {project.projectName}
        </h3>
      </div>

      {/* DELETE BUTTON (🗑️ Trash Icon) */}
      <button
        className="absolute top-4 right-4 text-red-500 hover:text-red-700 z-10"
        onClick={handleDelete}
        disabled={deleteLoading}
      >
        {deleteLoading ? "Deleting..." : <Trash2 className="w-5 h-5" />}
      </button>

      <div className="text-sm text-gray-600 mb-4">
        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
          Swagger {project.swaggerVersion}
        </span>
      </div>

      <p className="text-gray-700 break-words">
        <strong>Swagger URL:</strong> {project.swaggerUrl}
      </p>

      <p className="text-gray-600 mt-2 flex items-center">
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        Active Project
      </p>
    </div>
  );
};

export default ProjectCard;
