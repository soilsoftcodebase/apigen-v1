/* eslint-disable react/prop-types */

const SummaryCard = ({
  title,
  count,
  subtitle,
  borderColor,
  Icon,
  iconColor,
}) => {
  return (
    <div
      className={`bg-gray-100 ${borderColor} border-l-4 p-6 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300`}
    >
      <div className="flex items-center mb-4">
        {Icon && <Icon className={`w-6 h-6 ${iconColor} mr-2`} />}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-4xl font-bold text-gray-800 mt-2">{count}</p>
      <p className="text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
};

export default SummaryCard;
