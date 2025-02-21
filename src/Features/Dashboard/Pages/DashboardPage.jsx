import { useState, useEffect } from "react";
import { fetchProjectSummary } from "../dashboardService";

// Reusable components
import SummaryCard from "../Components/SummaryCard";
import Loader from "../Components/Loader";

// Import lucide icons from lucide-react
import {
  Folder,
  ClipboardList,
  CheckCircle,
  XCircle,
  AlertCircle,
  SkipForward,
} from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchProjectSummary(); // Fetch summary data
        setSummaryData(data);
      } catch (error) {
        console.error("Error fetching project summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-16 py-8 max-w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <header className="text-center mt-10 mb-0">
        <h2 className="text-3xl font-bold text-sky-800 animate-fade-in">
          Dashboard Overview
        </h2>
        <p className="text-gray-600 mt-2">
          Get a quick summary of your testing activity, project status, and more
          insights.
        </p>
        <div className="w-48 h-px bg-gray-300 my-6 mx-auto" />
      </header>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          <SummaryCard
            title="Projects"
            count={summaryData?.totalProjects || 0}
            subtitle="Total active projects under management"
            borderColor="border-blue-500"
            Icon={Folder}
            iconColor="text-blue-500"
          />
          <SummaryCard
            title="Test Cases Generated"
            count={summaryData?.totalTestCases || 0}
            subtitle="Total number of tests conducted"
            borderColor="border-green-500"
            Icon={ClipboardList}
            iconColor="text-green-500"
          />
          <SummaryCard
            title="Passed Tests"
            count={summaryData?.totalPassed || 0}
            subtitle="Successful tests that passed validation"
            borderColor="border-indigo-500"
            Icon={CheckCircle}
            iconColor="text-indigo-500"
          />
          <SummaryCard
            title="Failed Tests"
            count={summaryData?.totalFailed || 0}
            subtitle="Tests that encountered errors or failures"
            borderColor="border-red-500"
            Icon={XCircle}
            iconColor="text-red-500"
          />
          <SummaryCard
            title="Blocked Tests"
            count={summaryData?.totalBlocked || 0}
            subtitle="Tests that are blocked by other dependencies"
            borderColor="border-yellow-500"
            Icon={AlertCircle}
            iconColor="text-yellow-500"
          />
          <SummaryCard
            title="Skipped Tests"
            count={summaryData?.totalSkipped || 0}
            subtitle="Tests that were skipped during execution"
            borderColor="border-purple-500"
            Icon={SkipForward}
            iconColor="text-purple-500"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
