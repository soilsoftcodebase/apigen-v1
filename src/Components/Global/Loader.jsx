/* eslint-disable react/prop-types */
import { BeatLoader, PulseLoader } from "react-spinners";
const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      {/* <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce delay-300"></div>
      </div> */}
      <BeatLoader />
      <p className="mt-4 text-lg font-bold text-gray-700">{message}</p>
    </div>
  );
};

export default Loader;
