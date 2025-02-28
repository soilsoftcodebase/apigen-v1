/* eslint-disable react/prop-types */

import { X, FileText } from "lucide-react";
import Button from "../../../Components/Global/Button";

const ProjectDetailsModal = ({ project, onClose, onGenerateTestCases }) => {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black/60 bg-opacity-5 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-3/4 max-w-lg p-6 rounded shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <div className="flex items-center mb-4">
          <FileText className="w-6 h-6 text-sky-600 mr-2" />
          <h2 className="text-lg font-bold">{project.projectName}</h2>
        </div>
        <p className="mb-4 text-gray-700">
          <strong>Swagger URL:</strong> {project.swaggerUrl}
        </p>
        <p className="mb-4 text-gray-700">
          <strong>Swagger Version:</strong> {project.swaggerVersion}
        </p>
        <div className="flex justify-between">
          <button
            className="bg-green-400 flex items-center gap-2 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => onGenerateTestCases(project.projectName)}
          >
            <FileText size={16} />
            Generate Test Cases
          </button>
          <button
            className="bg-red-300 flex items-center gap-2 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={onClose}
          >
            <X size={16} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
