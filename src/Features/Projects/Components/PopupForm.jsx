import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  createProject,
  saveAndGenerateTestCases,
  fetchSwaggerInfo,
  saveAndGenerateTestCasesWithFile,
  createProjectWithFile,
} from "../projectsService";

// import { useLocalStorageState } from "../../../Hooks/useLocalStorageState";
const PopupForm = ({ setShowForm }) => {
  const navigate = useNavigate();

  // Local States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [swaggerInfo, setSwaggerInfo] = useState({
    basePath: null,
    title: null,
    version: null,
  });
  const [inputMode, setInputMode] = useState("swagger"); // 'swagger' or 'json'
  const [jsonFile, setJsonFile] = useState(null);
  const [submitAction, setSubmitAction] = useState(null); // Tracks the action: 'save' or 'saveAndGenerate'
  // const [selectedProject, setSelectedProject] = useLocalStorageState(
  //   null,
  //   "selectedProject"
  // );
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (submitAction === "save") {
      await handleSave();
      // Call the save handler
    } else if (submitAction === "saveAndGenerate") {
      await handleSaveAndGenerate();

      // Call the save and generate handler
    }
  };
  // Swagger Form State
  const [swaggerFormData, setSwaggerFormData] = useState({
    projectName: "",
    swaggerUrl: "",
    swaggerVersion: "",
  });

  // JSON Form State
  // JSON Form State
  const [jsonFormData, setJsonFormData] = useState({
    projectName: "",
    basePath: "",
    swaggerVersion: "",
  });

  const versions = ["v1", "v2", "v3", "v1.0", "v2.0", "v3.0"];

  // Close Popup and Reset State
  const onClose = () => {
    setSwaggerFormData({
      projectName: "",
      swaggerUrl: "",
      swaggerVersion: "",
    });
    setJsonFormData({
      projectName: "",
      basePath: "",
      swaggerVersion: "",
    });
    setSwaggerInfo({ basePath: null, title: null, version: null });
    setIsVerified(false);
    setInputMode("swagger");
    setJsonFile(null);
    setMessage("");
    setShowForm(false);
  };

  // Handle Swagger Form Changes
  const handleSwaggerFormChange = (e) => {
    const { name, value } = e.target;
    setSwaggerFormData((prev) => ({
      ...prev,
      [name]: value || "",
    }));
    console.log("Swagger Form Data", swaggerFormData);
  };

  // Handle JSON Form Changes
  const handleJsonFormChange = (e) => {
    const { name, value } = e.target;
    setJsonFormData((prev) => ({
      ...prev,
      [name]: value || "",
    }));
    console.log("JSON Form Data", jsonFormData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      setJsonFile(file);
      setIsVerified(true);
    } else {
      setJsonFile(null);
      setIsVerified(false);
      toast.error("Please upload a valid JSON file.");
    }
  };

  // const validateForm = () => {
  //   if (inputMode === "swagger") {
  //     if (!swaggerFormData.projectName.trim() || !swaggerFormData.swaggerUrl || !swaggerFormData.swaggerVersion) {
  //       toast.error("Swagger Project Name, URL, and Version are required.");
  //       return false;
  //     }
  //   } else if (inputMode === "json") {
  //     // if (!jsonFormData.projectName.trim() || !jsonFormData.basePath || !jsonFile) {
  //     //   toast.error("JSON Project Name, Base Path, and JSON File are required.");
  //     //   return false;
  //     // }
  //   }
  //   return true;
  // };

  const handleSave = async () => {
    try {
      setMessage("Saving project...");
      setLoading(true);

      if (inputMode === "swagger") {
        await createProject({
          ...swaggerFormData,
        });
        console.log("Swagger Form Data", swaggerFormData);
        // setSelectedProject(swaggerFormData.projectName);
      } else if (inputMode === "json") {
        if (!jsonFile) {
          toast.error("Please upload a valid JSON file.");
          return;
        }

        const formData = new FormData();
        formData.append("ProjectName", jsonFormData.projectName);
        formData.append("BaseUrl", jsonFormData.basePath);
        formData.append("Version", jsonFormData.swaggerVersion);
        formData.append("SwaggerFile", jsonFile);

        await createProjectWithFile(formData);
        // setSelectedProject(jsonFormData.projectName);
        console.log("JSON Form Data with File", jsonFormData);
      }

      toast.success("Project saved successfully!", { autoClose: 4000 });
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error(`Error: ${error.message && "Failed to save project"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndGenerate = async () => {
    try {
      setMessage("Saving project and generating test cases...");
      setLoading(true);

      if (inputMode === "swagger") {
        await saveAndGenerateTestCases({
          ...swaggerFormData,
        });
        // setSelectedProject(swaggerFormData.projectName);
        console.log("Swagger Form Data", swaggerFormData);
      } else if (inputMode === "json") {
        if (!jsonFile) {
          toast.error("Please upload a valid JSON file.");
          return;
        }

        const formData = new FormData();
        formData.append("ProjectName", jsonFormData.projectName);
        formData.append("BaseUrl", jsonFormData.basePath);
        formData.append("Version", jsonFormData.swaggerVersion);
        formData.append("SwaggerFile", jsonFile);

        await saveAndGenerateTestCasesWithFile(formData);
        // setSelectedProject(jsonFormData.projectName);
        console.log("JSON Form Data with File", jsonFormData);
      }

      toast.success("Project and test cases generated successfully!", {
        autoClose: 4000,
      });
      setTimeout(() => {
        onClose();
        navigate("/tests");
      }, 2000);
    } catch (error) {
      console.error("Error generating test cases:", error);
      toast.error(`Error: ${error.message || "Failed to generate test cases"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUrl = async () => {
    if (!swaggerFormData.swaggerUrl || !swaggerFormData.swaggerVersion) {
      setVerifyMessage("Please enter both Swagger URL and Version.");
      return;
    }

    try {
      setVerifyMessage("Verifying...");
      setLoading(true);

      const info = await fetchSwaggerInfo(
        swaggerFormData.swaggerUrl,
        swaggerFormData.swaggerVersion
      );
      if (info.basePath || info.title || info.version) {
        setSwaggerInfo(info);
        setVerifyMessage("Swagger URL is valid!");
        setIsVerified(true);
      } else {
        setVerifyMessage("Invalid Swagger URL. Please check the URL.");
        setIsVerified(false);
      }
    } catch (error) {
      setVerifyMessage("Invalid Swagger URL. Please check the URL.");
      setIsVerified(false);
      console.error("Error verifying Swagger URL:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">
            Create New Project
          </h3>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-800 transition-colors duration-200"
            onClick={onClose}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.293 14.707a1 1 0 010-1.414L8.586 11 6.293 8.707a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414L11.414 11l2.293 2.293a1 1 0 01-1.414 1.414L10 12.414l-2.293 2.293a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <form className="mt-6" onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Project Name
              </label>
              <input
                id="projectName"
                type="text"
                name="projectName"
                value={
                  inputMode === "swagger"
                    ? swaggerFormData.projectName || ""
                    : jsonFormData.projectName || ""
                }
                onChange={
                  inputMode === "swagger"
                    ? handleSwaggerFormChange
                    : handleJsonFormChange
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Enter Project Name"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4 mb-4">
            <label>
              <input
                type="radio"
                value="swagger"
                className="font-semibold"
                checked={inputMode === "swagger"}
                onChange={() => setInputMode("swagger")}
              />
              Swagger URL
            </label>
            <label>
              <input
                type="radio"
                value="json"
                checked={inputMode === "json"}
                onChange={() => setInputMode("json")}
              />
              Upload JSON File
            </label>
          </div>

          {inputMode === "swagger" && (
            <div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-800">
                  Swagger URL
                </label>
                <div className="flex mb-4">
                  <input
                    id="swaggerUrl"
                    type="text"
                    name="swaggerUrl"
                    value={swaggerFormData.swaggerUrl || ""}
                    onChange={(e) => {
                      handleSwaggerFormChange(e);
                      setVerifyMessage("");
                      setSwaggerInfo({
                        basePath: null,
                        title: null,
                        version: null,
                      });
                      setIsVerified(false);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-400 "
                    placeholder="Enter Swagger URL"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyUrl}
                    className="bg-gradient-to-r from-cyan-700 to-cyan-900 text-white px-4 py-2 rounded-r-lg hover:from-cyan-600 hover:to-cyan-700 transition duration-200 font-semibold"
                  >
                    Verify
                  </button>
                </div>
                {verifyMessage && (
                  <p className="mt-2 text-sm text-gray-600">{verifyMessage}</p>
                )}
                {swaggerInfo.title && (
                  <div className="mt-2 text-sm text-gray-700">
                    <p>
                      <strong>Title:</strong> {swaggerInfo.title}
                    </p>
                    <p>
                      <strong>Version:</strong> {swaggerInfo.version}
                    </p>
                    <p>
                      <strong>Base Path:</strong> {swaggerInfo.basePath}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-800">
                  Select Version
                </label>
                <select
                  id="swaggerVersion"
                  name="swaggerVersion"
                  value={swaggerFormData.swaggerVersion || ""}
                  onChange={handleSwaggerFormChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Swagger Version</option>
                  {versions.map((version, index) => (
                    <option key={index} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {/* 
        {inputMode === "json" && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-gray-800 ">
              Base URL
            </label>
              <input
                id="baseurl"
                type="url"
                name="baseurl"
                value={jsonFormData.baseurl || ""}
                onChange={(e) => {
                  handleJsonFormChange(e);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 mb-4"
                placeholder="Enter Base URL"
                required
              /> <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Select Version
              </label>
              <select
                id="swaggerVersion"
                name="swaggerVersion"
                value={swaggerFormData.swaggerVersion || ""}
                onChange={handleSwaggerFormChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Swagger Version</option>
                {versions.map((version, index) => (
                  <option key={index} value={version}>
                    {version}
                  </option>
                ))}
              </select>
            </div>


              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Upload JSON File
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 text-blue-500 mb-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 3v12m0 0l3.5-3.5M12 15l-3.5-3.5" />
                    </svg>
                    <p className="text-sm text-gray-500">Click to upload JSON file</p>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {jsonFile && (
                <p className="mt-2 text-sm text-gray-700">Uploaded File: {jsonFile.name}</p>
              )}
            </div>
          )} */}

          {inputMode === "json" && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Base URL
              </label>
              <input
                id="basePath"
                type="url"
                name="basePath"
                value={jsonFormData.basePath || ""}
                onChange={handleJsonFormChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 mb-4"
                placeholder="Enter Base URL"
                required
              />

              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Select Swagger Version
              </label>
              <select
                id="swaggerVersion"
                name="swaggerVersion"
                value={jsonFormData.swaggerVersion || ""}
                onChange={handleJsonFormChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Swagger Version</option>
                {versions.map((version, index) => (
                  <option key={index} value={version}>
                    {version}
                  </option>
                ))}
              </select>

              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Upload JSON File
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 text-blue-500 mb-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 3v12m0 0l3.5-3.5M12 15l-3.5-3.5" />
                    </svg>
                    <p className="text-sm text-gray-500">
                      Click to upload JSON file
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {jsonFile && (
                <p className="mt-2 text-sm text-gray-700">
                  Uploaded File: {jsonFile.name}
                </p>
              )}
            </div>
          )}

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              disabled={!isVerified}
              onClick={handleSave}
              className={`w-1/3 py-2 rounded-lg font-semibold transition duration-200 ${
                isVerified
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleSaveAndGenerate}
              disabled={!isVerified}
              className={`w-2/3 py-2 rounded-lg font-semibold transition duration-200 ${
                isVerified
                  ? "bg-gradient-to-r from-sky-700 to-teal-800 hover:from-sky-600 hover:to-teal-700 text-white"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Save & Generate Test Cases
            </button>
          </div>

          {message && (
            <p className="mt-4 text-center text-sm font-semibold text-gray-700">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
