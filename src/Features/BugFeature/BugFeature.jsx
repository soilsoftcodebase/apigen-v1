import { useState } from "react";
import { Bug } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const BugFeature = () => {
  const user = useSelector((state) => state.auth.user);
  const [isBugOpen, setIsBugOpen] = useState(false);
  const [bugData, setBugData] = useState({
    title: "",
    description: "",
    severity: "Low",
    screenshot: null,
  });

  const handleBugSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", bugData.title);
    formData.append("description", bugData.description);
    formData.append("severity", bugData.severity);
    formData.append("userId", user?.id);
    if (bugData.screenshot) formData.append("screenshot", bugData.screenshot);

    try {
      const response = await fetch("/api/bugs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsBugOpen(false);
        setBugData({
          title: "",
          description: "",
          severity: "Low",
          screenshot: null,
        });
        alert("Bug reported successfully!");
      }
    } catch (error) {
      console.error("Error submitting bug:", error);
      alert("Failed to report bug");
    }
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
        <button
          onClick={() => setIsBugOpen(true)}
          className="p-2 hover:bg-red-900/30 rounded-full transition-all relative group"
          title="Report a Bug"
        >
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-red-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="text-xs text-gray-400 font-medium">
              Report a Bug
            </span>
          </div>
        </button>
      </motion.div>

      {/* Bug Report Modal */}
      {isBugOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-0 left-0 w-full min-h-screen bg-gray-900/40 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsBugOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 0 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Bug className="w-5 h-5 text-red-500" />
              Report an Issue
            </h2>
            <form onSubmit={handleBugSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Issue Title"
                value={bugData.title}
                onChange={(e) =>
                  setBugData({ ...bugData, title: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:border-red-400 transition"
                required
              />
              <textarea
                placeholder="Describe what happened..."
                value={bugData.description}
                onChange={(e) =>
                  setBugData({ ...bugData, description: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:border-red-400 min-h-[100px] transition"
                required
              />
              <div>
                <label className="text-gray-600 text-sm">Severity</label>
                <select
                  value={bugData.severity}
                  onChange={(e) =>
                    setBugData({ ...bugData, severity: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:border-red-400 transition"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="text-gray-600 text-sm">
                  Screenshot (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setBugData({ ...bugData, screenshot: e.target.files[0] })
                  }
                  className="w-full p-2 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 transition"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsBugOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
                >
                  Report Issue
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default BugFeature;
