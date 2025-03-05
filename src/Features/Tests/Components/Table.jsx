import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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

import Loader from "../../../Components/Global/Loader";

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

  // =============================
  // Context & Refs
  // =============================
  const { selectedProject, setSelectedProject } = useProjects();
  const abortControllerRef = useRef(null);
  const prevSelectedProjectRef = useRef("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
  }, [selectedProject, filters]);

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
    // localStorage.setItem("selectedProject", project);
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
  const navigate = useNavigate();
  const handleRunTestCases = async () => {
    try {
      setRunningTests(true);
      if (selectedProject && selectedTestCaseIds.length === 0) {
        await RunallTestCases(selectedProject);
      } else {
        await RunSelectedTestCase(selectedProject, selectedTestCaseIds);
      }
      toast.success("Test cases run successfully!", {
        autoClose: 4000,
        theme: "light",
      });
      navigate("/runs"); // Navigate to the runs page after completion
    } catch (error) {
      console.error("Error running test cases", error);
      toast.error("Failed to run test cases. Please try again.", {
        autoClose: 4000,
        theme: "light",
      });
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
    <div className="w-full overflow-hidden rounded-xl shadow-lg border border-gray-200 relative mt-4">
      {/* Running tests modal */}
      {runningTests && (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white p-10 rounded-lg shadow-2xl transform scale-95 hover:scale-100 transition-transform duration-300 ease-out w-96 h-96 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full border-t-4 border-b-4 border-transparent border-t-blue-500 border-b-green-500 animate-spin mb-6"></div>
            <p className="text-2xl font-extrabold text-gray-700 text-center leading-relaxed">
              Your test cases are running at warp speed!
            </p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 pl-10 pr-10 pt-6 shadow-lg">
        <div className="">
          {/* Main Header Section */}
          <div className="flex items-center justify-between ">
            {/* Left Section: Title, Counts, Methods Breakdown, and Project Dropdown */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center ">
                    {/* Left Section: Title, Total Count, and Export Button */}
                    <div className="flex items-center">
                      <h2 className="text-2xl font-semibold text-white tracking-tight">
                        Generated Test Cases
                      </h2>
                      <div className="flex items-center space-x-4 ml-2 ">
                        {/* Total Test Cases Count */}
                        <div className="bg-white/10 px-3 py-1 rounded-full shadow-md">
                          <span className="text-gray-200 font-bold text-base">
                            Total:{" "}
                            <span className="text-white">
                              {testCaseStats.totalTestCasesCount}
                            </span>
                          </span>
                        </div>

                        {/* Export Button */}
                        <div className="relative group">
                          <button
                            className="relative flex items-center justify-center bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium text-base p-2 rounded-full shadow-md hover:from-gray-700 hover:to-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                            onClick={downloadAllTestCases}
                            disabled={!selectedProject}
                          >
                            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="absolute inset-0 bg-indigo-800 opacity-0 group-hover:opacity-15 transition-opacity duration-300"></span>
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-y-0 w-max bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                            Export Tests in Excel
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Buttons (Pushed to the End) */}
                    {selectedProject && (
                      <div className="flex items-center space-x-3 absolute right-14  ">
                        {/* Create Case Button */}
                        <button
                          className="group relative flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium text-base py-1.5 px-4 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] overflow-hidden"
                          onClick={() => setShowFormPopup(true)}
                          disabled={!selectedProject}
                        >
                          <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          Create Case
                          <span className="absolute inset-0 bg-blue-800 opacity-0 group-hover:opacity-15 transition-opacity duration-300"></span>
                        </button>

                        {/* Execute Tests Button */}
                        <button
                          className="group relative flex items-center justify-center gap-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium text-base py-1.5 px-4 rounded-lg shadow-md hover:from-green-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] overflow-hidden"
                          onClick={handleRunTestCases}
                          disabled={runningTests || !selectedProject}
                        >
                          <PlayCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          {runningTests
                            ? "Executing..."
                            : selectedTestCaseIds.length === 0
                            ? "Execute Tests"
                            : `Execute (${selectedTestCaseIds.length}) Test Cases`}
                          <span className="absolute inset-0 bg-green-800 opacity-0 group-hover:opacity-15 transition-opacity duration-300"></span>
                        </button>

                        {/* Export Tests Button */}
                        {/* <div className="relative group">
                          <button
                            className="relative flex items-center justify-center bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium text-base p-2 rounded-full shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                            onClick={downloadAllTestCases}
                            disabled={!selectedProject}
                          >
                            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="absolute inset-0 bg-indigo-800 opacity-0 group-hover:opacity-15 transition-opacity duration-300"></span>
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                            Export Tests
                          </div>
                        </div> */}
                      </div>
                    )}
                  </div>

                  {/* Project Dropdown with Label */}
                  <div className=" flex items-center space-x-3 mt-4 mb-4 ">
                    <span className="text-gray-300 font-medium text-sm">
                      Select <br /> Project:
                    </span>
                    <ProjectsDropdown
                      onProjectChange={(e) => handleProjectChange(e)}
                      variant="testcasetableVariant"
                      className="bg-gradient-to-r from-gray-700 to-gray-600 text-white border-none rounded-lg shadow-inner focus:ring-2 focus:ring-cyan-400 transition-all w-64"
                    />
                    {selectedProject && (
                      <div className="flex items-center space-x-4 mt-2 flex-wrap gap-2">
                        {/* Total Counts */}

                        <div className="flex items-center bg-cyan-500/10 px-3 py-1 rounded-full shadow-md">
                          <span className="text-cyan-100 font-medium text-sm">
                            Endpoints:{" "}
                            <span className="text-white">
                              {testCaseStats.totalEndpointsCount}
                            </span>
                          </span>
                        </div>
                        {/* Detailed Methods Breakdown */}
                        <div className="flex items-center space-x-2">
                          {["GET", "POST", "PUT", "DELETE"].map((method) => (
                            <div
                              key={method}
                              className={`flex items-center px-2 py-1 rounded-full shadow-md text-xs font-semibold ${
                                testCaseStats.totalMethodCounts?.[method] > 0
                                  ? {
                                      GET: "bg-green-500/20 text-green-100",
                                      POST: "bg-blue-500/20 text-blue-100",
                                      PUT: "bg-yellow-500/20 text-yellow-100",
                                      DELETE: "bg-red-500/20 text-red-100",
                                    }[method]
                                  : "bg-gray-700/50 text-gray-400"
                              }`}
                            >
                              <span>
                                {method}:{" "}
                                <span className="text-white">
                                  {testCaseStats.totalMethodCounts?.[method] ??
                                    0}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col-3 gap-2  mt-2 mb-2">
                    <div className="relative flex items-start ">
                      {filters.searchEndpoint && (
                        <div className="absolute left-84 top-1/2 transform -translate-y-1/2 flex items-center bg-cyan-500/20 px-2 py-1 rounded-md text-cyan-100 text-xs">
                          {filteredPaths.length} Results
                          <button
                            className="ml-2 text-cyan-300 hover:text-cyan-100 transition-colors"
                            onClick={() => {
                              handleFilterChange("searchEndpoint", "");
                              setIsDropdownOpen(false);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <Search className="absolute left-4 top-2.5 w-5 h-5 justify-end text-cyan-400" />
                      <input
                        type="text"
                        placeholder="Search endpoints..."
                        value={filters.searchEndpoint}
                        onChange={(e) => {
                          handleFilterChange("searchEndpoint", e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        className={`w-full h-10 bg-gradient-to-r from-gray-700 to-gray-600 border border-cyan-500/30 rounded-xl pr-46 pl-${
                          filters.searchEndpoint ? "20" : "14"
                        } pr-4 pl-12 text-base text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner transition-all`}
                      />
                    </div>
                    {isDropdownOpen && filteredPaths.length > 0 && (
                      <ul className="absolute z-10 w-1/4 bg-gray-900/95 backdrop-blur-md rounded-xl mt-12 shadow-xl border border-cyan-500/20 overflow-hidden">
                        {filteredPaths.map((path) => (
                          <li
                            key={path}
                            onClick={() => {
                              handleSelectPath(path);
                              setIsDropdownOpen(false);
                            }}
                            className="p-3 text-white hover:bg-cyan-600/20 cursor-pointer transition-colors duration-200"
                          >
                            {path}
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* <div className="mt-2 px-3 py-1 bg-cyan-500/10 rounded-lg shadow-sm flex items-center justify-between">
                      <span className="text-cyan-100 font-medium text-sm">
                        Total Endpoints
                      </span>
                      <span className="text-white font-semibold">
                        {testCaseStats.totalEndpointsCount}
                      </span>
                    </div> */}
                    <div>
                      <div className="relative flex items-start ">
                        {testCaseStats?.methods
                          ?.filter(
                            (method) => (stats?.methods?.[method] ?? 0) > 0
                          )
                          .map((method) => (
                            <div
                              key={method}
                              className={`absolute left-48 top-1/2 transform -translate-y-1/2 flex items-center bg-cyan-500/20 px-2 py-1 rounded-md text-cyan-100 text-xs bg-gradient-to-r ${
                                testCaseStats.totalMethodCounts?.[method] > 0
                                  ? "from-cyan-500/20 to-cyan-600/20 text-white"
                                  : "from-gray-700 to-gray-600 text-cyan-200"
                              } shadow-sm`}
                            >
                              {stats?.methods?.[method]} Results
                              <button
                                className="ml-2 text-cyan-300 hover:text-cyan-100 transition-colors"
                                onClick={() => {
                                  handleFilterChange("searchEndpoint", "");
                                  setIsDropdownOpen(false);
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}

                        <select
                          value={filters.selectedMethod}
                          onChange={(e) =>
                            handleFilterChange("selectedMethod", e.target.value)
                          }
                          className="`w-full h-10 bg-gradient-to-r from-gray-700 to-gray-600 border border-cyan-500/30  rounded-xl pr-36 pl-2  text-base text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner transition-all"
                        >
                          <option value="" disabled className="text-gray-900">
                            {testCaseStats?.methods?.length > 0
                              ? "Choose a Method"
                              : "No Methods available"}
                          </option>
                          {testCaseStats?.methods?.map((method) => (
                            <option
                              key={method}
                              value={method}
                              className="text-gray-900"
                            >
                              {method}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <select
                        value={filters.selectedTestType}
                        onChange={(e) =>
                          handleFilterChange("selectedTestType", e.target.value)
                        }
                        className="w-full h-10 bg-gradient-to-r from-gray-700 to-gray-600 border border-cyan-500/30 rounded-xl pr-10 px-4 text-base text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner transition-all"
                      >
                        <option value="" disabled className="text-gray-900">
                          {testCaseStats?.methods?.length > 0
                            ? "Choose a Test Type"
                            : "No Test types available"}
                        </option>
                        {testCaseStats?.testTypes?.map((type) => (
                          <option
                            key={type}
                            value={type}
                            className="text-gray-900"
                          >
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* <div className="flex items-center space-x-2 mt-2 flex-wrap gap-2">
                      {testCaseStats?.methods?.map((method) => (
                        <div
                          key={method}
                          className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center bg-gradient-to-r ${
                            testCaseStats.totalMethodCounts?.[method] > 0
                              ? "from-cyan-500/20 to-cyan-600/20 text-white"
                              : "from-gray-700 to-gray-600 text-cyan-200"
                          } shadow-sm`}
                        >
                          <span className="text-sm font-semibold">
                            {method}-
                            {testCaseStats.totalMethodCounts?.[method] ?? 0}
                            <span className="text-sm text-white/70 font-bold ml-1">
                              {stats?.methods?.[method] ?? 0}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section Below */}
          {/* {selectedProject && (
            <div className="grid grid-cols-3 gap-6 bg-gray-800/50 p-4 rounded-xl shadow-inner">
              <div className="relative">
                <div className="relative flex items-center">
                  {filters.searchEndpoint && (
                    <div className="absolute left-90 top-1/2 transform -translate-y-1/2 flex items-center bg-cyan-500/20 px-2 py-1 rounded-md text-cyan-100 text-sm">
                      {filteredPaths.length} Results
                      <button
                        className="ml-2 text-cyan-300 hover:text-cyan-100 transition-colors"
                        onClick={() => {
                          handleFilterChange("searchEndpoint", "");
                          setIsDropdownOpen(false);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-cyan-400" />
                  <input
                    type="text"
                    placeholder="Search endpoints..."
                    value={filters.searchEndpoint}
                    onChange={(e) => {
                      handleFilterChange("searchEndpoint", e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className={`w-full h-12 bg-gradient-to-r from-gray-700 to-gray-600 border border-cyan-500/30 rounded-xl pl-${
                      filters.searchEndpoint ? "20" : "14"
                    } pr-4 pl-12 text-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner transition-all`}
                  />
                </div>
                {isDropdownOpen && filteredPaths.length > 0 && (
                  <ul className="absolute z-10 w-full bg-gray-900/95 backdrop-blur-md rounded-xl mt-2 shadow-xl border border-cyan-500/20 overflow-hidden">
                    {filteredPaths.map((path) => (
                      <li
                        key={path}
                        onClick={() => {
                          handleSelectPath(path);
                          setIsDropdownOpen(false);
                        }}
                        className="p-3 text-white hover:bg-cyan-600/20 cursor-pointer transition-colors duration-200"
                      >
                        {path}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-2 px-3 py-1 bg-cyan-500/10 rounded-lg shadow-sm flex items-center justify-between">
                  <span className="text-cyan-100 font-medium text-sm">
                    Total Endpoints
                  </span>
                  <span className="text-white font-semibold">
                    {testCaseStats.totalEndpointsCount}
                  </span>
                </div>
              </div>
              <div>
                <select
                  value={filters.selectedMethod}
                  onChange={(e) =>
                    handleFilterChange("selectedMethod", e.target.value)
                  }
                  className="h-12 w-full bg-gradient-to-r from-gray-700 to-gray-600 border border-cyan-500/30 rounded-xl px-4 text-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner transition-all"
                >
                  <option value="" disabled className="text-gray-900">
                    {testCaseStats?.methods?.length > 0
                      ? "Choose a Method"
                      : "No Methods available"}
                  </option>
                  {testCaseStats?.methods?.map((method) => (
                    <option
                      key={method}
                      value={method}
                      className="text-gray-900"
                    >
                      {method}
                    </option>
                  ))}
                </select>
                <div className="flex items-center space-x-2 mt-2 flex-wrap gap-2">
                  {testCaseStats?.methods?.map((method) => (
                    <div
                      key={method}
                      className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-2 bg-gradient-to-r ${
                        testCaseStats.totalMethodCounts?.[method] > 0
                          ? "from-cyan-500/20 to-cyan-600/20 text-white"
                          : "from-gray-700 to-gray-600 text-cyan-200"
                      } shadow-sm`}
                    >
                      <span className="text-sm font-semibold">
                        {method}-
                        {testCaseStats.totalMethodCounts?.[method] ?? 0}
                        <span className="text-sm text-white/70 font-bold ml-1">
                          ({stats?.methods?.[method] ?? 0})
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )} */}
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
                      {new Date(row.lastRun).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
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
        <div className=" flex flex-col items-center justify-center space-y-4 h-64">
          <BeatLoader />
          {/* <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div> */}
          <p className="text-lg font-bold text-gray-700">
            Loading your Testcases...
          </p>
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
          className="fixed inset-0 flex justify-center items-center bg-black/20 bg-opacity-50"
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
