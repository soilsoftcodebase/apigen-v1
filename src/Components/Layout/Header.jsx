/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Bell, User } from "lucide-react";
import FeedbackForm from "../../pages/FeedbackForm";
const Header = ({ isCollapsed }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <header
      className={`h-20 bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-md border-b border-gray-200/80 fixed top-0 right-0 z-10 transition-all duration-300 ease-in-out ${
        isCollapsed ? "left-20" : "left-64"
      }`}
    >
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="overflow-hidden text-white ">
            {/* Add your motion div here if needed */}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <button className="relative p-2 hover:bg-gray-200 rounded-lg group">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-base font-medium text-gray-400 ">
                SoilSoft User
              </span>
              <span className="text-[12px] font-normal text-gray-500 ">
                user@soilsoft.ai
              </span>
            </div>

            <button className="p-3 rounded-lg bg-gradient-to-r from-gray-500/10 to-gray-500/10 hover:from-gray-500/20 hover:to-gray-500/20 transition-all">
              <User className="w-6 h-6 text-gray-300" />
            </button>
          </div>

          {/* Feedback Form & Bugs Links */}
          <a
            href="/feedback"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            Feedback Form
          </a>
          <a
            href="/bugs"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            Bugs
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
