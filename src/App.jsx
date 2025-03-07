import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import LoginPage from "./Features/Authentication/Pages/Login";
import Layout from "../src/Components/Layout/Layout";
import Dashboard from "./Features/Dashboard/Pages/DashboardPage";
import ProjectsPage from "./Features/Projects/Pages/ProjectsPage";
import RunsPage from "./Features/Runs/Pages/RunsPage";

import PrivateRoute from "./Components/Layout/PrivateRoute";
import TestDataPage from "./Features/Test Data/Pages/TestDataPage";
import TestCasePage from "./Features/Tests/Pages/TestsPage";
import PerformanceTestPage from "./Features/Settings copy/Pages/PerformanceTestPage";
import SettingsPage from "./Features/Settings/Pages/SettingsPage";

import { ProjectProvider } from "./Contexts/ProjectContext";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Provider store={store}>
      <ProjectProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="runs" element={<RunsPage />} />
              <Route path="tests" element={<TestCasePage />} />
              <Route path="testdata" element={<TestDataPage />} />
              <Route
                path="performance-tests"
                element={<PerformanceTestPage />}
              />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
            theme="colored"
            style={{ marginTop: "25px" }} // Add margin to top
          />
        </Router>
      </ProjectProvider>
    </Provider>
  );
}

export default App;
