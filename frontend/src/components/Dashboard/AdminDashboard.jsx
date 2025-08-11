import { useState, useEffect, useContext } from "react";
import {
  FaUsers,
  FaChartBar,
  FaCog,
  FaBell,
  FaSearch,
  FaUserShield,
  FaCalendarAlt,
  FaBook,
  FaClipboardList,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaPauseCircle,
  FaCommentDots,
} from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";
import { getAdminAnalytics } from "../../services/analytics";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const { user, isAuthenticated, accessToken } = useContext(AuthContext);

  // Sample data - in a real app, you would fetch this from an API
  useEffect(() => {
    // Mock announcements data
    const mockAnnouncements = [
      {
        id: 1,
        title: "System Maintenance Scheduled",
        content:
          "There will be scheduled maintenance this Friday from 10 PM to 2 AM.",
        date: "2023-06-15",
        priority: "high",
        category: "maintenance",
      },
      {
        id: 2,
        title: "New Feature Released",
        content:
          "The new student portal features are now available. Check them out!",
        date: "2023-06-10",
        priority: "medium",
        category: "update",
      },
    ];

    // Mock users data
    const mockUsers = [
      {
        id: 1,
        name: "John Doe",
        email: "john@university.edu",
        role: "student",
        status: "active",
        lastActive: "2023-06-14",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@university.edu",
        role: "professor",
        status: "active",
        lastActive: "2023-06-15",
      },
      {
        id: 3,
        name: "Admin User",
        email: "admin@university.edu",
        role: "admin",
        status: "active",
        lastActive: "2023-06-15",
      },
    ];

    // Mock reports data
    const mockReports = [
      {
        id: 1,
        title: "AI Chatbot",
        student: "John Doe",
        supervisor: "Dr. Smith",
        status: "approved",
        batch: "Batch-24",
        submittedOn: "2023-06-10",
      },
      {
        id: 2,
        title: "Web Security Analysis",
        student: "Jane Smith",
        supervisor: "Dr. Brown",
        status: "deferred",
        batch: "Batch-24",
        submittedOn: "2023-06-12",
      },
      {
        id: 3,
        title: "Mobile App for Health",
        student: "Ali Khan",
        supervisor: "Dr. Smith",
        status: "not approved",
        batch: "Batch-23",
        submittedOn: "2023-06-14",
      },
    ];

    setAnnouncements(mockAnnouncements);
    setUsers(mockUsers);
    setReports(mockReports);
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use accessToken from context
        const token = accessToken;
        console.log("JWT token being used for analytics:", token);
        const data = await getAdminAnalytics(token);
        setAnalytics(data);
      } catch (err) {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && user?.role === "admin" && accessToken) {
      fetchAnalytics();
    }
  }, [isAuthenticated, user, accessToken]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [searchReportTerm, setSearchReportTerm] = useState(""); // Add this state

  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchReportTerm.toLowerCase()) ||
      report.student.toLowerCase().includes(searchReportTerm.toLowerCase())
  );

  // Replace the stats array with real analytics data if available
  const stats =
    analytics && analytics.user_counts
      ? [
          {
            name: "Total Users",
            value: Object.values(analytics.user_counts).reduce(
              (a, b) => a + b,
              0
            ),
            icon: FaUsers,
            change: "",
            changeType: "increase",
          },
          {
            name: "Total Projects",
            value: analytics.project_counts
              ? Object.values(analytics.project_counts).reduce(
                  (a, b) => a + b,
                  0
                )
              : 0,
            icon: FaChartBar,
            change: "",
            changeType: "increase",
          },
          {
            name: "Total Proposals",
            value: analytics.proposal_counts
              ? Object.values(analytics.proposal_counts).reduce(
                  (a, b) => a + b,
                  0
                )
              : 0,
            icon: FaClipboardList,
            change: "",
            changeType: "increase",
          },
          {
            name: "Total Submissions",
            value: analytics.total_submissions ?? 0,
            icon: FaBook,
            change: "",
            changeType: "increase",
          },
        ]
      : [];

  // Handler for adding a comment
  const handleAddComment = (reportId) => {
    if (!newComment.trim()) return;
    setComments((prev) => ({
      ...prev,
      [reportId]: [
        ...(prev[reportId] || []),
        {
          text: newComment,
          author: "Admin",
          date: new Date().toLocaleString(),
        },
      ],
    }));
    setNewComment("");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                User Management
              </h3>
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Active
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastActive}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "announcements":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Announcements
              </h3>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Create New
              </button>
            </div>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`border-l-4 ${
                    announcement.priority === "high"
                      ? "border-red-500"
                      : announcement.priority === "medium"
                      ? "border-yellow-500"
                      : "border-green-500"
                  } bg-white shadow rounded-lg overflow-hidden`}
                >
                  <div className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {announcement.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Posted on {announcement.date}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FaClipboardList />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-800">
                          <FaBook />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{announcement.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              System Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">
                  General Settings
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site Name
                    </label>
                    <input
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      defaultValue="University Portal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maintenance Mode
                    </label>
                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option>Disabled</option>
                      <option>Enabled</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">
                  Security Settings
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password Policy
                    </label>
                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option>Medium (8+ characters)</option>
                      <option>Strong (12+ characters with complexity)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Timeout
                    </label>
                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Save Settings
              </button>
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                Project Reports
              </h3>
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by student or project title..."
                  value={searchReportTerm}
                  onChange={(e) => setSearchReportTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Supervisor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Batch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Submitted On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.student}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.supervisor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.batch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${
                            report.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : report.status === "deferred"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {report.status === "approved" && (
                            <FaCheckCircle className="inline mr-1" />
                          )}
                          {report.status === "deferred" && (
                            <FaPauseCircle className="inline mr-1" />
                          )}
                          {report.status === "not approved" && (
                            <FaTimesCircle className="inline mr-1" />
                          )}
                          {report.status.charAt(0).toUpperCase() +
                            report.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.submittedOn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="text-blue-600 hover:underline flex items-center"
                          onClick={() => setSelectedReport(report.id)}
                        >
                          <FaCommentDots className="mr-1" /> View/Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Comment Section Modal/Panel */}
            {selectedReport && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSelectedReport(null)}
                  >
                    &times;
                  </button>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <FaCommentDots className="mr-2" /> Comments for Project
                  </h4>
                  <div className="mb-4 max-h-40 overflow-y-auto">
                    {(comments[selectedReport] || []).length === 0 ? (
                      <p className="text-gray-500 text-sm">No comments yet.</p>
                    ) : (
                      <ul>
                        {comments[selectedReport].map((comment, idx) => (
                          <li key={idx} className="mb-2">
                            <span className="font-semibold">
                              {comment.author}:
                            </span>{" "}
                            <span>{comment.text}</span>
                            <span className="text-xs text-gray-400 ml-2">
                              {comment.date}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      className="border rounded-l px-3 py-2 w-full"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
                      onClick={() => handleAddComment(selectedReport)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default: // overview
        return (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-10">Loading analytics...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-10">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white shadow rounded-lg p-4">
                    <div className="flex items-center">
                      <div
                        className={`p-3 rounded-full ${
                          index % 2 === 0
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">
                          {stat.name}
                        </h3>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </p>
                        {stat.change && (
                          <p
                            className={`text-sm ${
                              stat.changeType === "increase"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {stat.change} from last week
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {analytics && analytics.user_counts && (
              <div className="flex justify-end space-x-2 mb-4">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => {
                    // CSV export
                    const csvData = [];
                    csvData.push(["Users by Role"]);
                    Object.entries(analytics.user_counts).forEach(
                      ([role, count]) => {
                        csvData.push([role, count]);
                      }
                    );
                    csvData.push([""]);
                    csvData.push(["Projects by Status"]);
                    Object.entries(analytics.project_counts).forEach(
                      ([status, count]) => {
                        csvData.push([status, count]);
                      }
                    );
                    csvData.push([""]);
                    csvData.push(["Proposals by Status"]);
                    Object.entries(analytics.proposal_counts).forEach(
                      ([status, count]) => {
                        csvData.push([status, count]);
                      }
                    );
                    csvData.push([""]);
                    csvData.push(["Milestones by Status"]);
                    Object.entries(analytics.milestone_counts).forEach(
                      ([status, count]) => {
                        csvData.push([status, count]);
                      }
                    );
                    csvData.push([""]);
                    csvData.push(["Documents by Type"]);
                    Object.entries(analytics.document_counts).forEach(
                      ([type, count]) => {
                        csvData.push([type, count]);
                      }
                    );
                    csvData.push([""]);
                    csvData.push([
                      "Total Submissions",
                      analytics.total_submissions,
                    ]);
                    csvData.push([
                      "Average Evaluation Score",
                      analytics.avg_evaluation_score,
                    ]);
                    csvData.push([
                      "Overdue Milestones",
                      analytics.overdue_milestones,
                    ]);
                    const csv = Papa.unparse(csvData);
                    const blob = new Blob([csv], {
                      type: "text/csv;charset=utf-8;",
                    });
                    saveAs(blob, "analytics_report.csv");
                  }}
                >
                  Export CSV
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => {
                    // PDF export
                    const doc = new jsPDF();
                    let y = 10;
                    doc.setFontSize(14);
                    doc.text("Analytics Report", 10, y);
                    y += 10;
                    doc.setFontSize(10);
                    doc.text("Users by Role:", 10, y);
                    y += 6;
                    Object.entries(analytics.user_counts).forEach(
                      ([role, count]) => {
                        doc.text(`${role}: ${count}`, 14, y);
                        y += 6;
                      }
                    );
                    y += 4;
                    doc.text("Projects by Status:", 10, y);
                    y += 6;
                    Object.entries(analytics.project_counts).forEach(
                      ([status, count]) => {
                        doc.text(`${status}: ${count}`, 14, y);
                        y += 6;
                      }
                    );
                    y += 4;
                    doc.text("Proposals by Status:", 10, y);
                    y += 6;
                    Object.entries(analytics.proposal_counts).forEach(
                      ([status, count]) => {
                        doc.text(`${status}: ${count}`, 14, y);
                        y += 6;
                      }
                    );
                    y += 4;
                    doc.text("Milestones by Status:", 10, y);
                    y += 6;
                    Object.entries(analytics.milestone_counts).forEach(
                      ([status, count]) => {
                        doc.text(`${status}: ${count}`, 14, y);
                        y += 6;
                      }
                    );
                    y += 4;
                    doc.text("Documents by Type:", 10, y);
                    y += 6;
                    Object.entries(analytics.document_counts).forEach(
                      ([type, count]) => {
                        doc.text(`${type}: ${count}`, 14, y);
                        y += 6;
                      }
                    );
                    y += 4;
                    doc.text(
                      `Total Submissions: ${analytics.total_submissions}`,
                      10,
                      y
                    );
                    y += 6;
                    doc.text(
                      `Average Evaluation Score: ${analytics.avg_evaluation_score}`,
                      10,
                      y
                    );
                    y += 6;
                    doc.text(
                      `Overdue Milestones: ${analytics.overdue_milestones}`,
                      10,
                      y
                    );
                    doc.save("analytics_report.pdf");
                  }}
                >
                  Export PDF
                </button>
              </div>
            )}
            {analytics && analytics.user_counts && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                {/* Users by Role PieChart */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h4 className="font-medium mb-2">Users by Role</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={Object.entries(analytics.user_counts).map(
                          ([role, count]) => ({ name: role, value: count })
                        )}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {Object.entries(analytics.user_counts).map(
                          (entry, idx) => (
                            <Cell
                              key={`cell-${idx}`}
                              fill={["#8884d8", "#82ca9d", "#ffc658"][idx % 3]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Projects by Status BarChart */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h4 className="font-medium mb-2">Projects by Status</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={Object.entries(analytics.project_counts).map(
                        ([status, count]) => ({ name: status, count })
                      )}
                    >
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Proposals by Status BarChart */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h4 className="font-medium mb-2">Proposals by Status</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={Object.entries(analytics.proposal_counts).map(
                        ([status, count]) => ({ name: status, count })
                      )}
                    >
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Milestones by Status BarChart */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h4 className="font-medium mb-2">Milestones by Status</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={Object.entries(analytics.milestone_counts).map(
                        ([status, count]) => ({ name: status, count })
                      )}
                    >
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Documents by Type PieChart */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h4 className="font-medium mb-2">Documents by Type</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={Object.entries(analytics.document_counts).map(
                          ([type, count]) => ({ name: type, value: count })
                        )}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {Object.entries(analytics.document_counts).map(
                          (entry, idx) => (
                            <Cell
                              key={`cell-doc-${idx}`}
                              fill={
                                ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"][
                                  idx % 4
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="bg-white shadow rounded-lg p-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                More Analytics
              </h3>
              {analytics &&
              analytics.user_counts &&
              analytics.project_counts &&
              analytics.proposal_counts &&
              analytics.milestone_counts &&
              analytics.document_counts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <strong>Users by Role:</strong>
                    <ul>
                      {Object.entries(analytics.user_counts).map(
                        ([role, count]) => (
                          <li key={role}>
                            {role}: {count}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <strong>Projects by Status:</strong>
                    <ul>
                      {Object.entries(analytics.project_counts).map(
                        ([status, count]) => (
                          <li key={status}>
                            {status}: {count}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <strong>Proposals by Status:</strong>
                    <ul>
                      {Object.entries(analytics.proposal_counts).map(
                        ([status, count]) => (
                          <li key={status}>
                            {status}: {count}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <strong>Milestones by Status:</strong>
                    <ul>
                      {Object.entries(analytics.milestone_counts).map(
                        ([status, count]) => (
                          <li key={status}>
                            {status}: {count}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <strong>Documents by Type:</strong>
                    <ul>
                      {Object.entries(analytics.document_counts).map(
                        ([type, count]) => (
                          <li key={type}>
                            {type}: {count}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <strong>Average Evaluation Score:</strong>{" "}
                    {analytics.avg_evaluation_score?.toFixed(2) || "N/A"}
                  </div>
                  <div>
                    <strong>Overdue Milestones:</strong>{" "}
                    {analytics.overdue_milestones}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <strong>Users by Role:</strong>
                      <ul>
                        <li>Loading...</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Projects by Status:</strong>
                      <ul>
                        <li>Loading...</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Proposals by Status:</strong>
                      <ul>
                        <li>Loading...</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Milestones by Status:</strong>
                      <ul>
                        <li>Loading...</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Documents by Type:</strong>
                      <ul>
                        <li>Loading...</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Average Evaluation Score:</strong> N/A
                    </div>
                    <div>
                      <strong>Overdue Milestones:</strong> N/A
                    </div>
                  </div>
                  {/* Placeholder for charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                    <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center h-64">
                      <span className="text-gray-400">
                        User Role PieChart Loading...
                      </span>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center h-64">
                      <span className="text-gray-400">
                        Project Status BarChart Loading...
                      </span>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center h-64">
                      <span className="text-gray-400">
                        Proposal Status BarChart Loading...
                      </span>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center h-64">
                      <span className="text-gray-400">
                        Milestone Status BarChart Loading...
                      </span>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center h-64">
                      <span className="text-gray-400">
                        Document Type PieChart Loading...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full text-blue-600">
                    <FaUserShield className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      New admin user created
                    </p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 p-2 rounded-full text-green-600">
                    <FaBell className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      System announcement published
                    </p>
                    <p className="text-sm text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-full text-yellow-600">
                    <FaCog className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      System settings updated
                    </p>
                    <p className="text-sm text-gray-500">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="sr-only">View notifications</span>
              <FaBell className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    A
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Admin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`${
                activeTab === "announcements"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`${
                activeTab === "reports"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FaFileAlt className="mr-1" />
              Reports
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
