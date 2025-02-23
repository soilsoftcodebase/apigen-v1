/* eslint-disable react/prop-types */
import { useState } from "react";
import SettingsCard from "./SettingsCard";

const ToggleSwitch = ({ enabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
        enabled ? "bg-sky-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>
    </button>
  );
};

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  return (
    <SettingsCard title="Notification Settings">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Email Notifications
          </span>
          <ToggleSwitch
            enabled={emailNotifications}
            onToggle={() => setEmailNotifications(!emailNotifications)}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            SMS Notifications
          </span>
          <ToggleSwitch
            enabled={smsNotifications}
            onToggle={() => setSmsNotifications(!smsNotifications)}
          />
        </div>
      </div>
    </SettingsCard>
  );
};

export default NotificationSettings;
