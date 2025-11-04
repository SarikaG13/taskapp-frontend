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
import ScrollToTop from "./common/ScrollToTop";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ContactPage from "./pages/ContactPage";

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

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    console.log("REACT_APP_API_BASE_URL:", baseUrl);
    if (!baseUrl) {
      toast.error("API base URL is missing. Check your .env file.");
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className={isDarkMode ? "dark-theme" : "light-theme"}>
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tasks" element={isLoggedIn ? <TasksPage /> : <Navigate to="/login" />} />
          <Route path="/tasks/add" element={isLoggedIn ? <TaskFormPage /> : <Navigate to="/login" />} />
          <Route path="/tasks/:id" element={isLoggedIn ? <TaskFormPage /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/tasks" />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />

        </Routes>
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