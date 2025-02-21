import { useSelector } from "react-redux";
import { Bell, Search, User, Plus, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="h-20 bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-md border-b border-gray-200/80 fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center">
          {/* <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tests, APIs, or reports..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div> */}
          {/* <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
            <Plus className="w-4 h-4" />
            <span>New Test</span>
          </button> */}
          <div className="overflow-hidden text-white ">
            {/* <motion.div
              className="flex space-x-20 whitespace-nowrap text-lg font-semibold"
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              <motion.span
                whileHover={{ scale: 1.15, color: "#ffdd57", rotate: 2 }}
                className="mx-4 transition-all"
              >
                🚀 Automate API Testing
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.15, color: "#ffdd57", rotate: -2 }}
                className="mx-4 transition-all"
              >
                ⚡ Generate, Execute, Validate
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.15, color: "#ffdd57", rotate: 2 }}
                className="mx-4 transition-all"
              >
                🔍 Ensure Reliability & Performance
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.15, color: "#ffdd57", rotate: -2 }}
                className="mx-4 transition-all"
              >
                💡 AI-Powered API Testing
              </motion.span>
            </motion.div> */}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-200 rounded-lg group">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-base font-medium text-gray-400 ">
                {/* {user?.name} */}
                SoilSoft User
              </span>
              <span className="text-[12px] font-normal text-gray-500 ">
                {/* {user?.name} */}
                user@soilsoft.ai
              </span>
            </div>

            <div className="relative group">
              <button className="p-3 rounded-lg bg-gradient-to-r from-gray-500/10 to-gray-500/10 group-hover:from-gray-500/20 group-hover:to-gray-500/20 transition-all">
                <User className="w-6 h-6 text-gray-300" />
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 hidden group-hover:block transform transition-all">
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
