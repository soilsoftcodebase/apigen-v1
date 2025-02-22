import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react"; // <-- import useState
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-500/50 flex">
      {/* Pass isCollapsed and setIsCollapsed to Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex-1 transition-all duration-300 ease-in-out">
        {/* Pass isCollapsed to Header so it can adjust its left property */}
        <Header isCollapsed={isCollapsed} />
        {/* Adjust main’s margin-left based on isCollapsed */}
        <main
          className={`pt-16 transition-all duration-300 ease-in-out`}
        >
        
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;