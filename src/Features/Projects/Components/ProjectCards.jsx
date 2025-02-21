/* eslint-disable react/prop-types */
import { Folder } from "lucide-react";

const ProjectCard = ({ project, onClick }) => {
  return (
    <div
      className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <Folder className="w-6 h-6 text-blue-500 mr-2" />
        <h3
          className="text-lg font-semibold text-blue-700"
          style={{
            wordWrap: "break-word",
            wordBreak: "break-word",
            maxWidth: "100%",
          }}
        >
          {project.projectName}
        </h3>
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
          Swagger {project.swaggerVersion}
        </span>
      </div>
      <p
        className="text-gray-700 mb-2"
        style={{
          wordWrap: "break-word",
          wordBreak: "break-word",
          maxWidth: "100%",
        }}
      >
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
