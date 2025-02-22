import React from "react";
import { Edit3 } from "lucide-react";

const TestDataTableContent = ({
  testData,
  editRowId,
  handleEditChange,
  handleKeyDown,
  handleEditClick,
  handleSave,
  handleCancelEdit,
}) => {
  return (
    <div className="overflow-hidden rounded-lg shadow-lg max-w-full border border-gray-300">
      <div>
        <table className="min-w-full bg-white">
          <thead className="bg-gradient-to-r from-cyan-950 to-sky-900 text-white">
            <tr>
              <th className="p-4 text-left border-b border-gray-300 pl-10">
                Parameter Name
              </th>
              <th className="p-4 text-left border-b border-gray-300">
                Parameter Value
              </th>
              <th className="p-4 text-center border-b border-gray-300">Edit</th>
            </tr>
          </thead>
          <tbody>
            {testData?.map((item, index) => (
              <tr
                key={item.testDataId}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition-colors duration-200`}
              >
                <td className="p-4 text-left border-b border-gray-300 pl-10 font-medium text-gray-800">
                  {item.parameterName}
                </td>
                <td className="p-4 text-start border-b border-gray-300">
                  {editRowId === item.testDataId ? (
                    <input
                      type="text"
                      value={item.parameterValue || ""}
                      onChange={(e) =>
                        handleEditChange(
                          item.testDataId,
                          "parameterValue",
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => handleKeyDown(e, item.testDataId)}
                      className="w-full p-2 border border-gray-300 rounded text-center focus:outline-none focus:ring focus:ring-blue-500"
                    />
                  ) : (
                    item.parameterValue
                  )}
                </td>
                <td className="p-4 text-center border-b border-gray-300">
                  {editRowId === item.testDataId ? (
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded transition-transform transform hover:scale-105"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded transition-transform transform hover:scale-105"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditClick(item.testDataId)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-110"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestDataTableContent;
