import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllProjects,
  getTestRunsByProject,
  deleteSingleTestRunById,
  deleteAllTestRunsByProjectId,
} from "../runService";
import { useLocalStorageState } from "../../../hooks/useLocalStorageState";
import ProjectsDropdown from "../../../Components/Global/ProjectsDropdown";
import TestRunTable from "../Components/TestRunTable";
import ExcelDownloadButton from "../Components/ExcelButton";
import GlobalLoader from "../../../Components/Global/Loader";
import { ChevronsUp, ChevronsDown, Download, Trash } from "lucide-react";

const RunTestCaseTable = () => {
  const [filteredRunData, setFilteredRunData] = useState([]);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [copiedTextId, setCopiedTextId] = useState(null);
  const [expandedContent, setExpandedContent] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectProjectName, setSelectedProjectName] = useLocalStorageState(
    localStorage.getItem("selectedProject"),
    "selectedProject"
  );
  const [projects, setProjects] = useState([]);
  const [selectedPayload, setSelectedPayload] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [testRuns, setTestRuns] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch projects
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        setLoading(true);
        const projects = await getAllProjects();
        setProjects(projects || []);
      } catch (error) {
        console.error("Error fetching project names:", error);
        toast.error("Error fetching project names");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, []);

  // Fetch test runs when a project is selected
  useLayoutEffect(() => {
    if (selectProjectName) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await getTestRunsByProject(selectProjectName);
          setFilteredRunData(data || []);
          if (data && data.length > 0) {
            // toast.success("Test Runs loaded successfully!");
          }
        } catch (error) {
          console.error("Failed to load test cases:", error);
          toast.error("Failed to load test cases!");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [selectProjectName]);

  // Delete all test runs for a project
  const handleDelete = async (projectId) => {
    setIsDeleting(true);
    try {
      await deleteAllTestRunsByProjectId(projectId);
      toast.success("All Test Runs deleted successfully!", {
        autoClose: 4000,
        theme: "light",
      });
      if (selectedProject) {
        await handleProjectChange({
          target: { value: selectedProject.id },
        });
      }
    } catch (err) {
      console.error("Failed to delete test runs:", err);
      toast.error("Failed to delete test runs!", {
        autoClose: 4000,
        theme: "light",
      });
    } finally {
      setIsDeleting(false);
      setShowPopup(false);
    }
  };

  // Delete a single test run
  const handleDeleteTestRun = async (testRunId) => {
    if (!testRunId) {
      console.error("No test run selected for deletion");
      toast.error("No test run selected for deletion!", {
        autoClose: 4000,
        theme: "light",
      });
      return;
    }

    try {
      const isDeleted = await deleteSingleTestRunById(testRunId);
      if (isDeleted) {
        setTestRuns((prevTestRuns) =>
          prevTestRuns.filter((run) => run.runId !== testRunId)
        );
        toast.success("Test Run deleted successfully!", {
          autoClose: 4000,
          theme: "light",
        });
      }
    } catch (err) {
      console.error("Error deleting Test Run:", err);
      toast.error(err.message || "Failed to delete the Test Run.", {
        autoClose: 4000,
        theme: "light",
      });
    }
  };

  // Fetch test runs for the selected project
  const fetchTestCases = useCallback(async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await getTestRunsByProject(projectId);
      setFilteredRunData(data || []);
    } catch (error) {
      console.log("Failed to load test cases. Please try again later.", error);
      toast.error("Failed to load test cases. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle project change (uses project id now)
  const handleProjectChange = async (e) => {
    const projectId = e.target.value;
    const project = projects.find((p) => p.id === projectId);
    setSelectedProject(project);
    setSelectedProjectName(projectId);
    setIsFiltering(true);
    if (projectId !== null) {
      setFilteredRunData([]);
      await fetchTestCases(projectId);
    }
    setIsFiltering(false);
  };

  // Toggle a single row (expand/collapse)
  const toggleRow = (runId) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [runId]: !prevState[runId],
    }));
  };

  // Toggle all rows using lucide icons
  const toggleAllRows = () => {
    const newState = !isAllExpanded;
    setIsAllExpanded(newState);
    const newExpandedState = filteredRunData.reduce((acc, run) => {
      acc[run.testRunId] = newState;
      return acc;
    }, {});
    setExpandedRows(newExpandedState);
  };

  // Copy text to clipboard and show toast
  const handleCopy = (text, uniqueId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTextId(uniqueId);
      toast.success(`Copied to clipboard: ${text}`, {
        autoClose: 4000,
        theme: "light",
      });
      setTimeout(() => setCopiedTextId(null), 2000);
    });
  };

  // Expand content modal
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

  // Download a single test run and show toast
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
    const worksheet = window.XLSX.utils.json_to_sheet(formattedData);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    window.XLSX.writeFile(workbook, `Test_Run_${run.testRunId}.xlsx`);
    toast.success("Downloaded run successfully!", {
      autoClose: 4000,
      theme: "light",
    });
  };

  // Get data for all runs
  const getAllData = () => {
    return filteredRunData.flatMap((run) =>
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
  };

  return (
    <div className="container mx-auto p-6 max-w-full">
      <h1 className="text-3xl font-bold text-start mb-2 text-sky-800 animate-fade-in">
        Executed Test Cases
      </h1>
      <p className="text-base text-gray-600">
        Monitor, analyze, and manage your executed test cases effortlessly.
      </p>
      <div className="w-full h-px bg-gray-300 my-6" />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <ProjectsDropdown
          projects={projects}
          selectProjectName={selectProjectName}
          onProjectChange={handleProjectChange}
        />

        {filteredRunData.length > 0 && (
          <div className="flex space-x-4">
            <ExcelDownloadButton
              data={getAllData()}
              filename="All_Test_Runs"
              buttonText={
                <span className="inline-flex items-center gap-1">
                  <Download className="w-5 h-5" /> Download All Runs
                </span>
              }
              className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 flex items-center"
            />
            <button
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 flex items-center gap-2"
              onClick={() => setShowPopup(true)}
            >
              <Trash className="w-5 h-5" /> Delete All Runs
            </button>
          </div>
        )}
      </div>

      {/* <div className="mb-4">
        <button
          onClick={toggleAllRows}
          className="text-white focus:outline-none flex items-center gap-1 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-md transition-all duration-300"
        >
          {isAllExpanded ? (
            <>
              <ChevronsUp className="w-5 h-5" /> Collapse All
            </>
          ) : (
            <>
              <ChevronsDown className="w-5 h-5" /> Expand All
            </>
          )}
        </button>
      </div> */}

      {isFiltering ? (
        <GlobalLoader message="Loading Test Runs..." />
      ) : selectProjectName ? (
        filteredRunData.length > 0 ? (
          <TestRunTable
            filteredRunData={filteredRunData}
            isAllExpanded={isAllExpanded}
            toggleAllRows={toggleAllRows}
            toggleRow={toggleRow}
            expandedRows={expandedRows}
            handleDownloadRun={handleDownloadRun}
            handleDeleteTestRun={handleDeleteTestRun}
            handleCopyFeedback={handleCopy}
            handleExpandContent={handleExpandContent}
            truncateText={truncateText}
            getStatusStyle={getStatusStyle}
            setSelectedPayload={setSelectedPayload}
          />
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

      {/* Deletion Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Deletion
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete all test runs? This action cannot
              be undone.
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
                  isDeleting ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
                } text-white py-2 px-4 rounded-md`}
                onClick={() => handleDelete(selectedProject?.id)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Content Modal */}
      {expandedContent && (
        <div
          id="modal-background"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
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
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none"
                onClick={() => {
                  navigator.clipboard.writeText(expandedContent);
                  toast.success("Copied to clipboard!", {
                    autoClose: 4000,
                    theme: "light",
                  });
                }}
              >
                Copy
              </button>
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
      {selectedPayload && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 overflow-auto hide-scrollbar"
          onClick={() => setSelectedPayload(null)}
        >
          <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-bold mb-4">Details</h3>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {selectedPayload}
            </pre>
            <div className="flex justify-between items-center mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={() => {
                  navigator.clipboard.writeText(selectedPayload);
                  toast.success("Copied to clipboard!", {
                    autoClose: 4000,
                    theme: "light",
                  });
                }}
              >
                Copy
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => setSelectedPayload(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default RunTestCaseTable;
