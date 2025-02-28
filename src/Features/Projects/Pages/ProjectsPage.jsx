import { useState, useEffect } from "react";
import PopupForm from "../components/PopupForm";
import {
  getAllProjects,
  generateTestCases,
  deleteProjectById,
} from "../projectsService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // For project details popup
  const [deleteProject, setDeleteProject] = useState(null); // Track project to delete
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false); // State for button loading

  // Fetch all projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getAllProjects();
        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handles project creation
  const handleCreateProject = () => {
    setShowForm(true);
  };

  // Handles delete confirmation popup
  const openDeletePopup = (project) => {
    setDeleteProject(project);
    setPopupVisible(true);
  };

  const closeDeletePopup = () => {
    setDeleteProject(null);
    setPopupVisible(false);
  };

  // Handles deleting a project
  const handleDelete = async () => {
    setDeleteLoading(true); // Start the loader
    try {
      if (deleteProject) {
        const isDeleted = await deleteProjectById(deleteProject.projectId);
        if (isDeleted) {
          // Remove deleted project from state before closing modal
          setProjects((prevProjects) =>
            prevProjects.filter(
              (project) => project.projectId !== deleteProject.projectId
            )
          );
          setDeleteProject(null);
          setPopupVisible(false);
          toast.success("Project deleted successfully!", {
            autoClose: 4000,
            theme: "light",
          });
        }
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error(err.message || "Failed to delete the project.", {
        autoClose: 4000,
        theme: "light",
      });
    } finally {
      setDeleteLoading(false); // Stop the loader
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-20 py-10">
      <div className="flex justify-between items-center mb-10 mt-40">
        <h1 className="text-2xl font-bold text-gray-700">Projects Dashboard</h1>
        <button
          className="ml-72 bg-green-600 text-xl font-bold text-white px-8 py-3 rounded shadow-lg hover:bg-green-700 focus:outline-none transition duration-300 transform hover:-translate-y-1"
          onClick={handleCreateProject}
        >
          <span className="mr-2">+</span> Create Project
        </button>
      </div>

      {showForm && <PopupForm showForm={showForm} setShowForm={setShowForm} />}

      <div className="text-left mb-8 text-lg font-semibold text-gray-500">
        Your Saved Projects
      </div>

      {loading && <p>Loading projects...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.projectId || project.projectName}
            className="bg-white p-6 pr-16 rounded-xl shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition duration-300 cursor-pointer overflow-hidden relative"
            onClick={() => setSelectedProject(project)}
          >
            {/* Delete Button */}
            <button
              className="absolute top-6 right-6 text-red-400 hover:text-red-700 z-10"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering card click
                openDeletePopup(project);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M9 3h6a1 1 0 0 1 1 1v1h4a1 1 0 1 1 0 2h-1v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7H4a1 1 0 1 1 0-2h4V4a1 1 0 0 1 1-1Zm1 2v1h4V5h-4ZM7 7v12h10V7H7Zm2 3h2v7H9v-7Zm4 0h2v7h-2v-7Z" />
              </svg>
            </button>

            {/* Project Details */}
            <h3 className="text-lg font-semibold text-blue-700 mb-1">
              {project.projectName}
            </h3>
            <div className="text-sm text-gray-600 mb-4">
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                Swagger {project.swaggerVersion}
              </span>
            </div>
            <p className="text-gray-700 mb-2">
              <strong>Swagger URL:</strong> {project.swaggerUrl}
            </p>
            <p className="text-gray-600 mt-2 flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Active Project
            </p>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the project{" "}
              <strong>{deleteProject?.projectName}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={closeDeletePopup}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded text-white ${
                  deleteLoading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
