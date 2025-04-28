import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faGraduationCap,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardOpenMobile, setDashboardOpenMobile] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDashboardMobile = () => {
    setDashboardOpenMobile(!dashboardOpenMobile);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setDashboardOpenMobile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "disabled");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "enabled");
      setIsDarkMode(true);
    }
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon
            icon={faGraduationCap}
            className="text-blue-600 text-2xl"
          />
          <span className="text-xl font-semibold text-gray-800">
            FYP Management
          </span>
        </div>

        {/* Right: Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {/* Dashboard dropdown for desktop */}
          <div className="relative group">
            <div className="flex items-center space-x-1 cursor-pointer">
              <span className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200">
                Dashboard
              </span>
              <svg
                className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition duration-200"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.063a.75.75 0 111.08 1.04l-4.25 4.657a.75.75 0 01-1.08 0l-4.25-4.657a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="absolute left-0 mt-2 hidden group-hover:flex flex-col bg-white shadow-lg rounded-md transition-all duration-300 ease-in-out z-10 min-w-max">
              <Link
                to="/admin-dashboard"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/student-dashboard"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
              >
                Student Dashboard
              </Link>
              <Link
                to="/supervisor-dashboard"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
              >
                Supervisor Dashboard
              </Link>
            </div>
          </div>

          <Link
            to="/projects"
            className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
          >
            Projects
          </Link>
          <Link
            to="/announcements"
            className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
          >
            Announcements
          </Link>
          <Link
            to="/profile"
            className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
          >
            Profile
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-blue-600 focus:outline-none"
          >
            {menuOpen ? (
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            ) : (
              <FontAwesomeIcon icon={faBars} className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-screen pb-4 px-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col space-y-4 pt-4">
          {/* Mobile Dashboard Toggle */}
          <div>
            <button
              onClick={toggleDashboardMobile}
              className="w-full text-left text-gray-600 hover:text-blue-600 text-sm font-medium flex justify-between items-center"
            >
              Dashboard
              <span>{dashboardOpenMobile ? "▲" : "▼"}</span>
            </button>
            {dashboardOpenMobile && (
              <div className="flex flex-col mt-2 space-y-2 pl-4">
                <Link
                  to="/admin-dashboard"
                  onClick={toggleMenu}
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/student-dashboard"
                  onClick={toggleMenu}
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Student Dashboard
                </Link>
                <Link
                  to="/supervisor-dashboard"
                  onClick={toggleMenu}
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Supervisor Dashboard
                </Link>
              </div>
            )}
          </div>

          {/* Other Mobile Links */}
          <Link
            to="/projects"
            onClick={toggleMenu}
            className="text-gray-600 hover:text-blue-600 text-sm"
          >
            Projects
          </Link>
          <Link
            to="/announcements"
            onClick={toggleMenu}
            className="text-gray-600 hover:text-blue-600 text-sm"
          >
            Announcements
          </Link>
          <Link
            to="/profile"
            onClick={toggleMenu}
            className="text-gray-600 hover:text-blue-600 text-sm"
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
