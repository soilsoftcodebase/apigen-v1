/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  addTestCaseToProject,
  getTestcaseData,
} from "../testService"; // Assuming getTestcaseData fetches test cases by project name
import { toast } from "react-toastify";

const AddTestCaseForm = ({ selectedProject, onClose, onTestCaseAdded }) => {
  const [formData, setFormData] = useState({
    testCaseName: "",
    inputRequestUrl: "",
    payload: "",
    expectedResponseCode: "",
    steps: "",
    priority: "",
    testType: "",
    apiEndpointId: "", // API endpoint ID to be populated from the selected test case
    parameters: "", // Single string for parameters (comma-separated values)
  });

  // const [loading, setLoading] = useState(false);
  const [availableUrls, setAvailableUrls] = useState([]); // Stores the available test case URLs for the project

  // Fetch test cases for the selected project when the selectedProject prop changes
  useEffect(() => {
    if (!selectedProject) return; // Do nothing if no project is selected
    const fetchTestCases = async () => {
      //setLoading(true);
      try {
        // Fetch test cases for the selected project
        const response = await getTestcaseData(selectedProject);
        console.log(response);
        setAvailableUrls(response); // Set the available URLs from the API response
      } catch (error) {
        console.error("Error fetching test cases:", error);
        // alert("An error occurred while fetching the test cases.");
        toast.error("An error occurred while fetching the test cases", {
          // position: toast.POSITION.TOP_RIGHT,
          autoClose: 4000,
          theme: "light",
        });
      } finally {
        //setLoading(false);
      }
    };

    fetchTestCases();
  }, [selectedProject]);

  // Handle input changes for all fields
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle URL selection change
  const handleUrlSelect = async (e) => {
    const selectedUrl = e.target.value;
    const selectedTestCase = availableUrls.find(
      (url) => url.inputRequest === selectedUrl
    );

    if (selectedTestCase) {
      // setLoading(true); // Show loading spinner or indication
      try {
        // Populate the form with the selected test case details from the API response
        setFormData({
          ...formData,
          inputRequestUrl: selectedTestCase.inputRequest,
          expectedResponseCode: selectedTestCase.expectedResponseCode,
          payload: selectedTestCase.payload,
          apiEndpointId: selectedTestCase.apiEndpointId, // Set the API endpoint ID
          parameters: selectedTestCase.parameters || "", // Assuming parameters are a single string
        });
      } catch (error) {
        console.error("Error selecting test case data:", error);
        // alert("An error occurred while selecting the test case data.");
        toast.error("An error occurred while selecting the test data!", {
          // position: toast.POSITION.TOP_RIGHT,
          autoClose: 4000,
          theme: "light",
        });
      } finally {
        // setLoading(false); // Hide loading spinner or indication
      }
    }
  };

  // Submit the form and add the test case to the project
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProject) {
      alert("Please select a project first.");
      return;
    }

    try {
      await addTestCaseToProject(selectedProject, formData);
      // toast.success("Test case added successfully!", {
      //   position: "bottom-right",
      // });
      toast.success("Test case added successfully!", {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        theme: "light",
      });

      // alert("Test case added successfully!");
      setFormData({
        testCaseName: "",
        inputRequestUrl: "",
        payload: "",
        expectedResponseCode: "",
        steps: "",
        priority: "",
        testType: "",
        apiEndpointId: "", // Reset API endpoint ID
        parameters: "", // Reset parameters string
      });
      onTestCaseAdded(); // Notify parent to refresh data
      onClose(); // Close the form
    } catch (error) {
      console.error("Error adding test case:", error);
      // alert("An error occurred while adding the test case.");
      toast.error("An error occurred while adding the test case!", {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        theme: "light",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black bg-opacity-50 overflow-none">
      <div className="flex items-center justify-between p-4  border-b rounded-t-lg  border-gray-200 sticky top-0 bg-white z-10  w-[50%]">
        <h3 className="text-xl font-bold text-gray-800">Add New Test Case</h3>
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
      <div className="relative bg-white p-10 pt-0 rounded-b-lg shadow-lg w-full overflow-auto hide-scrollbar max-w-[50%] max-h-[80vh]">
        <form className="mt-6" onSubmit={handleFormSubmit}>
          <div className="grid gap-4 mb-4">
            {/* Input Request URL Dropdown */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Endpoints
              </label>
              <select
                id="inputRequestUrl"
                name="inputRequestUrl"
                value={formData.inputRequestUrl}
                onChange={handleUrlSelect}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select a Enpoint</option>
                {availableUrls.map((url, index) => {
                  // Get the part of the URL after the first "/" and truncate the rest
                  const truncatedUrl = url.inputRequest
                    .split("/")
                    .slice(2)
                    .join("/");
                  return (
                    <option key={index} value={url.inputRequest}>
                      {url.method} - {truncatedUrl}
                      {/* Only show the truncated URL */}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Editable Input Request URL */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Input Request URL
              </label>
              <input
                type="text"
                name="inputRequestUrl"
                value={formData.inputRequestUrl}
                onChange={handleFormChange}
                placeholder="Edit Input Request URL"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            {/* Test Case Name */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Test Case Name
              </label>
              <input
                id="testCaseName"
                type="text"
                name="testCaseName"
                value={formData.testCaseName}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter Test Case Name"
                required
              />
            </div>

            {/* Steps */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Steps
              </label>
              <textarea
                id="steps"
                name="steps"
                value={formData.steps}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none overflow-auto hide-scrollbar"
                placeholder="Describe the test steps"
                required
              />
            </div>

            {/* Test Type */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Test Type
              </label>
              <input
                id="testType"
                type="text"
                name="testType"
                value={formData.testType}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter Test Type"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Priority
              </label>
              <input
                id="priority"
                type="text"
                name="priority"
                value={formData.priority}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter Priority"
                required
              />
            </div>

            {/* Expected Response Code */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Expected Response Code
              </label>
              <input
                id="expectedResponseCode"
                type="text"
                name="expectedResponseCode"
                value={formData.expectedResponseCode}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter Expected Response Code"
                required
              />
            </div>

            {/* Payload */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Payload
              </label>
              <textarea
                id="payload"
                name="payload"
                value={formData.payload}
                onChange={handleFormChange}
                className={`w-full p-4 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 overflow-auto hide-scrollbar ${
                  formData.payload.length > 2 ? "h-[200px]" : "h-10 mt-2 pt-2 "
                }`}
                placeholder="Enter Payload"
                required
              />
            </div>

            {/* Parameters as a single string */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Parameters
              </label>
              <input
                id="parameters"
                type="text"
                name="parameters"
                value={formData.parameters}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter parameters as a comma-separated string"
                disabled
              />
            </div>

            {/* API Endpoint ID (hidden or editable, depending on your use case) */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                API Endpoint ID
              </label>
              <input
                type="text"
                name="apiEndpointId"
                value={formData.apiEndpointId}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                disabled
              />
            </div>
          </div>

          <div className="flex  mt-6">
            <button
              type="button"
              onClick={handleFormSubmit}
              className="w-full outline-none py-2 rounded-lg font-semibold transition duration-200 bg-gradient-to-r from-sky-700 to-teal-800 hover:from-sky-600 hover:to-teal-700 text-white"
            >
              Save Test case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestCaseForm;
