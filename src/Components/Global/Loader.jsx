/* eslint-disable react/prop-types */
import { BeatLoader } from "react-spinners";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center z-50 bg-white/25 bg-opcity-50">
      <BeatLoader />
      <p className="mt-4 text-lg font-bold text-white">{message}</p>
    </div>
  );
};

export default Loader;
