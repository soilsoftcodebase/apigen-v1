import { useState } from "react";
import SettingsCard from "./SettingsCard";

const GeneralSettings = () => {
  const [apiKey, setApiKey] = useState("");
  const [projectName, setProjectName] = useState("Default Project");

  return (
    <SettingsCard title="General Settings">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter your project name"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300"
          />
        </div>
      </div>
    </SettingsCard>
  );
};

export default GeneralSettings;
