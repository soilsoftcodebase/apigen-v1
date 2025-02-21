import React from "react";
import Table from "../Components/Table"; // Adjust the path as needed
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TestCasePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-sky-800">
          Test Case Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Monitor, manage, and analyze your test cases.
        </p>
      </header>
      <main>
        <Table />
      </main>
      <ToastContainer />
      <footer className="mt-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </div>
  );
};

export default TestCasePage;
