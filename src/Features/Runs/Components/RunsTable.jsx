import React, { useState, useCallback, useEffect } from "react";
//import { ClipboardIcon } from "@heroicons/react/20/solid";
import {
  getTestRunsByProject,
  deleteSingleTestRunById,
  deleteAllTestRunsByProjectId,
} from "../runService";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { useProjects } from "../../../Contexts/ProjectContext";
import ProjectsDropdown from "../../../Components/Global/ProjectsDropdown";
import { BeatLoader } from "react-spinners";
import { Delete, DeleteIcon, Download, Trash2 } from "lucide-react";

const RunTestCaseTable = () => {
  const [filteredRunData, setFilteredRunData] = useState([]);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedContent, setExpandedContent] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false); // For delete confirmation popup
  const [showPopup, setShowPopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const {
    projects,
    selectedProject: selectProjectName,
    setSelectedProject: setSelectedProjectName,
  } = useProjects();

  useEffect(() => {
    if (selectProjectName) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await getTestRunsByProject(selectProjectName);
          setFilteredRunData(data || []);
        } catch (error) {
          console.error("Failed to load test cases:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [selectProjectName]); // Added `projects` dependency

  const handleDelete = async (projectId) => {
    setIsDeleting(true); // Indicate deletion is in progress
    try {
      console.log(projectId);
      // Uncomment the actual deletion API call
      await deleteAllTestRunsByProjectId(projectId);

      toast.success("All Test Runs deleted successfully!", {
        autoClose: 4000,
        theme: "light",
      });

      // Refresh test case data for the current project
      if (selectedProject) {
        await handleProjectChange({
          target: { value: selectedProject.projectName },
        });
      }
    } catch (err) {
      console.error("Failed to delete test runs:", err);
      toast.error("Failed to delete test runs!", {
        autoClose: 4000,
        theme: "light",
      });
    } finally {
      setIsDeleting(false); // Deletion process is complete
      setShowPopup(false); // Close the popup
    }
  };

  const handleDeleteTestRun = async (testRunId) => {
    if (!testRunId) {
      console.error(testRunId);
      toast.error("No test run selected for deletion!", {
        autoClose: 4000,
        theme: "light",
      });
      return;
    }

    setDeleteLoading(true); // Start the loader

    console.log(testRunId);
    try {
      const isDeleted = await deleteSingleTestRunById(testRunId); // Call API
      if (isDeleted) {
        toast.success("Test Run deleted successfully!", {
          autoClose: 4000,
          theme: "light",
        });
      }
      // if (selectedProject) {
      //   await handleProjectChange({ target: { value: selectedProject.projectName } });
      // }
    } catch (err) {
      console.error("Error deleting Test Run:", err);
      toast.error(err.message || "Failed to delete the Test Run.", {
        autoClose: 4000,
        theme: "light",
      });
    } finally {
      setDeleteLoading(false); // Stop the loader
    }
  };

  const fetchTestCases = useCallback(async (selectProjectName) => {
    if (!selectProjectName) return;
    setLoading(true);
    try {
      const data = await getTestRunsByProject(selectProjectName);
      setFilteredRunData(data || []);
    } catch (error) {
      console.log("Failed to load test cases. Please try again later.", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleProjectChange = async (e) => {
    const projectName = e.target.value; // Get the selected project name from the dropdown
    const project = projects.find((p) => p.projectName === projectName); // Find the corresponding project object
    setSelectedProject(project);
    setSelectedProjectName(projectName);
    localStorage.setItem("selectedProject", projectName);
    // Update the state with the full project object

    if (selectProjectName !== null) {
      setFilteredRunData([]); // Clear filtered data if no project is selected
    } else {
      await fetchTestCases(selectProjectName); // Fetch test cases for the selected project
    }
  };

  const toggleRow = (runId) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [runId]: !prevState[runId],
    }));
  };

  const toggleAllRows = () => {
    const newState = !isAllExpanded;
    setIsAllExpanded(newState);
    const newExpandedState = filteredRunData.reduce((acc, run) => {
      acc[run.testRunId] = newState;
      return acc;
    }, {});
    setExpandedRows(newExpandedState);
  };

  const handleCopy = (text, uniqueId) => {
    navigator.clipboard.writeText(text).then(() => {
      //setCopiedTextId(uniqueId);
      ///setTimeout(() => setCopiedTextId(null), 2000);
    });
  };

  const handleExpandContent = (content) => {
    setExpandedContent(content);
  };

  const closeExpandedContent = () => {
    setExpandedContent(null);
  };

  const truncateText = (text, maxLength = 30) =>
    text && text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  const getStatusStyle = (status) => {
    const statusStyles = {
      passed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      skipped: "bg-blue-100 text-blue-500",
    };
    return statusStyles[status.toLowerCase()] || "bg-white text-gray-800";
  };

  const downloadExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const handleCopyFeedback = (value, id) => {
    handleCopy(value, id);
    // Trigger feedback for the copied value
    toast.success(`Copied to clipboard: ${value}`, {
      // position: toast.POSITION.TOP_RIGHT,
      autoClose: 4000,
      theme: "light",
    });
  };

  const handleDownloadRun = (run) => {
    const formattedData = run.executedTestCases.map((test) => ({
      TestRunId: run.testRunId,
      ProjectName: run.projectName,
      TotalTests: run.totalTests,
      Passed: run.passed,
      Failed: run.failed,
      Blocked: run.blocked,
      Skipped: run.skipped,
      TestCaseId: test.testCaseId,
      TestCaseName: test.testCaseName,
      InputUrl: test.inputUrl,
      Method: test.method,
      Payload: test.payload,
      ActualResponseCode: test.actualResponseCode,
      Response: test.response,
      Status: test.status,
    }));
    downloadExcel(formattedData, `Test_Run_${run.testRunId}`);
  };

  const handleDownloadAll = () => {
    const allData = filteredRunData.flatMap((run) =>
      run.executedTestCases.map((test) => ({
        TestRunId: run.testRunId,
        ProjectName: run.projectName,
        TotalTests: run.totalTests,
        Passed: run.passed,
        Failed: run.failed,
        Blocked: run.blocked,
        Skipped: run.skipped,
        TestCaseId: test.testCaseId,
        TestCaseName: test.testCaseName,
        InputUrl: test.inputUrl,
        Method: test.method,
        Payload: test.payload,
        ActualResponseCode: test.actualResponseCode,
        Response: test.response,
        Status: test.status,
      }))
    );
    downloadExcel(allData, `All_Test_Runs`);
  };

  return (
    <div className="container mx-auto p-6 max-w-full ">
      <h1 className="text-3xl font-bold mb-2 text-start text-sky-800 animate-fade-in ">
        Executed Test Cases
      </h1>
      <p className="text-base text-gray-600">
        Monitor, analyze, and manage your executed test cases effortlessly.
      </p>
      <div className="w-full h-px bg-gray-300 my-6" />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <ProjectsDropdown
          onProjectChange={(e) => {
            handleProjectChange(e);
          }}
        />

        {/* Positioned Button */}
        {filteredRunData.length > 0 && (
          <div className="absolute top-0 right-0 mb-6">
            <button
              className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 mr-5"
              onClick={handleDownloadAll}
            >
              Download All Runs
            </button>
            <button
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700"
              onClick={() => setShowPopup(true)}
            >
              Delete All Runs
            </button>
            <div>
              {showPopup && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Confirm Deletion
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Are you sure you want to delete all test runs? This action
                      cannot be undone.
                    </p>
                    <div className="mt-4 flex justify-end space-x-4">
                      <button
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                        onClick={() => setShowPopup(false)}
                        disabled={isDeleting}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${
                          isDeleting
                            ? "bg-red-400"
                            : "bg-red-600 hover:bg-red-700"
                        } text-white py-2 px-4 rounded-md`}
                        onClick={() => handleDelete(selectedProject.projectId)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Confirm"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className=" flex flex-col items-center space-y-4">
            <BeatLoader />
            {/* <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div> */}
            <p className="text-lg font-bold text-gray-700">
              Loading your previous Test Runs...
            </p>
          </div>
        </div>
      ) : selectProjectName ? (
        filteredRunData.length > 0 ? (
          <div className="rounded-lg shadow min-w-full overflow-hidden">
            <table className="min-w-full table-auto bg-white border-collapse">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-800 text-white border-b border-gray-300">
                <tr>
                  <th className="p-3 text-center border-r border-gray-200 ">
                    <button
                      onClick={toggleAllRows}
                      className="text-white focus:outline-none"
                    >
                      {isAllExpanded ? "Collapse All" : "Expand All"}
                    </button>
                  </th>
                  <th className="p-3 text-center border-r border-gray-200">
                    Run ID
                  </th>
                  <th className="p-3 text-center border-r border-gray-200">
                    Project Name
                  </th>
                  <th className="p-3 text-center border-r border-gray-200">
                    Total Tests
                  </th>
                  <th className="p-3 text-center border-r border-gray-200">
                    Passed
                  </th>
                  <th className="p-3 text-center border-r border-gray-200">
                    Failed
                  </th>
                  <th className="p-3 text-center border-r border-gray-200">
                    Blocked
                  </th>
                  <th className="p-3 text-center border-r border-gray-200">
                    Skipped
                  </th>
                  <th className="p-3 text-center  ">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRunData.map((run) => (
                  <React.Fragment key={run.testRunId}>
                    <tr
                      className={`cursor-pointer ${
                        expandedRows[run.testRunId] ? "bg-blue-50" : "bg-white"
                      } hover:bg-blue-100 border-b border-gray-200`}
                      onClick={() => toggleRow(run.testRunId)}
                    >
                      <td className="p-3 text-center border-r border-gray-200">
                        {expandedRows[run.testRunId] ? "▼" : "▶"}
                      </td>
                      <td className="p-3 text-center font-bold border-r border-gray-200">
                        {run.testRunId}
                      </td>
                      <td className="p-3 text-center font-semibold border-r border-gray-200">
                        {run.projectName}
                      </td>
                      <td className="p-3 text-center font-bold border-r border-gray-200">
                        {run.totalTests}
                      </td>
                      <td className="p-3 text-center font-bold text-green-600 border-r border-gray-200">
                        {run.passed}
                      </td>
                      <td className="p-3 text-center font-bold text-red-600 border-r border-gray-200">
                        {run.failed}
                      </td>
                      <td className="p-3 text-center font-bold  border-r border-gray-200">
                        {run.blocked}
                      </td>
                      <td className="p-3 font-bold text-center text-blue-600">
                        {run.skipped}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center items-center space-x-4">
                          <div className="relative group">
                            <Download
                              className="w-[24px] h-[24px] text-gray-800 dark:text-green-700 mr-5"
                              onClick={() => handleDownloadRun(run)}
                            />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden w-max px-3 py-1 bg-gray-800 text-white text-sm rounded shadow-lg group-hover:block">
                              Download Run
                            </div>
                          </div>
                          <div className="relative group">
                            <Trash2
                              className="w-[24px] h-[24px] text-gray-800 dark:text-red-700 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTestRun(run.testRunId);
                              }}
                            />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden w-max px-3 py-1 bg-gray-800 text-white text-sm rounded shadow-lg group-hover:block">
                              Delete Run
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {expandedRows[run.testRunId] && (
                      <tr key={`${run.testRunId}-expanded`}>
                        <td colSpan="10" className="p-2 bg-gray-50">
                          <div className="overflow-auto  rounded-lg shadow-inner bg-white">
                            <table className="w-full bg-white border border-gray-300">
                              <thead className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                                <tr>
                                  <th className="p-2 text-center border-r border-gray-300">
                                    Test ID
                                  </th>
                                  <th className="p-2 text-center border-r border-gray-300">
                                    Test Case Name
                                  </th>
                                  <th className="p-2 text-center border-r border-gray-300">
                                    Input Request URL
                                  </th>
                                  <th className="p-2 text-center border-r border-gray-300">
                                    Method
                                  </th>
                                  <th className="p-2 text-center border-r border-gray-300">
                                    Payload
                                  </th>
                                  <th className="p-2 text-center border-r border-gray-300">
                                    Response Code
                                  </th>
                                  <th className="p-2 text-center border-r border-gray-300">
                                    Response
                                  </th>

                                  <th className="p-2 text-center">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {run.executedTestCases.map((test) => (
                                  <tr
                                    key={`${run.testRunId}-${test.testCaseId}`}
                                    className={`hover:bg-gray-50 border-b text-black border-gray-300 ${getStatusStyle(
                                      test.status
                                    )}`}
                                  >
                                    {/* Test Case ID */}
                                    <td className="p-2 font-bold text-center border-r border-gray-300">
                                      {test.testCaseId}
                                    </td>

                                    {/* Test Case Name */}
                                    <td className="p-2 font-bold text-center border-r border-gray-300">
                                      {test.testCaseName}
                                    </td>

                                    {/* Input URL */}
                                    <td className="p-2 text-center border-r border-gray-300">
                                      <div className="flex justify-center items-center space-x-2">
                                        <span
                                          onClick={() =>
                                            handleExpandContent(test.inputUrl)
                                          }
                                          className="cursor-pointer hover:underline"
                                          title={test.inputUrl}
                                        >
                                          {truncateText(test.inputUrl)}
                                        </span>
                                        <div
                                          onClick={() =>
                                            handleCopyFeedback(
                                              test.inputUrl,
                                              `${run.testRunId}-${test.testCaseId}-url`
                                            )
                                          }
                                          className="cursor-pointer text-gray-500 hover:text-gray-800"
                                          title="Copy URL"
                                          aria-label="Copy URL"
                                        >
                                          {/* { <ClipboardIcon className="w-4 h-4 inline-block" />} */}
                                        </div>
                                      </div>
                                    </td>

                                    {/* Method */}
                                    <td className="p-2 text-center border-r border-gray-300">
                                      {test.apiMethod}
                                    </td>

                                    {/* Payload */}
                                    <td className="p-2 text-center border-r border-gray-300">
                                      <div className="flex justify-center items-center space-x-2">
                                        <span
                                          onClick={() =>
                                            handleExpandContent(
                                              test.payload || "N/A"
                                            )
                                          }
                                          className="cursor-pointer hover:underline"
                                          title={test.payload || "N/A"}
                                        >
                                          {truncateText(test.payload || "N/A")}
                                        </span>
                                        <div
                                          onClick={() =>
                                            handleCopyFeedback(
                                              test.payload || "N/A",
                                              `${run.testRunId}-${test.testCaseId}-payload`
                                            )
                                          }
                                          className="cursor-pointer text-gray-500 hover:text-gray-800"
                                          title="Copy Payload"
                                          aria-label="Copy Payload"
                                        >
                                          {/* { <ClipboardIcon className="w-4 h-4 inline-block" />} */}
                                        </div>
                                      </div>
                                    </td>

                                    {/* Actual Response Code */}
                                    <td className="p-2 text-center border-r border-gray-300">
                                      {test.actualResponseCode || "N/A"}
                                    </td>

                                    {/* Response Code */}
                                    <td className="p-2 text-center border-r border-gray-300">
                                      {test.response == [] ? (
                                        "N/A"
                                      ) : (
                                        <button
                                          onClick={() =>
                                            handleExpandContent(
                                              test.response || "N/A"
                                            )
                                          }
                                          className="text-blue-600 underline hover:text-blue-800"
                                        >
                                          View Response
                                        </button>
                                      )}
                                    </td>

                                    {/* Status */}
                                    <td className="p-2 text-center font-semibold">
                                      {test.status}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-600 font-bold">
            No Test Runs Found !!
          </div>
        )
      ) : (
        <div className="text-center text-gray-600 font-bold">
          Please Select a Project First !!
        </div>
      )}

      {expandedContent && (
        <div
          id="modal-background"
          className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeExpandedContent}
        >
          <div
            className="bg-white p-6 rounded-lg shadow max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Expanded Content</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-64">
              {expandedContent}
            </pre>
            <div className="flex justify-end items-center mt-4 space-x-4">
              {/* Copy Button */}
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none"
                onClick={() => {
                  navigator.clipboard.writeText(expandedContent);
                  alert("Copied to clipboard!");
                }}
              >
                Copy
              </button>
              {/* Close Button */}
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none"
                onClick={closeExpandedContent}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Payload Modal */}
    </div>
  );
};

export default RunTestCaseTable;
