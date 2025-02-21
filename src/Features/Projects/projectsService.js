// require("dotenv").config();

// const API_URL = process.env.API_URL;
// console.log("Backend API URL:", API_URL);
// const API_URL = "https://apigenbackend.soilsoft.ai:5001/api";
import API_URL from "../../API/config";

export async function getAllProjects(options = {}) {
  try {
    const res = await fetch(`${API_URL}/ApiGen/Projects/allProjects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
    if (!res.ok) throw new Error("Failed to retrieve projects");

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error retrieving all projects:", err);
    return [];
  }
}

export async function createProject(saveProjectDto) {
  try {
    console.log("Payload:", saveProjectDto);
    const res = await fetch(`${API_URL}/ApiGen/Projects/createProject`, {
      method: "POST",
      body: JSON.stringify(saveProjectDto),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error response from server:", errorData);
      console.error("Validation errors:", errorData.errors);
      throw Error(errorData.title || "Failed to create project");
    }

    const { data } = await res.json();
    return data;
  } catch (err) {
    console.error("Error creating project:", err);
    throw Error("Error creating project");
  }
}

export async function generateTestCases(projectName) {
  try {
    const res = await fetch(
      `${API_URL}/ApiGen/Projects/${projectName}/genereatetescases`,
      {
        method: "POST",
      }
    );
    if (!res.ok)
      throw Error(`Failed to generate test cases for project: ${projectName}`);
  } catch (err) {
    throw Error("Error generating test cases", err);
  }
}
export async function saveAndGenerateTestCases(saveProjectDto) {
  try {
    console.log("Payload:", saveProjectDto);

    const res = await fetch(
      `${API_URL}/ApiGen/Projects/saveandgeneratetestcases`,
      {
        method: "POST",
        body: JSON.stringify(saveProjectDto),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const contentType = res.headers.get("Content-Type");

    // Check for JSON responses
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();

      if (data.IsProcessing) {
        console.warn("Test cases are still being processed:", data.Message);
        return data; // Return the processing response to the caller
      }

      if (res.ok) {
        console.log("Successful response:", data);
        return data; // Return the success response
      } else {
        console.error("Error response from server:", data);
        throw new Error(
          data.Message || "Failed to save and generate test cases"
        );
      }
    } else {
      // Handle non-JSON responses
      const text = await res.text();
      console.warn("Unexpected response format:", text);
      throw new Error(`Unexpected response from server: ${text}`);
    }
  } catch (err) {
    if (err.name === "TypeError") {
      console.error("Network error:", err.message);
      throw new Error("Network error. Please check your connection.");
    }

    console.error("Server or validation error:", err.message);
    throw new Error("Error creating project or generating test cases");
  }
}

// Function to fetchSwaggerInfo processing for a project
export async function fetchSwaggerInfo(baseUrl, version) {
  // Define possible paths based on the given base URL and version
  const url = new URL(baseUrl);
  const segments = url.pathname.trim("/").split("/");

  // Extract version from the last segment
  const versionFromUrl =
    segments.length > 0 ? segments[segments.length - 1] : "";

  // Reconstruct base URL without the version
  const SwaggerUrl = `${url.protocol}//${url.host}`;

  const pathsToTry = [
    `${baseUrl.replace("/index.html", "")}/${version}/swagger.json`, // Path with version, e.g., /v2/swagger.json
    `${baseUrl}/swagger/${version}/swagger.json`, // Nested version path, e.g., /swagger/v2/swagger.json
    `${baseUrl}/swagger.json`, // Default path, e.g., /swagger.json
    `${SwaggerUrl}/swagger/${versionFromUrl || version}/swagger.json`,
  ];

  // Try each path until a successful fetch
  for (let path of pathsToTry) {
    try {
      const response = await fetch(path);
      if (
        response.ok &&
        response.headers.get("content-type")?.includes("application/json")
      ) {
        const data = await response.json();

        // Extract necessary information
        const basePath = data.basePath || null;
        const title = data.info?.title || "Untitled Project";
        const fetchedVersion =
          data.info?.version || version || "Unknown Version";

        return {
          basePath,
          title,
          version: fetchedVersion,
        };
      }
    } catch (error) {
      console.warn(`Attempt to fetch ${path} failed`, error);
    }
  }

  // If all paths fail, return default error object
  console.error(
    "Failed to retrieve Swagger information from all attempted paths."
  );
  return {
    basePath: null,
    title: null,
    version: null,
  };
}

export async function saveAndGenerateTestCasesWithFile(formData) {
  try {
    const res = await fetch(`${API_URL}/ApiGen/Projects/uploadAndGenerate`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.title ||
          "Failed to save and generate test cases with file upload"
      );
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error saving and generating test cases with file:", err);
    throw new Error("Error saving and generating test cases with file");
  }
}

export async function createProjectWithFile(formData) {
  try {
    const res = await fetch(`${API_URL}/ApiGen/Projects/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.title || "Failed to create project with file upload"
      );
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error creating project with file:", err);
    throw new Error("Error creating project with file");
  }
}
