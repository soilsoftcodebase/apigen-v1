

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
  const [deleteProject, setDeleteProject] = useState(null); // For delete confirmation popup
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false); // State for button loading

  
  const handleDelete = async () => {
    setDeleteLoading(true); // Start the loader
    try {
      if (deleteProject) {
        const isDeleted = await deleteProjectById(deleteProject.projectId);
        if (isDeleted) {
          setProjects((prevProjects) =>
            prevProjects.filter(
              (project) => project.projectId !== deleteProject.projectId
            )
          );
          setPopupVisible(false);
          setDeleteProject(null); // Reset after delete
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

  const openDeletePopup = (project) => {
    setDeleteProject(project);
    setPopupVisible(true);
  };

  const closeDeletePopup = () => {
    setDeleteProject(null);
    setPopupVisible(false);
  };

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

  const handleCreateProject = () => {
    setShowForm(true);
  };

  const handleCardClick = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const handleGenerateTestCases = async (projectName) => {
    try {
      await generateTestCases(projectName);
      alert(`Test cases generated successfully for project: ${projectName}`);
    } catch (error) {
      alert(`Error generating test cases: ${error.message}`);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-20 py-10">
    {/* Header Section */}
    <header className="mt-12 mb-6">
      <h1 className="text-3xl font-bold text-gray-700 animate-fade-in flex items-center justify-start">
        Projects Dashboard
      </h1>
      <div className="w-full h-px bg-gray-300 my-6" />
    </header>

    {/* Popup Form */}
    {showForm && (
      <PopupForm
        showForm={showForm}
        setShowForm={setShowForm}
        formData={formData}
        handleFormChange={handleFormChange}
        handleSaveProject={handleSaveProject}
      />
    )}

    <div className="flex justify-between items-center mb-10">
      <h2 className="text-lg font-semibold text-gray-500 ml-2">
        Your Saved Projects
      </h2>
      <button
          className="ml-72 bg-green-600 text-xl font-bold text-white px-8 py-3 rounded shadow-lg hover:bg-green-700 focus:outline-none transition duration-300 transform hover:-translate-y-1"
          onClick={handleCreateProject}
        >
          <span className="mr-2 ">+</span> Create Project
        </button>
      </div>

      {loading && <p>Loading projects...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.projectId || project.projectName}
            className="bg-white p-6 pr-16 rounded-xl shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition duration-300 cursor-pointer  overflow-hidden"
            onClick={() => handleCardClick(project)}
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

            {/* Project Name and Version */}
            <div className="mb-4">
              <h3
                className="text-lg font-semibold text-blue-700 overflow-hidden text-ellipsis"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2, // Max of 2 lines
                  overflow: "hidden",
                  paddingRight: "2.5rem", // Ensures space for delete button
                }}
              >
                {project.projectName}
              </h3>
              <div className="text-sm text-gray-600 mt-2 flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  Swagger {project.swaggerVersion}
                </span>
              </div>
            </div>

            {/* Swagger URL */}
            <p
              className="text-gray-700 mb-2 text-ellipsis"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2, // Max of 2 lines
                overflow: "hidden",
                paddingRight: "2.5rem", // Ensures space for delete button
              }}
            >
              <strong>Swagger URL:</strong> {project.swaggerUrl}
            </p>

            {/* Active Project Indicator */}
            <p className="text-gray-600 mt-2 flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Active Project
            </p>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-0"
          onClick={closeModal}
          style={{ 
            backgroundColor: "rgba(0, 0, 0, 0.2)", 
            backdropFilter: "blur(5px)" 
          }}>
          <div
            className="bg-white w-3/4 max-w-lg p-6 rounded shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* <h2 className="text-lg font-bold mb-4">
              {selectedProject.projectName}
            </h2> */}
            <h3
              className="text-lg font-bold text-blue-700 mb-10"
              style={{
                wordWrap: "break-word", // Ensures long text wraps
                wordBreak: "break-word", // Adds compatibility
                maxWidth: "100%", // Ensures it fits within the card
              }}
            >
              {selectedProject.projectName}
            </h3>
            <div className="flex items-center text-sm text-gray-600  mb-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full ">
                Swagger {selectedProject.swaggerVersion}
              </span>
            </div>
            <p className="text-gray-700 mb-2">
              <strong>Swagger URL:</strong> {selectedProject.swaggerUrl}
            </p>
            <div className="flex justify-between">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() =>
                  handleGenerateTestCases(selectedProject.projectName)
                }
              >
                Generate Test Cases
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

{isPopupVisible && (
  <div
    className="fixed inset-0 flex items-center justify-center bg-opacity-10 z-50"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.01)" ,backdropFilter: "blur(2.5px)" }}
  >
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
          className={`px-4 py-2 rounded text-white flex items-center justify-center ${
            deleteLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
          onClick={handleDelete}
          disabled={deleteLoading}
        >
          {deleteLoading ? "Deleting..." : "Confirm"}
      
                {/* {deleteLoading ? (
    <div className="w-5 h-5 border-2 border-t-2 border-gray-200 rounded-full animate-spin"></div>
  ) : (
    'Delete'
  )} */}
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
