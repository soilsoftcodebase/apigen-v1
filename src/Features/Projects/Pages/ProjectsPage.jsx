import { useState } from "react";
import PopupForm from "../components/PopupForm";
import ProjectCard from "../Components/ProjectCards";
import ProjectDetailsModal from "../components/ProjectDetailsModal";
import {
  getAllProjects,
  createProject,
  generateTestCases,
} from "../projectsService";
import { PlusCircle } from "lucide-react";
import Button from "../../../Components/Global/Button";
import { useProjects } from "../../../Contexts/ProjectContext";

const ProjectsPage = () => {

  const{loading,projects,setProjects}=useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    swaggerUrl: "",
    swaggerVersion: "",
  });
  
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateProject = () => {
    setShowForm(true);
  };

  const handleSaveProject = async () => {
    try {
      if (!formData.projectName.trim()) {
        alert("Project name cannot be empty.");
        return;
      }

      const updatedProjects = await getAllProjects();
      const projectExists = updatedProjects.some(
        (project) =>
          project.projectName.trim().toLowerCase() ===
          formData.projectName.trim().toLowerCase()
      );
      if (projectExists) {
        alert(
          "A project with this name already exists. Please choose another name."
        );
        return;
      }

      const saveProjectDto = {
        projectName: formData.projectName.trim(),
        swaggerUrl: formData.swaggerUrl.trim(),
        swaggerVersion: formData.swaggerVersion.trim(),
      };

      const newProject = await createProject(saveProjectDto);
      setProjects([...projects, newProject]);
      setShowForm(false);
      setFormData({
        projectName: "",
        swaggerUrl: "",
        swaggerVersion: "",
      });
      alert(`Project '${formData.projectName}' created successfully.`);
    } catch (error) {
      alert(`Error creating project: ${error.message}`);
      console.error("Error creating project:", error);
    }
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
            key={project.projectId || project.projectName}
            project={project}
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
