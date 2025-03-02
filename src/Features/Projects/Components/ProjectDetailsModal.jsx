/* eslint-disable react/prop-types */

const ProjectModal = ({ project, onGenerate, onClose }) => {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-xs z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-3/4 max-w-lg p-6 rounded shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="text-lg font-bold text-blue-700 mb-10"
          style={{
            wordWrap: "break-word",
            wordBreak: "break-word",
            maxWidth: "100%",
          }}
        >
          {project.projectName}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            Swagger {project.swaggerVersion}
          </span>
        </div>
        <p className="text-gray-700 mb-2">
          <strong>Swagger URL:</strong> {project.swaggerUrl}
        </p>
        <div className="flex justify-between">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => onGenerate(project.projectName)}
          >
            Generate Test Cases
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
