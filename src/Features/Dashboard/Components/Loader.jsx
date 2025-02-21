const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="flex space-x-2 mt-10">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-300"></div>
      </div>
      <p className="mt-6 text-2xl font-semibold text-gray-700 animate-pulse">
        Preparing your dashboard...
      </p>
      <p className="text-gray-500 mt-2 text-lg">
        Gathering insights to boost your testing capabilities.
      </p>
    </div>
  );
};

export default Loader;
