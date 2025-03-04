import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const FeedbackFeature = () => {
  const user = useSelector((state) => state.auth.user);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    title: "",
    description: "",
    rating: 5,
  });

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...feedbackData,
          userId: user?.id,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsFeedbackOpen(false);
        setFeedbackData({ title: "", description: "", rating: 5 });
        alert("Feedback submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback");
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2"
      >
        <button
          onClick={() => setIsFeedbackOpen(true)}
          className="p-2 hover:bg-blue-900/30 rounded-full transition-all relative group"
          title="Share Feedback"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="text-xs text-gray-400 font-medium">Feedback</span>
          </div>
        </button>
      </motion.div>

      {/* Feedback Modal */}
      {isFeedbackOpen && (
        <div>
          <div className="">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed top-0 left-0 w-full min-h-screen bg-black/50 flex items-center justify-center p-4 inset-2 z-50 "
              onClick={() => setIsFeedbackOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 0 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Share Your Thoughts
                </h2>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Feedback Title"
                    value={feedbackData.title}
                    onChange={(e) =>
                      setFeedbackData({
                        ...feedbackData,
                        title: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:border-blue-400 transition"
                    required
                  />
                  <textarea
                    placeholder="Tell us more..."
                    value={feedbackData.description}
                    onChange={(e) =>
                      setFeedbackData({
                        ...feedbackData,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:border-blue-400 min-h-[100px] transition"
                    required
                  />
                  <div>
                    <label className="text-gray-600 text-sm">
                      Rating (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={feedbackData.rating}
                      onChange={(e) =>
                        setFeedbackData({
                          ...feedbackData,
                          rating: parseInt(e.target.value),
                        })
                      }
                      className="w-full p-2 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:border-blue-400 transition"
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsFeedbackOpen(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md"
                    >
                      Send Feedback
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackFeature;
