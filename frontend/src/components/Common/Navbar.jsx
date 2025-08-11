import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faGraduationCap,
  faMoon,
  faSun,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import {
  getNotifications,
  markNotificationRead,
} from "../../services/announcements";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDashboardMobile = () => {
    setDashboardOpen(!dashboardOpen);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setDashboardOpen(false);
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

  const { user, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifError, setNotifError] = useState("");
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (user) fetchNotifications();
    // eslint-disable-next-line
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setNotifError("");
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      const data = await getNotifications(token);
      setNotifications(data);
    } catch (err) {
      setNotifError("Failed to load notifications");
    }
  };

  const handleMarkRead = async (id) => {
    try {
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      await markNotificationRead(id, token);
      fetchNotifications();
    } catch (err) {
      setNotifError("Failed to mark as read");
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
          {/* Notification Bell */}
          {user && (
            <div className="relative">
              <button
                className="focus:outline-none"
                onClick={() => setShowNotifications((s) => !s)}
              >
                <FontAwesomeIcon
                  icon={faBell}
                  className="text-xl text-gray-600 hover:text-blue-600"
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md z-50 max-h-96 overflow-y-auto">
                  <div className="p-2 border-b font-semibold">
                    Notifications
                  </div>
                  {notifError && (
                    <div className="text-red-600 text-xs p-2">{notifError}</div>
                  )}
                  {notifications.length === 0 ? (
                    <div className="p-2 text-gray-500">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 border-b last:border-b-0 ${
                          n.read ? "bg-white" : "bg-blue-50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">
                              {n.type.toUpperCase()}
                            </span>
                            : {n.message}
                            {n.link && (
                              <a
                                href={n.link}
                                className="text-blue-600 ml-2 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View
                              </a>
                            )}
                          </div>
                          {!n.read && (
                            <button
                              onClick={() => handleMarkRead(n.id)}
                              className="text-xs text-blue-600 ml-2"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(n.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
          {/* Dashboard link (role-based) */}
          {user?.role === "admin" && (
            <Link
              to="/admin-dashboard"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
          )}
          {user?.role === "student" && (
            <>
              <Link
                to="/student-dashboard"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/student/proposals"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Proposals
              </Link>
              <Link
                to="/student/projects"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Projects
              </Link>
              <Link
                to="/student/milestones"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Milestones
              </Link>
              <Link
                to="/student/submissions"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Submissions
              </Link>
              <Link
                to="/student/documents"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Documents
              </Link>
              <Link
                to="/student/evaluations"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Evaluations
              </Link>
              <Link
                to="/groups"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Groups
              </Link>
            </>
          )}
          {user?.role === "supervisor" && (
            <>
              <Link
                to="/supervisor-dashboard"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/supervisor/proposals"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Proposals
              </Link>
              <Link
                to="/supervisor/projects"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Projects
              </Link>
              <Link
                to="/supervisor/milestones"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Milestones
              </Link>
              <Link
                to="/supervisor/evaluations"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Evaluations
              </Link>
              <Link
                to="/supervisor/submissions"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Submissions
              </Link>
              <Link
                to="/supervisor/documents"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Documents
              </Link>
              <Link
                to="/groups"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                Groups
              </Link>
            </>
          )}
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
          {user && (
            <button
              onClick={logout}
              className="ml-4 text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          )}
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
          {/* Mobile Dashboard (role-based) */}
          {user?.role === "admin" && (
            <Link
              to="/admin-dashboard"
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-600 text-sm"
            >
              Dashboard
            </Link>
          )}
          {user?.role === "student" && (
            <>
              <Link
                to="/student-dashboard"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Dashboard
              </Link>
              <Link
                to="/student/proposals"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Proposals
              </Link>
              <Link
                to="/student/projects"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Projects
              </Link>
              <Link
                to="/student/milestones"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Milestones
              </Link>
              <Link
                to="/student/submissions"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Submissions
              </Link>
              <Link
                to="/student/documents"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Documents
              </Link>
              <Link
                to="/student/evaluations"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Evaluations
              </Link>
              <Link
                to="/groups"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Groups
              </Link>
            </>
          )}
          {user?.role === "supervisor" && (
            <>
              <Link
                to="/supervisor-dashboard"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Dashboard
              </Link>
              <Link
                to="/supervisor/proposals"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Proposals
              </Link>
              <Link
                to="/supervisor/projects"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Projects
              </Link>
              <Link
                to="/supervisor/milestones"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Milestones
              </Link>
              <Link
                to="/supervisor/evaluations"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Evaluations
              </Link>
              <Link
                to="/supervisor/submissions"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Submissions
              </Link>
              <Link
                to="/supervisor/documents"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Documents
              </Link>
              <Link
                to="/groups"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Groups
              </Link>
            </>
          )}
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
          {user && (
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
