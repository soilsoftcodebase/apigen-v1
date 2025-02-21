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
    <div className="min-h-screen bg-gray-500/50">
      {/* Pass isCollapsed and setIsCollapsed to Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Pass isCollapsed to Header so it can adjust its left property */}
      <Header isCollapsed={isCollapsed} />

      {/* Adjust main’s margin-left based on isCollapsed */}
      <main
        className={`pt-16 transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <div className="">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
