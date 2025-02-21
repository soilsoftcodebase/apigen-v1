import React from "react";
import { Clipboard, Download, Trash } from "lucide-react";

const TestRunTable = ({
  filteredRunData,
  isAllExpanded,
  toggleAllRows,
  toggleRow,
  expandedRows,
  handleDownloadRun,
  handleDeleteTestRun,
  handleCopyFeedback,
  handleExpandContent,
  truncateText,
  getStatusStyle,
  setSelectedPayload,
}) => {
  return (
    <div className="overflow-auto rounded-lg shadow min-w-full">
      <table className="min-w-full table-auto bg-white border-collapse">
        <thead className="bg-gradient-to-r from-cyan-950 to-sky-900 text-white border-b border-gray-300">
          <tr>
            <th className="p-3 text-center border-r border-gray-200">
              <button
                onClick={toggleAllRows}
                className="text-white focus:outline-none"
              >
                {isAllExpanded ? "Collapse All" : "Expand All"}
              </button>
            </th>
            <th className="p-3 text-center border-r border-gray-200">Run ID</th>
            <th className="p-3 text-center border-r border-gray-200">
              Project Name
            </th>
            <th className="p-3 text-center border-r border-gray-200">
              Total Tests
            </th>
            <th className="p-3 text-center border-r border-gray-200">Passed</th>
            <th className="p-3 text-center border-r border-gray-200">Failed</th>
            <th className="p-3 text-center border-r border-gray-200">
              Blocked
            </th>
            <th className="p-3 text-center border-r border-gray-200">
              Skipped
            </th>
            <th className="p-3 text-center">Actions</th>
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
                <td className="p-3 text-center font-bold text-blue-600 border-r border-gray-200">
                  {run.blocked}
                </td>
                <td className="p-3 font-bold text-center">{run.skipped}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center items-center space-x-4">
                    <div className="relative group">
                      <Download
                        onClick={() => handleDownloadRun(run)}
                        className="w-6 h-6 text-gray-800 hover:text-blue-800 mr-5 cursor-pointer"
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden w-max px-3 py-1 bg-gray-800 text-white text-sm rounded shadow-lg group-hover:block">
                        Download Run
                      </div>
                    </div>
                    <div className="relative group">
                      <Trash
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTestRun(run.testRunId);
                        }}
                        className="w-6 h-6 text-gray-800 hover:text-red-700 cursor-pointer"
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
                    <div className="overflow-auto rounded-lg shadow-inner bg-white">
                      <table className="w-full bg-white border border-gray-300">
                        <thead className="bg-gradient-to-r from-cyan-700 to-sky-800 text-white">
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
                              <td className="p-2 font-bold text-center border-r border-gray-300">
                                {test.testCaseId}
                              </td>
                              <td className="p-2 font-bold text-center border-r border-gray-300">
                                {test.testCaseName}
                              </td>
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
                                    <Clipboard className="w-4 h-4 inline-block" />
                                  </div>
                                </div>
                              </td>
                              <td className="p-2 text-center border-r border-gray-300">
                                {test.method}
                              </td>
                              <td className="p-2 text-center border-r border-gray-300">
                                <div className="flex justify-center items-center space-x-2">
                                  <span
                                    onClick={() =>
                                      handleExpandContent(test.payload || "N/A")
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
                                    <Clipboard className="w-4 h-4 inline-block" />
                                  </div>
                                </div>
                              </td>
                              <td className="p-2 text-center border-r border-gray-300">
                                {test.actualResponseCode || "N/A"}
                              </td>
                              <td className="p-2 text-center border-r border-gray-300">
                                {test.response && test.response.length !== 0 ? (
                                  <button
                                    onClick={() =>
                                      setSelectedPayload(test.response || "N/A")
                                    }
                                    className="text-blue-600 underline hover:text-blue-800"
                                  >
                                    View Response
                                  </button>
                                ) : (
                                  "N/A"
                                )}
                              </td>
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
  );
};

export default TestRunTable;
