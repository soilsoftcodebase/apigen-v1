import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const TestCaseTable = ({
  testCases,
  expandedRows,
  hoveredRow,
  toggleRow,
  handleSelectAllTestCases,
  selectedTestCaseIds,
  getMethodColor,
  setSelectedPayload,
  handleSelectTestCase,
  selectAll,
  handleSelectAll,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-8 py-4 text-left text-sm font-semibold uppercase text-gray-800">
              <input
                type="checkbox"
                className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-blue-200 focus:ring-2 transition-all duration-300"
                checked={selectAll}
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
          {testCases.map((row) => (
            <React.Fragment key={row.id}>
              <tr
                className={`transition-colors ${
                  hoveredRow === row.id ? "bg-gray-50" : "bg-white"
                }`}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
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
                      <div className="bg-gradient-to-r from-cyan-950 to-sky-900 px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-white">
                            Test Cases
                          </h3>
                          <span className="text-sm text-gray-100">
                            {row.testCases.length} cases cases
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
                                    selectedTestCaseIds.includes(testCase.id)
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
                                      setSelectedPayload(testCase.requesturl)
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
  );
};

export default TestCaseTable;
