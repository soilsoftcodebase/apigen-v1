import { useState } from "react";
import PopupForm from "../Components/PopupForm";
import ProjectCard from "../Components/ProjectCards";
import ProjectDetailsModal from "../Components/ProjectDetailsModal";
import {
  createProject,
  generateTestCases,
  deleteProjectById,
} from "../projectsService";
import { PlusCircle } from "lucide-react";
import Button from "../../../Components/Global/Button";
import { useProjects } from "../../../Contexts/ProjectContext";
import { toast } from "react-toastify";

const ProjectsPage = () => {
  const { loading, projects, setProjects } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    swaggerUrl: "",
    swaggerVersion: "",
  });

  // Handles input changes
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Opens the project creation form
  const handleCreateProject = () => {
    setShowForm(true);
  };

  // Handles project creation
  const handleSaveProject = async () => {
    try {
      if (!formData.projectName.trim()) {
        toast.error("Project name cannot be empty.");
        return;
      }

      // Check if project name already exists
      const projectExists = projects.some(
        (project) =>
          project.projectName.trim().toLowerCase() ===
          formData.projectName.trim().toLowerCase()
      );
      if (projectExists) {
        toast.error("A project with this name already exists.");
        return;
      }

      const saveProjectDto = {
        projectName: formData.projectName.trim(),
        swaggerUrl: formData.swaggerUrl.trim(),
        swaggerVersion: formData.swaggerVersion.trim(),
      };

      const newProject = await createProject(saveProjectDto);
      setProjects([...projects, newProject]); // Update state
      setShowForm(false);
      setFormData({ projectName: "", swaggerUrl: "", swaggerVersion: "" });

      toast.success(`Project '${formData.projectName}' created successfully.`);
    } catch (error) {
      toast.error(`Error creating project: ${error.message}`);
    }
  };

  // Handles deleting a project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProjectById(projectId);
      setProjects(projects.filter((project) => project.projectId !== projectId)); // Update UI
      toast.success("Project deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete project.");
    }
  };

  // Opens project details modal
  const handleCardClick = (project) => {
    setSelectedProject(project);
  };

  // Closes project details modal
  const closeModal = () => {
    setSelectedProject(null);
  };

  // Handles test case generation
  const handleGenerateTestCases = async (projectName) => {
    try {
      await generateTestCases(projectName);
      toast.success(`Test cases generated successfully for ${projectName}.`);
    } catch (error) {
      toast.error(`Error generating test cases: ${error.message}`);
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
        <Button variant="createProjectButton" onClick={handleCreateProject}>
          <PlusCircle size={24} />
          Create Project
        </Button>
      </div>

      {/* Loading Indicator */}
      {loading && <p>Loading projects...</p>}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.projectId}
            project={project}
            onDelete={handleDeleteProject}
            onClick={() => handleCardClick(project)}
          />
        ))}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={closeModal}
          onGenerateTestCases={handleGenerateTestCases}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
