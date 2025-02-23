import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

const PerformanceTestForm = () => {
  const [formData, setFormData] = useState({
    testType: "Load Test",
    virtualUsers: "",
    rampUpTime: "",
    loopCount: "",
  });
  const [errors, setErrors] = useState({
    virtualUsers: false,
    rampUpTime: false,
    loopCount: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "testType") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      return;
    }
    if (value === "" || /^[0-9]+$/.test(value)) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: true }));
    }
  };

  const handleSave = () => {
    alert("Settings saved!");
  };

  const handleSaveAndRun = () => {
    setIsModalOpen(true);
  };

  const confirmSaveAndRun = () => {
    setIsModalOpen(false);
    alert("Settings saved and performance test started!");
  };

  const isFormValid =
    formData.virtualUsers &&
    formData.rampUpTime &&
    formData.loopCount &&
    !Object.values(errors).includes(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-sky-800 mb-6">
          Performance Tests
        </h1>

        {/* Project and API Selection */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <label className="font-bold text-gray-700">Select Project:</label>
            <select className="p-2 border border-gray-300 rounded-md w-48">
              <option value="All Projects">All Projects</option>
              {/* Map your projects here */}
            </select>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <label className="font-bold text-gray-700">Select API:</label>
            <select className="p-2 border border-gray-300 rounded-md w-48">
              <option value="Your APIs">Your APIs</option>
              {/* Map your APIs here */}
            </select>
          </div>
        </div>

        <form className="space-y-6">
          {/* Test Type */}
          <div className="animate-slide-up">
            <label
              htmlFor="testType"
              className="block text-sm font-bold text-gray-700"
            >
              Test Type
            </label>
            <select
              id="testType"
              name="testType"
              value={formData.testType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500 transition duration-300"
            >
              <option>Load Test</option>
              <option>Stress Test</option>
              <option>Spike Test</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose the type of performance test to run.
            </p>
          </div>

          {/* Virtual Users */}
          <div className="animate-slide-up">
            <label
              htmlFor="virtualUsers"
              className="block text-sm font-bold text-gray-700"
            >
              Number of Virtual Users
            </label>
            <input
              type="number"
              id="virtualUsers"
              name="virtualUsers"
              value={formData.virtualUsers}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.virtualUsers ? "border-red-500" : "border-gray-300"
              } p-2 shadow-sm focus:ring-sky-500 focus:border-sky-500 transition duration-300`}
              placeholder="Enter number of virtual users"
            />
            {errors.virtualUsers && (
              <p className="text-red-500 text-sm mt-1">
                Please enter a valid integer.
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Specify the number of users simulated in the test.
            </p>
          </div>

          {/* Ramp Up Time */}
          <div className="animate-slide-up">
            <label
              htmlFor="rampUpTime"
              className="block text-sm font-bold text-gray-700"
            >
              Ramp up time (seconds)
            </label>
            <input
              type="number"
              id="rampUpTime"
              name="rampUpTime"
              value={formData.rampUpTime}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.rampUpTime ? "border-red-500" : "border-gray-300"
              } p-2 shadow-sm focus:ring-sky-500 focus:border-sky-500 transition duration-300`}
              placeholder="Enter ramp up time in seconds"
            />
            {errors.rampUpTime && (
              <p className="text-red-500 text-sm mt-1">
                Please enter a valid integer.
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Time in seconds to ramp up the users.
            </p>
          </div>

          {/* Loop Count */}
          <div className="animate-slide-up">
            <label
              htmlFor="loopCount"
              className="block text-sm font-bold text-gray-700"
            >
              Loop Count
            </label>
            <input
              type="number"
              id="loopCount"
              name="loopCount"
              value={formData.loopCount}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.loopCount ? "border-red-500" : "border-gray-300"
              } p-2 shadow-sm focus:ring-sky-500 focus:border-sky-500 transition duration-300`}
              placeholder="Enter loop count"
            />
            {errors.loopCount && (
              <p className="text-red-500 text-sm mt-1">
                Please enter a valid integer.
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              The number of times the test should repeat.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={!isFormValid}
              className={`px-6 py-2 text-sm font-bold rounded-md shadow transform hover:scale-105 transition-all duration-200 ${
                isFormValid
                  ? "bg-gray-500 text-white hover:bg-gray-600"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleSaveAndRun}
              disabled={!isFormValid}
              className={`px-8 py-2 text-sm font-bold rounded-md shadow transform hover:scale-105 transition-all duration-200 ${
                isFormValid
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Save and Run
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmSaveAndRun}
        title="Confirm Save and Run"
        message="Are you sure you want to save the settings and start the test?"
      />
    </div>
  );
};

export default PerformanceTestForm;
