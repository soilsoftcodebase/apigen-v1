import API_URL from "../../API/config";

// Function to get details of a specific getAllPprojects
export async function getAllProjects() {
  try {
    const res = await fetch(`${API_URL}/ApiGen/Projects/allProjects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Use 'include' if you need to send cookies or auth headers
    });
    if (!res.ok) throw new Error("Failed to retrieve projects");

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error retrieving all projects:", err);
    return [];
  }
}
// Function to get test data for a specific project
export async function getTestData(projectName) {
  try {
    const res = await fetch(
      `${API_URL}/ApiGen/Projects/${projectName}/testdata`
    );
    if (!res.ok)
      throw Error(`Couldn't retrieve test data for project: ${projectName}`);

    const data = await res.json();
    return data;
  } catch (err) {
    throw Error("Error retrieving test data", err);
  }
}

// Function to update test data for a specific project
export async function updateTestData(projectName, updateData) {
  try {
    const res = await fetch(
      `${API_URL}/ApiGen/Projects/${projectName}/testdata=update`,
      {
        method: "PUT",
        body: JSON.stringify(updateData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok)
      throw Error(`Failed to update test data for project: ${projectName}`);
  } catch (err) {
    throw Error("Error updating test data", err);
  }
}
