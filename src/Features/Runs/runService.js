import API_URL from "../../API/config";

// Function to get details of a specific getAllPprojects

export async function getTestRunsByProject(projectName) {
  try {
    const res = await fetch(`${API_URL}/TestCases/${projectName}/gettestruns`);
    if (!res.ok)
      throw Error(`Couldn't retrieve test data for project: ${projectName}`);

    const data = await res.json();
    return data;
  } catch (err) {
    throw Error("Error retrieving test data", err);
  }
}

export async function deleteSingleTestRunById(testRunId) {
  try {
    const res = await fetch(`${API_URL}/ApiGen/Projects/testrun/${testRunId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error response from server:", errorData);
      throw Error(errorData.title || "Failed to delete test run");
    }

    return true;
  } catch (err) {
    console.error("Error deleting test run:", err);
    throw Error("Error deleting test run");
  }
}

export async function deleteAllTestRunsByProjectId(projectId) {
  try {
    const res = await fetch(`${API_URL}/ApiGen/Projects/${projectId}/testrun`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error response from server:", errorData);
      throw Error(errorData.title || "Failed to delete test runs");
    }

    return true;
  } catch (err) {
    console.error("Error deleting test runs:", err);
    throw Error("Error deleting test runs");
  }
}
