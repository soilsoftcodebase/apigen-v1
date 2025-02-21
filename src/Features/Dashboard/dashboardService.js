// const API_URL = "https://apigenbackend.soilsoft.ai:5001/api";
import API_URL from "../../API/config";

export async function fetchProjectSummary() {
  try {
    const res = await fetch(`${API_URL}/ApiGen/Projects/summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch project summary");
    }

    const data = await res.json(); // Assuming the API returns JSON
    return data; // Return the data for further processing
  } catch (err) {
    throw new Error("Error fetching project summary", err);
  }
}
