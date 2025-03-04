/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Bell, User } from "lucide-react";
import { motion } from "framer-motion";
import FeedbackFeature from "../../Features/FeedBackFeatures/FeedbackFeature";
import BugFeature from "../../Features/BugFeature/BugFeature";
const Header = ({ isCollapsed }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <header
      className={`h-22 bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-md border-b border-gray-200/80 fixed top-0 right-0 z-10 transition-all duration-300 ease-in-out ${
        isCollapsed ? "left-20" : "left-64"
      }`}
    >
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="overflow-hidden text-white"></div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          {/* <motion.button
            whileHover={{ scale: 1.1 }}
            className="relative p-2 hover:bg-gray-700 rounded-full group"
          >
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full"></span>
          </motion.button> */}

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-base font-medium text-gray-300">
                SoilSoft User
              </span>
              <span className="text-[12px] font-normal text-gray-500">
                user@soilsoft.ai
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-3 rounded-full bg-gray-700/30 hover:bg-gray-700/50 transition-all"
            >
              <User className="w-6 h-6 text-gray-300" />
            </motion.button>
          </div>

          {/* Vertical Divider */}
          <div className="h-10 w-px bg-gray-600/50"></div>

          {/* Features */}
          <div className="flex flex-col items-start ">
            <div className="-mb-1.5">
              <FeedbackFeature />
            </div>

            <BugFeature />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
