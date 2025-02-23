import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchTestCases,
  fetchTestCaseInfo,
  getTestCases,
  RunallTestCases,
  RunSelectedTestCase,
} from "../testService";
import {
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Search,
  TestTubeDiagonal,
  PlusCircle,
  PlayCircle,
  Download,
} from "lucide-react";

import AddTestCaseForm from "./AddTestCaseForm";
import { useProjects } from "../../../Contexts/ProjectContext";
import ProjectsDropdown from "../../../Components/Global/ProjectsDropdown";
import { BeatLoader } from "react-spinners";

// ====================================================
// Table Component - Optimized & Enhanced for Readability
// ====================================================
const Table = () => {
  // =============================
  // UI & Data States
  // =============================
  const [expandedRows, setExpandedRows] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [filters, setFilters] = useState({
    searchEndpoint: "",
    selectedMethod: "",
    selectedTestType: "",
    currentPage: 1,
    pageSize: 25,
  });
  const [testCaseStats, setTestCaseStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [runningTests, setRunningTests] = useState(false);
  const [selectedTestCaseIds, setSelectedTestCaseIds] = useState([]);
  const [selectedPayload, setSelectedPayload] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // =============================
  // Context & Refs
  // =============================
  const { projects, selectedProject, setSelectedProject } = useProjects();
  const abortControllerRef = useRef(null);
  const prevSelectedProjectRef = useRef("");

  // =============================
  // Utility Functions
  // =============================
  const abortPreviousRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
  };

  // =============================
  // Computed Values (useMemo)
  // =============================
  const filteredPaths = useMemo(() => {
    if (!filters.searchEndpoint) return [];
    return (
      testCaseStats?.paths?.filter((path) =>
        path.toLowerCase().includes(filters.searchEndpoint.toLowerCase())
      ) || []
    );
  }, [filters.searchEndpoint, testCaseStats]);

  const filteredData = useMemo(() => {
    return testCases?.data?.filter((row) => {
      const matchesEndpoint = row.endpoint
        .toLowerCase()
        .includes(filters.searchEndpoint.toLowerCase());
      const matchesMethod =
        !filters.selectedMethod || row.method === filters.selectedMethod;
      const matchesTestType =
        !filters.selectedTestType ||
        row.testCases.some((tc) => tc.type === filters.selectedTestType);
      return matchesEndpoint && matchesMethod && matchesTestType;
    });
  }, [
    filters.searchEndpoint,
    filters.selectedMethod,
    filters.selectedTestType,
    testCases,
  ]);

  const stats = useMemo(() => {
    const methodCounts = testCaseStats?.methods?.reduce((acc, method) => {
      acc[method] = filteredData?.filter((row) => row.method === method).length;
      return acc;
    }, {});
    return {
      total: filteredData?.length,
      filtered: filteredData?.length,
      methods: methodCounts,
    };
  }, [filteredData, testCaseStats]);

  const allTestCaseIds = useMemo(() => {
    return testCases?.data?.flatMap((row) => row.testCases.map((tc) => tc.id));
  }, [testCases]);

  const isSelectAll = useMemo(() => {
    return (
      allTestCaseIds?.length > 0 &&
      allTestCaseIds?.every((id) => selectedTestCaseIds.includes(id))
    );
  }, [allTestCaseIds, selectedTestCaseIds]);

  // =============================
  // Data Fetching (useEffect)
  // =============================
  useEffect(() => {
    const fetchData = async () => {
      const projectName = localStorage.getItem("selectedProject");
      setSelectedProject(projectName);
      if (!selectedProject) return;

      abortPreviousRequest();
      setLoading(true);
      try {
        // Refresh test case info if project changed
        if (prevSelectedProjectRef.current !== selectedProject) {
          const testCaseInfo = await fetchTestCaseInfo(selectedProject, {
            signal: abortControllerRef.current.signal,
          });
          setTestCaseStats(testCaseInfo);
          prevSelectedProjectRef.current = selectedProject;
        }

        const data = await fetchTestCases(
          selectedProject,
          filters.currentPage,
          filters.pageSize,
          filters.selectedMethod,
          filters.selectedTestType,
          filters.searchEndpoint,
          { signal: abortControllerRef.current.signal }
        );
        setTestCases(data || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error initializing test data", error);
          toast.error("Failed to fetch test data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedProject, filters, setSelectedProject]);

  // =============================
  // Event Handlers
  // =============================
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, currentPage: 1 }));
    setTestCases([]); // Clear current list to show loader if needed
  };

  const handleSelectPath = (path) => {
    handleFilterChange("searchEndpoint", path);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, currentPage: newPage }));
    setTestCases([]);
  };

  const handleProjectChange = (e) => {
    const project = e.target.value;
    setSelectedProject(project);
    localStorage.setItem("selectedProject", project);
    setFilters({
      searchEndpoint: "",
      selectedMethod: "",
      selectedTestType: "",
      currentPage: 1,
      pageSize: 25,
    });
    setTestCaseStats({});
    setTestCases([]);
    setSelectedTestCaseIds([]);
  };

  const handleRunTestCases = async () => {
    try {
      setRunningTests(true);
      if (selectedProject && selectedTestCaseIds.length === 0) {
        await RunallTestCases(selectedProject);
      } else {
        await RunSelectedTestCase(selectedProject, selectedTestCaseIds);
      }
    } catch (error) {
      console.error("Error running test cases", error);
      toast.error("Failed to run test cases. Please try again.");
    } finally {
      setRunningTests(false);
    }
  };

  const downloadAllTestCases = async () => {
    if (!selectedProject) {
      toast.success("Please select a project first.", {
        autoClose: 4000,
        theme: "light",
      });
      return;
    }

    try {
      let allTestCases = [];
      let current = 1;
      let total = 1;
      do {
        const data = await getTestCases(selectedProject, 0, 0);
        allTestCases = allTestCases.concat(data.testCases || []);
        total = data.totalPages || 1;
        current++;
      } while (current <= total);

      if (allTestCases.length === 0) {
        toast.warn("No test cases found for the selected project.", {
          autoClose: 4000,
          theme: "light",
        });
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(allTestCases);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "TestCases");
      XLSX.writeFile(workbook, `TestCases_${selectedProject}.xlsx`);

      toast.success("All test cases downloaded successfully.", {
        autoClose: 4000,
        theme: "light",
      });
    } catch (error) {
      console.error("Error downloading all test cases:", error);
      toast.error("An error occurred while downloading the test cases.", {
        autoClose: 4000,
        theme: "light",
      });
    }
  };

  const toggleRow = (rowId) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: "bg-blue-100 text-blue-800 border-blue-200",
      POST: "bg-green-100 text-green-800 border-green-200",
      PUT: "bg-yellow-100 text-yellow-800 border-yellow-200",
      DELETE: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[method] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    return status === "Passed" ? (
      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-500" />
    );
  };

  const handleSelectTestCase = (id) => {
    setSelectedTestCaseIds((prev) =>
      prev.includes(id)
        ? prev.filter((testCaseId) => testCaseId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllTestCases = (checked, testCases) => {
    if (checked) {
      const newSelectedIds = testCases.map((testCase) => testCase.id);
      setSelectedTestCaseIds((prev) =>
        Array.from(new Set([...prev, ...newSelectedIds]))
      );
    } else {
      const newSelectedIds = testCases.map((testCase) => testCase.id);
      setSelectedTestCaseIds((prev) =>
        prev.filter((id) => !newSelectedIds.includes(id))
      );
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTestCaseIds(allTestCaseIds);
    } else {
      setSelectedTestCaseIds([]);
    }
  };

  // =============================
  // Render JSX
  // =============================
  return (
    <div className="w-full overflow-hidden rounded-xl shadow-lg border border-gray-200">
      {/* Running tests modal */}
      {runningTests && (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-lg shadow-2xl transform scale-95 hover:scale-100 transition-transform duration-300 ease-out w-96 h-96 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full border-t-4 border-b-4 border-transparent border-t-blue-500 border-b-green-500 animate-spin mb-6"></div>
            <p className="text-2xl font-extrabold text-gray-700 text-center leading-relaxed">
              Your test cases are running at warp speed!
            </p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-10 py-8">
        <div className="">
          <div className="flex items-center justify-between mb-6">
            {/* Left Section: Title, Count, and Project Dropdown */}
            <div className="flex flex-col">
              {/* Title and Total Count */}
              <div className="flex items-center space-x-3 mb-4">
                <TestTubeDiagonal className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold text-white">
                  Generated Test Cases
                </h2>
                {selectedProject && (
                  <div className="relative group ml-5">
                    <div className="w-20 h-12 bg-white/10 rounded-full flex flex-col justify-center items-center shadow-sm">
                      <span className="text-white font-bold text-2xl">
                        {testCaseStats.totalTestCasesCount}
                      </span>
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 ml-2 w-max bg-gray-800 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                      Total Test Cases
                    </div>
                  </div>
                )}
              </div>

              {/* Projects Dropdown (left-aligned) */}
              <div className="flex items-center ml-12">
                <ProjectsDropdown
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onProjectChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    setSelectedProject(e.target.value);
                  }}
                  variant="testcasetableVariant"
                />
              </div>
            </div>

            {/* Right Section: Buttons */}
            <div className="flex items-center space-x-4 ">
              {selectedProject && (
                <div className="flex items-center space-x-4 space-y-12">
                  {/* Add Test Case Button */}
                  <button
                    className="flex items-center justify-center gap-2 
                       bg-blue-200 hover:bg-blue-300 text-blue-900 
                       font-semibold py-2 px-8 rounded-lg shadow-md 
                       transition-all duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       min-w-[160px]"
                    onClick={() => setShowFormPopup(true)}
                    disabled={!selectedProject}
                  >
                    <PlusCircle className="w-6 h-6" />
                    Add Test Case
                  </button>

                  {/* Run Test Cases Button */}
                  <button
                    className="flex items-center justify-center gap-2 
                       bg-green-200 hover:bg-green-300 text-green-900 
                       font-semibold py-2 px-8 rounded-lg shadow-md 
                       transition-all duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       min-w-[160px]"
                    onClick={handleRunTestCases}
                    disabled={runningTests || !selectedProject}
                  >
                    <PlayCircle className="w-6 h-6" />
                    {runningTests
                      ? "Running..."
                      : selectedTestCaseIds.length === 0
                      ? "Run All Test Cases"
                      : `Run (${selectedTestCaseIds.length}) Test Cases`}
                  </button>

                  {/* Download Button */}
                  <div className="relative group space-y-12 space-x-2">
                    <button
                      className="flex items-center justify-center 
                         bg-indigo-200 hover:bg-indigo-300 text-indigo-900 
                         font-semibold p-3 rounded-full shadow-md 
                         transition-all duration-300 
                         disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={downloadAllTestCases}
                      disabled={!selectedProject}
                    >
                      <Download className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                      Download All Test Cases
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="grid grid-cols-3 gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search endpoints..."
              value={filters.searchEndpoint}
              onChange={(e) =>
                handleFilterChange("searchEndpoint", e.target.value)
              }
              className="w-full h-12 bg-white/10 border border-blue-400/20 rounded-xl pl-12 pr-4 text-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            {filteredPaths.length > 0 && (
              <ul className="absolute z-10 w-full bg-white/10 rounded-xl mt-1 shadow-lg">
                {filteredPaths.map((path) => (
                  <li
                    key={path}
                    onClick={() => handleSelectPath(path)}
                    className="p-2 bg-white hover:bg-blue-500 hover:text-white cursor-pointer"
                  >
                    {path}
                  </li>
                ))}
              </ul>
            )}
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-blue-300" />
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="px-2 py-1 bg-white/10 rounded-lg backdrop-blur-sm mt-4 pl-4">
                <span className="text-white font-medium text-sm">
                  {testCaseStats.totalEndpointsCount}
                </span>
                <span className="text-blue-100 ml-2">Total Endpoints</span>
              </div>
              <div className="px-2 py-1 bg-white/10 rounded-lg backdrop-blur-sm mt-4 pl-4">
                <span className="text-white font-medium text-sm"></span>
                <span className="text-blue-100 ml-2">Searched</span>
              </div>
            </div>
          </div>
          <div>
            <select
              value={filters.selectedMethod}
              onChange={(e) =>
                handleFilterChange("selectedMethod", e.target.value)
              }
              className="h-12 bg-white/10 border border-blue-400/20 w-full rounded-xl px-4 text-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="" disabled>
                {testCaseStats?.methods?.length > 0
                  ? "Choose a Method"
                  : "No Methods available"}
              </option>
              {testCaseStats?.methods?.map((method) => (
                <option key={method} value={method} className="text-black">
                  {method}
                </option>
              ))}
            </select>
            <div>
              <div className="flex items-center space-x-2 mt-4">
                {testCaseStats?.methods?.map((method) => (
                  <div
                    key={method}
                    className={`px-2 py-1 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                      testCaseStats.totalMethodCounts?.[method] > 0
                        ? "bg-white/15 text-white"
                        : "bg-white/5 text-cyan-200"
                    }`}
                  >
                    <span className="text-sm font-semibold">
                      {method}-{testCaseStats.totalMethodCounts?.[method] ?? 0}
                      <span className="text-sm text-white/70 font-bold ml-1">
                        ({stats?.methods?.[method] ?? 0})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <select
            value={filters.selectedTestType}
            onChange={(e) =>
              handleFilterChange("selectedTestType", e.target.value)
            }
            className="h-12 bg-white/10 border border-blue-400/20 rounded-xl px-4 text-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="" disabled>
              {testCaseStats?.methods?.length > 0
                ? "Choose a Test Type"
                : "No Test types available"}
            </option>
            {testCaseStats?.testTypes?.map((type) => (
              <option key={type} value={type} className="text-black">
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Test Cases Table */}
      {selectedProject && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-8 py-4 text-left text-sm font-semibold uppercase text-gray-800">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-blue-200 focus:ring-2 transition-all duration-300"
                    checked={isSelectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="px-6 py-4 text-left w-16"></th>
                <th className="px-6 py-4 text-left text-base font-semibold uppercase text-gray-800">
                  Endpoint
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold uppercase text-gray-800">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold uppercase text-gray-800">
                  Test Count
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold uppercase text-gray-800">
                  Last Generated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {testCases?.data?.map((row) => (
                <React.Fragment key={row.id}>
                  <tr
                    className={`transition-colors ${
                      hoveredRow === row.id ? "bg-gray-50" : "bg-white"
                    }`}
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-blue-200 focus:ring-2 transition-all duration-300"
                          onChange={(e) =>
                            handleSelectAllTestCases(
                              e.target.checked,
                              row.testCases
                            )
                          }
                          checked={row.testCases.every((testCase) =>
                            selectedTestCaseIds.includes(testCase.id)
                          )}
                        />
                      </div>
                    </td>
                    <td className="px-0 py-4">
                      <button
                        onClick={() => toggleRow(row.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          hoveredRow === row.id
                            ? "bg-gray-200"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {expandedRows.includes(row.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-800" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-800" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-base font-semibold text-gray-900">
                          {row.endpoint}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-2 rounded-lg text-sm font-medium border ${getMethodColor(
                          row.method
                        )}`}
                      >
                        {row.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-base text-gray-800">
                      {row.testCount}
                    </td>
                    <td className="px-6 py-4 text-base text-gray-800">
                      {row.lastRun}
                    </td>
                  </tr>
                  {expandedRows.includes(row.id) && (
                    <tr>
                      <td colSpan={6} className="px-8 py-6 bg-gray-50">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-white">
                                Test Cases
                              </h3>
                              <span className="text-sm text-gray-100">
                                {row.testCases.length}
                              </span>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                                    <input
                                      type="checkbox"
                                      onChange={(e) =>
                                        handleSelectAllTestCases(
                                          e.target.checked,
                                          row.testCases
                                        )
                                      }
                                      checked={row.testCases.every((testCase) =>
                                        selectedTestCaseIds.includes(
                                          testCase.id
                                        )
                                      )}
                                      className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-blue-200 focus:ring-2 transition-all duration-300"
                                    />
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                                    ID
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                                    Name
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                                    Request URL
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                                    Payload
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                                    Response
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                                    Type
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                                    Steps
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.testCases.map((testCase) => (
                                  <tr
                                    key={testCase.id}
                                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                                  >
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                      <input
                                        type="checkbox"
                                        checked={selectedTestCaseIds.includes(
                                          testCase.id
                                        )}
                                        onChange={() =>
                                          handleSelectTestCase(testCase.id)
                                        }
                                        className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-blue-200 focus:ring-2 transition-all duration-300"
                                      />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                      {testCase.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                      {testCase.name}
                                    </td>
                                    <td className="px-6 py-4">
                                      <button
                                        onClick={() =>
                                          setSelectedPayload(
                                            testCase.requesturl
                                          )
                                        }
                                        className="text-blue-600 text-sm underline hover:text-blue-800"
                                      >
                                        View URL
                                      </button>
                                    </td>
                                    <td className="px-6 py-4">
                                      <button
                                        onClick={() =>
                                          setSelectedPayload(testCase.payload)
                                        }
                                        className="text-blue-600 text-sm underline hover:text-blue-800"
                                      >
                                        View Payload
                                      </button>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="px-3 py-1 rounded-lg text-sm font-medium text-gray-700">
                                        {testCase.responsecode}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="text-sm font-medium px-3 py-1 rounded-lg text-gray-700">
                                        {testCase.type}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-700">
                                          {testCase.steps}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Loader / No Data Display */}
      {loading && (
        <div className="flex items-center justify-center h-64 ">
          <BeatLoader color="#444444" />
          {/* <p className="text-sm">Your Test Cases are Loading!</p> */}
        </div>
      )}
      {!selectedProject && (
        <div className="flex items-center justify-center h-64 text-xl text-gray-500">
          Please Select the project !!
        </div>
      )}
      {testCases?.data?.length > 0 && (
        <div className="flex justify-between items-center px-8 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-800">Items per page:</span>
            <select
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  pageSize: Number(e.target.value),
                  currentPage: 1,
                }))
              }
              value={filters.pageSize}
              className="h-8 bg-white border border-gray-300 rounded-lg px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                handlePageChange(Math.max(filters.currentPage - 1, 1))
              }
              disabled={filters.currentPage === 1}
              className="h-8 w-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt;
            </button>
            <span className="text-sm text-gray-800">
              Page {filters.currentPage} of {Number(testCases.totalPages || 0)}
            </span>
            <button
              onClick={() =>
                handlePageChange(
                  Math.min(
                    filters.currentPage + 1,
                    Number(testCases.totalPages || 0)
                  )
                )
              }
              disabled={
                filters.currentPage === Number(testCases.totalPages || 0)
              }
              className="h-8 w-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
      {testCases?.data?.length <= 0 && selectedProject && !loading && (
        <div className="flex justify-center items-center px-8 py-4 bg-gray-50 border-t h-64 border-gray-200">
          No testcases found...
        </div>
      )}

      {/* Selected Payload Modal */}
      {selectedPayload && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
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

      {/* Add Test Case Form Popup */}
      {showFormPopup && (
        <AddTestCaseForm
          selectedProject={selectedProject}
          onClose={() => setShowFormPopup(false)}
          onTestCaseAdded={fetchTestCases}
        />
      )}
    </div>
  );
};

export default Table;
