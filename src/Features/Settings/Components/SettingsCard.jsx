const SettingsCard = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transform hover:scale-105 transition-transform duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default SettingsCard;
