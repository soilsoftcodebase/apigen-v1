import { useState,useEffect } from "react";

export function useLocalStorageState(initialState,key){
    
    const [value, setValue] = useState(function () {
        const storedvalue = localStorage.getItem(key);
        return storedvalue?JSON.parse(storedvalue):initialState
      });

      useEffect(
        function () {
          localStorage.setItem(key, JSON.stringify(value));
        },
        [value,key]
      );
    return [value,setValue]
}


export function useSelectedProject(initialProject = null, key = "selectedProject") {
  // Load the stored value from local storage or use the initial state
  const [selectedProject, setSelectedProject] = useState(() => {
    const storedProject = localStorage.getItem(key);
    return storedProject ? JSON.parse(storedProject) : initialProject;
  });

  // Save changes to local storage whenever selectedProject changes
  useEffect(() => {
    const storedProject = localStorage.getItem(key);
    if (
      (!storedProject && selectedProject) || 
      (storedProject && JSON.stringify(selectedProject) !== storedProject)
    ) {
      if (selectedProject) {
        localStorage.setItem(key, JSON.stringify(selectedProject));
      } else {
        localStorage.removeItem(key); // Remove from localStorage if set to null
      }
    }
  }, [selectedProject, key]);

  // Method to update selected project only if it's different
  const updateSelectedProject = (project) => {
    if (project && project.id && project.name) {
      // Prevent setting the same object again
      setSelectedProject((prev) => 
        prev && prev.id === project.id && prev.name === project.name ? prev : project
      );
    } else {
      console.warn("Invalid project object. Must contain id and name.");
    }
  };

  return [selectedProject, updateSelectedProject];
}
