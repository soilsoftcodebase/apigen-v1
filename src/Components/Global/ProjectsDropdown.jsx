/* eslint-disable react/prop-types */
import { useProjects } from "../../Contexts/ProjectContext";
const ProjectsDropdown = ({
  onProjectChange,
  // Add a variant prop to control styling
  variant = "default",
}) => {
  // Base classes for all variants
  const baseClasses = `
    appearance-none 
    w-full 
    rounded-lg 
    transition-all 
    duration-300 
    ease-in-out 
    shadow-sm
  `;

  // Define multiple variant styles
  const variants = {
    default: `
      p-3 
      border 
      border-gray-300 
      bg-white 
      text-gray-700 
      font-medium 
      focus:outline-none 
      focus:ring-1 
      focus:ring-blue-500
    `,
    testcasetableVariant: `
      h-10 
      bg-white 
      border 
      border-blue-400/20 
      w-full 
      px-4 
      pr-24 
      text-base 
      text-gray-700 
      focus:outline-none 
      focus:ring-2 
      focus:ring-white/30 
      truncate
    `,
  };

  const { projects, selectedProject } = useProjects();
  return (
    <div className="relative inline-block w-full sm:w-auto max-w-[300px]">
      <select
        id="project-select"
        name="project"
        value={selectedProject}
        onChange={onProjectChange}
        // Merge base classes with the chosen variant
        className={`${baseClasses} ${variants[variant]}`}
      >
        <option value="" disabled>
          {projects.length > 0 ? "Choose a project" : "No projects available"}
        </option>
        {projects.map((project, index) => (
          <option key={project.projectId || index} value={project.projectName}>
            {project.projectName}
          </option>
        ))}
      </select>
      {/* Chevron icon (pointer-events-none so it doesn't block clicks) */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default ProjectsDropdown;
