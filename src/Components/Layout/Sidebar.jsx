import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

import {
  LayoutDashboard,
  Folder,
  FlaskConical,
  Database,
  Play,
  Gauge,
  Settings,
  User,
  LogOut,
  Menu,
  Bug,
  LogOutIcon,
} from "lucide-react";

// eslint-disable-next-line react/prop-types
const SidebarComponent = () => {
  const dispatch = useDispatch();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleLogout = () => {
    console.log("Logout initiated");
    dispatch(logout());
    console.log("Logout action dispatched");
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Projects", path: "/projects", icon: <Folder size={20} /> },
    { name: "Test Cases", path: "/tests", icon: <FlaskConical size={20} /> },
    { name: "Test Data", path: "/testdata", icon: <Database size={20} /> },
    { name: "Test Runs", path: "/runs", icon: <Play size={20} /> },
    {
      name: "Performance Tests",
      path: "/performance-tests",
      icon: <Gauge size={20} />,
    },
    { name: "Bugs", path: "/bugs", icon: <Bug size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        } bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-md  text-white p-5 shadow-xl flex flex-col justify-between border-r-gray-700 border-r`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-gray-700 ">
            {!isCollapsed && (
              <div>
                {/* <h1 className="text-lg font-bold text-gray-200">
                  Control Panel
                </h1>
                <p className="text-xs font-medium text-gray-400">
                  Admin Dashboard
                </p> */}
                <img src={logo} alt="APIGEN Logo" className="" />
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="text-gray-300 transition-transform transform hover:rotate-180 text-2xl ml-2"
            >
              <Menu size={30} />
            </button>
          </div>

          {/* Sidebar Menu */}
          <ul className="mt-6 space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "justify-start"
                  } p-3 transition-all duration-300 ease-in-out rounded-md ${
                    location.pathname === item.path
                      ? "bg-gray-700 backdrop-blur-md text-white"
                      : // bg-[#1e2939]
                        "bg-gradient-to-l from-gray-800 to-gray-800 backdrop-blur-md hover:bg-gray-700 text-gray-400"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-semibold">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Profile Section */}
        <div className="border-t border-gray-700 pt-4">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-start"
            } space-x-3 mb-4`}
          >
            {/* <User size={20} className="text-gray-400" />
            {!isCollapsed && (
              <div>
                <p className="text-sm font-semibold text-gray-200">
                  Soil Soft User
                </p>
                <Link
                  to="/profile"
                  className="text-xs font-medium text-gray-400 hover:text-gray-200"
                >
                  View Profile
                </Link>
              </div>
            )} */}
          </div>

          {/* Logout Button */}
          <button
            className={`flex items-center w-full p-3 text-sm font-semibold rounded-md bg-red-600 hover:bg-red-500 text-white ${
              isCollapsed ? "justify-center" : "justify-start"
            } transition-all duration-300 ease-in-out`}
            onClick={handleLogout}
          >
            <LogOutIcon size={20} />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div
        className={`flex-1 overflow-y-auto bg-gray-100 transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* The main content will be rendered here based on the current route */}
      </div>
    </div>
  );
};

export default SidebarComponent;
