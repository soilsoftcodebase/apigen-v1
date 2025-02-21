/* eslint-disable react/prop-types */
const ProjectsDropdown = ({ projects, selectProjectName, onProjectChange }) => {
  return (
    <div className="relative inline-block w-full sm:w-auto max-w-[300px]">
      {/* {!selectProjectName && (
        <div className="mb-1">
          <span className="text-sm text-blue-600 font-semibold animate-pulse">
            Let's get started! Please select a project.
          </span>
        </div>
      )} */}
      <select
        id="project-select"
        name="project"
        value={selectProjectName || ""}
        onChange={onProjectChange}
        className="appearance-none w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out shadow-sm"
      >
        <option value="" disabled>
          {projects.length > 0 ? "Choose a project" : "No projects available"}
        </option>
        {projects.map((project, index) => (
          <option key={project.id || index} value={project.id}>
            {project.projectName}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ">
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
