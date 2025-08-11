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
import CreateGroup from "./components/Groups/CreateGroup";
import GroupList from "./components/Groups/GroupList";
import SubmissionHistory from "./components/Submissions/SubmissionHistory";
import UploadSubmission from "./components/Submissions/UploadSubmission";
import StudentProposals from "./pages/Student/StudentProposals";
import SupervisorProposals from "./pages/Supervisor/SupervisorProposals";
import SupervisorProjects from "./pages/Supervisor/SupervisorProjects";
import StudentProjects from "./pages/Student/StudentProjects";
import SupervisorMilestones from "./pages/Supervisor/SupervisorMilestones";
import StudentMilestones from "./pages/Student/StudentMilestones";
import StudentSubmissions from "./pages/Student/StudentSubmissions";
import SupervisorSubmissions from "./pages/Supervisor/SupervisorSubmissions";
import StudentDocuments from "./pages/Student/StudentDocuments";
import SupervisorDocuments from "./pages/Supervisor/SupervisorDocuments";
import SupervisorEvaluations from "./pages/Supervisor/SupervisorEvaluations";
import StudentEvaluations from "./pages/Student/StudentEvaluations";

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
            <Route path="/create-group" element={<CreateGroup />} />
            <Route path="/group-list" element={<GroupList />} />
            <Route path="/submission-history" element={<SubmissionHistory />} />
            <Route path="/upload-submission" element={<UploadSubmission />} />
            {/* Added proposal, project, milestone routes */}
            <Route path="/student/proposals" element={<StudentProposals />} />
            <Route
              path="/supervisor/proposals"
              element={<SupervisorProposals />}
            />
            <Route path="/student/projects" element={<StudentProjects />} />
            <Route
              path="/supervisor/projects"
              element={<SupervisorProjects />}
            />
            <Route path="/student/milestones" element={<StudentMilestones />} />
            <Route
              path="/supervisor/milestones"
              element={<SupervisorMilestones />}
            />
            {/* Submission feedback routes */}
            <Route
              path="/student/submissions"
              element={<StudentSubmissions />}
            />
            <Route
              path="/supervisor/submissions"
              element={<SupervisorSubmissions />}
            />
            {/* Document management routes */}
            <Route path="/student/documents" element={<StudentDocuments />} />
            <Route
              path="/supervisor/documents"
              element={<SupervisorDocuments />}
            />
            {/* Evaluation routes */}
            <Route
              path="/supervisor/evaluations"
              element={<SupervisorEvaluations />}
            />
            <Route
              path="/student/evaluations"
              element={<StudentEvaluations />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
export default App;
