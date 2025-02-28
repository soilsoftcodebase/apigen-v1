import { useState } from "react";

const BugsReport = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    screenshot: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, screenshot: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Bug Report Submitted:", formData);
    alert("Bug report submitted successfully!");
    setFormData({ title: "", description: "", priority: "Medium", screenshot: null });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Report a Bug</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Bug Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Bug Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          ></textarea>
        </div>

        {/* Priority Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Screenshot Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Upload Screenshot (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition"
        >
          Submit Bug Report
        </button>
      </form>
    </div>
  );
};

export default BugsReport;
