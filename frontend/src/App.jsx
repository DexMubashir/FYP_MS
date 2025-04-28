import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnnouncementFeed from "./components/Announcements/AnnouncementFeed";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Navbar from "./components/Common/Navbar";
import Footer from "./components/Common/Footer";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import SupervisorDashboard from "./components/Dashboard/SupervisorDashboard";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/announcements" element={<AnnouncementFeed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route
              path="/supervisor-dashboard"
              element={<SupervisorDashboard />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
export default App;
