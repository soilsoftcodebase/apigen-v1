import API_URL from "../../API/config";
export async function fetchTestCases(
  projectName,
  pageNumber = 1,
  pageSize = 25,
  method = null,
  testType = null,
  path = null
) {
  try {
    // Construct query parameters dynamically
    const params = { pageSize, pageNumber };

    if (method) params.method = method;
    if (testType) params.testType = testType;
    if (path) params.path = path;
    const queryString = new URLSearchParams(params).toString();

    const res = await fetch(
      `${API_URL}/TestCasesData/${projectName}/testcases?${queryString}`
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error response from server:", errorData);
      throw Error(errorData.title || "Failed to fetch test cases");
    }

    return await res.json(); // Use `await res.json()` to correctly extract response data
  } catch (error) {
    console.error("Error fetching test cases:", error);
    throw error;
  }
}

export async function fetchTestCaseInfo(projectName) {
  try {
    const res = await fetch(
      `${API_URL}/TestCasesData/${projectName}/testcases/info`
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error response from server:", errorData);
      throw Error(errorData.title || "Failed to delete test run");
    }
    //console.log(res.json);
    return res.json();
  } catch (error) {
    console.error("Error fetching test case info:", error);
    throw error;
  }
}

export async function getTestCases(projectName, pageNumber, pageSize) {
  try {
    const res = await fetch(
      `${API_URL}/ApiGen/Projects/${projectName}/testcases?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Use 'include' if you need to send cookies or auth headers
      }
    );
    console.log(res.json);
    if (!res.ok)
      throw Error(`Couldn't retrieve test cases for project: ${projectName}`);

    const data = await res.json();
    return data;
  } catch (err) {
    throw Error("Error retrieving test cases", err);
  }
}

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

export async function RunallTestCases(projectName) {
  const endpoint = `${API_URL}/TestCases/runalltestcases/${projectName}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  try {
    // Log the request details for debugging
    console.log("Requesting RunallTestCases:", endpoint, options);

    const res = await fetch(endpoint, options);

    // Check if the response is successful
    if (!res.ok) {
      // Try to parse error details if response has a JSON body
      let errorData = {};
      try {
        errorData = await res.json();
      } catch {
        console.error("Failed to parse error response as JSON.");
      }

      throw new Error(
        `Failed to execute test cases for project '${projectName}'. ` +
          `Error: ${errorData.message || res.statusText || "Unknown error"}`
      );
    }

    // Attempt to parse the response as JSON
    const contentType = res.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      console.log("Test cases executed successfully:", data);
      return data;
    } else {
      const text = await res.text();
      console.warn("Received non-JSON response:", text);
      throw new Error("Unexpected response format from the server.");
    }
  } catch (err) {
    // Log and rethrow the error with additional context
    console.error("Error executing test cases:", err);
    throw new Error(
      `Error executing test cases for project '${projectName}': ${err.message}`
    );
  }
}

export async function RunSelectedTestCase(projectName, testCaseList) {
  try {
    console.log("Payload:", testCaseList);
    const response = await fetch(
      `${API_URL}/TestCases/${projectName}/runtestcases`,
      {
        method: "POST",
        body: JSON.stringify(testCaseList),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Request failed", error);
    throw error;
  }
}
export async function addTestCaseToProject(projectName, testCaseData) {
  try {
    const res = await fetch(
      `${API_URL}/ApiGen/Projects/${projectName}/addtestcase`,
      {
        method: "POST",
        body: JSON.stringify(testCaseData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to add test case to project: ${projectName}`);
    }
    // Return the response for further use
  } catch (err) {
    throw new Error("Error adding test case", err);
  }
}
export async function getTestcaseData(projectName) {
  try {
    const res = await fetch(
      `${API_URL}/ApiGen/Projects/${projectName}/testcasedate`
    );
    if (!res.ok)
      throw Error(`Couldn't retrieve test data for project: ${projectName}`);

    const data = await res.json();
    return data;
  } catch (err) {
    throw Error("Error retrieving test data", err);
  }
}