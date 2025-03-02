/* eslint-disable react/prop-types */

import { Trash2Icon } from "lucide-react";

const ProjectCard = ({ project, onCardClick, onDelete }) => {
  return (
    <div
      className="bg-white p-6 pr-16 rounded-xl shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition duration-300 cursor-pointer overflow-hidden"
      onClick={() => onCardClick(project)}
    >
      {/* Delete Button with Lucide Trash icon */}
      <button
        className="absolute top-6 right-6 text-red-400 hover:text-red-700 z-10"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering card click
          onDelete(project);
        }}
      >
        <div className="rounded-full p-2 bg-red-100/30 hover:bg-red-100">
          <Trash2Icon className="w-6 h-6" />
        </div>
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
  );
};

export default ProjectCard;
