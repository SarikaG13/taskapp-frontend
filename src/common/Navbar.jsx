import { Link, useNavigate } from "react-router-dom";
import ApiService from "../api/ApiService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faListCheck } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';

const Navbar = ({ isDarkMode, toggleTheme }) => {

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(ApiService.isAuthenticated());

 
useEffect(() => {
  setIsAuthenticated(ApiService.isAuthenticated());
}, []); 

 const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    ApiService.logout();
    setIsAuthenticated(false);
    toast.success("Logged out successfully.");
    navigate('/login');
  }
};

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/" className="logo-link">
                    <FontAwesomeIcon icon={faListCheck} /> Task Manager
                </Link>
            </div>

            <div className="desktop-nav">
                {/* Theme Toggle Button */}
                <button onClick={toggleTheme} className="nav-button theme-toggle">
                    <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
                </button>
                
                {isAuthenticated ? (
                    <>
                        <Link to="/tasks" className="nav-link">
                            My Tasks
                        </Link>
                        <button onClick={handleLogout} className="nav-button">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">
                            Login
                        </Link>
                        <Link to="/register" className="nav-link">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;