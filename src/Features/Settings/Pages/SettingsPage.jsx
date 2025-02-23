import GeneralSettings from "../Components/GeneralSettings";
import TestSettings from "../Components/TestSettings";
import NotificationSettings from "../Components/NotificationSettings";

const SettingsPage = () => {
  const handleSaveSettings = () => {
    alert("Settings saved!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex justify-center items-center">
      <div className="max-w-4xl mx-auto ">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Settings will be implement shortly!!
        </h1>
        {/* <GeneralSettings />
        <TestSettings />
        <NotificationSettings /> */}
        <div className="flex justify-center mt-8">
          {/* <button
            onClick={handleSaveSettings}
            className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-lg transition duration-300"
          >
            Save Settings
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
