import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import TasksPage from "./pages/TasksPage";
import TaskFormPage from "./pages/TaskFormPage";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import ErrorBoundary from "./common/ErrorBoundary";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

 const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("authToken"));

useEffect(() => {
  const handleStorageChange = () => {
    setIsLoggedIn(!!localStorage.getItem("authToken"));
  };

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);
 console.log("🔍 isLoggedIn:", isLoggedIn);

  useEffect(() => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    console.log("REACT_APP_API_BASE_URL:", baseUrl);
    if (!baseUrl) {
      toast.error("API base URL is missing. Check your .env file.");
    }
  }, []);
  
  console.log("✅ Full env:", process.env);
  return (
    <ErrorBoundary>
      <div className={isDarkMode ? "dark-theme" : "light-theme"}>
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
  path="/tasks"
  element={isLoggedIn ? <TasksPage /> : <Navigate to="/login" />}
/>
          <Route
            path="/tasks/add"
            element={isLoggedIn ? <TaskFormPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/tasks/edit/:id"
            element={isLoggedIn ? <TaskFormPage /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/tasks" />} />
        </Routes>
         {/* <button onClick={() => toast.success("✅ Toast is working!")}>
        Test Toast
      </button> */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: isDarkMode ? "#333" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            },
          }}
        />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
