import { useState } from "react";
import SettingsCard from "./SettingsCard";

const TestSettings = () => {
  const [timeout, setTimeoutValue] = useState(30);
  const [retryCount, setRetryCount] = useState(3);

  return (
    <SettingsCard title="Test Settings">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Test Timeout (sec)
          </label>
          <input
            type="number"
            value={timeout}
            onChange={(e) => setTimeoutValue(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Retry Count
          </label>
          <input
            type="number"
            value={retryCount}
            onChange={(e) => setRetryCount(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300"
          />
        </div>
      </div>
    </SettingsCard>
  );
};

export default TestSettings;
