import { useState, useEffect } from "react";
import { getTestData, updateTestData } from "../testDataService";
import ProjectsDropdown from "../../../Components/Global/ProjectsDropdown";
import TestDataTableContent from "../Components/TestDataTable";
import Loader from "../../../Components/Global/Loader";
import { useProjects } from "../../../Contexts/ProjectContext";
import { BeatLoader } from "react-spinners";

const TestDataPage = () => {
  const { projects, selectedProject, setSelectedProject } = useProjects();
  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Sync local selectedProjectId with the global selectedProject value
  useEffect(() => {
    setSelectedProjectId(selectedProject || "");
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      const fetchTestData = async () => {
        try {
          setLoading(true);
          const data = await getTestData(selectedProject);
          setTestData(data || []);
          setHasChanges(false);
        } catch (error) {
          console.error("Error fetching test data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTestData();
    }
  }, [selectedProject]);

  const handleEditChange = (testDataId, field, value) => {
    setTestData((prevData) =>
      prevData.map((item) =>
        item.testDataId === testDataId ? { ...item, [field]: value } : item
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      if (!selectedProject) return;
      await updateTestData(selectedProject, testData);
      setHasChanges(false);
      setEditRowId(null);
    } catch (error) {
      console.error("Error updating test data:", error);
    }
  };

  const handleEditClick = (testDataId) => {
    setEditRowId(testDataId);
    const originalItem = testData.find(
      (item) => item.testDataId === testDataId
    );
    setOriginalData(originalItem);
  };

  const handleCancelEdit = () => {
    if (originalData) {
      setTestData((prevData) =>
        prevData.map((item) =>
          item.testDataId === originalData.testDataId ? originalData : item
        )
      );
    }
    setEditRowId(null);
    setHasChanges(false);
  };

  const handleKeyDown = (event, testDataId) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/90">
      <main className="container mx-auto px-8 py-8">
        <div className="container mx-auto p-6 max-w-full">
          <h1 className="text-3xl font-bold mb-2 text-start text-sky-800 animate-fade-in">
            Your Test Data
          </h1>
          <p className="text-gray-600">
            Manage and update your test data for the selected project.
          </p>
          <div className="w-full h-px bg-gray-300 my-6" />
          <div className="flex justify-between items-center mb-10">
            <ProjectsDropdown
              projects={projects}
              selectedProjectId={selectedProjectId}
              onProjectChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSelectedProject(e.target.value);
              }}
            />
          </div>

          {loading ? (
            // <Loader message="Loading ... " />
            <BeatLoader />
          ) : testData.length > 0 ? (
            <TestDataTableContent
              testData={testData}
              editRowId={editRowId}
              handleEditChange={handleEditChange}
              handleKeyDown={handleKeyDown}
              handleEditClick={handleEditClick}
              handleSave={handleSave}
              handleCancelEdit={handleCancelEdit}
            />
          ) : (
            <div className="text-center mt-4 font-bold text-gray-600 text-lg">
              Please select a project First !!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TestDataPage;
