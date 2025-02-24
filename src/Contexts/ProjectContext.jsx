/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext} from "react";
import  API_URL  from "../API/config";
const ProjectContext = createContext();

// eslint-disable-next-line react/prop-types
function ProjectProvider ({ children })  {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("")

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        
        const data = await getAllProjects();
        setProjects(data || []);
        const storedProject=localStorage.getItem("selectedProject")
        if (storedProject) {
          setSelectedProject(storedProject);
        }

      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);
 

  return (
    <ProjectContext.Provider value={{ projects, selectedProject, setSelectedProject, loading ,setProjects}}>
      {children}
    </ProjectContext.Provider>
  );
};

function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined)
    throw new Error("useProjects must be used within a ProjectProvider.");
  return context;
}

async function getAllProjects(options = {}) {
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

export { ProjectProvider, useProjects };