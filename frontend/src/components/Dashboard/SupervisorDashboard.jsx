import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faClipboardList,
  faCalendarAlt,
  faChartLine,
  faBell,
  faSearch,
  faUserTie,
  faTasks,
  faComments,
  faFileAlt,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

const SupervisorDashboard = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data - in a real app, fetch from API
  useEffect(() => {
    // Mock FYP projects data
    const mockProjects = [
      {
        id: 1,
        title: "AI-Based Attendance System",
        students: ["Ali Khan", "Sara Ahmed"],
        progress: 65,
        status: "On Track",
        lastSubmission: "2023-06-10",
        nextDeadline: "2023-06-25",
      },
      {
        id: 2,
        title: "Blockchain for Academic Records",
        students: ["Mohammad Hassan"],
        progress: 40,
        status: "Needs Attention",
        lastSubmission: "2023-05-28",
        nextDeadline: "2023-06-20",
      },
      {
        id: 3,
        title: "IoT Campus Monitoring System",
        students: ["Fatima Zahra", "Ahmed Raza", "Zainab Malik"],
        progress: 85,
        status: "Ahead of Schedule",
        lastSubmission: "2023-06-12",
        nextDeadline: "2023-06-30",
      },
    ];

    // Mock meetings data
    const mockMeetings = [
      {
        id: 1,
        project: "AI-Based Attendance System",
        date: "2023-06-18",
        time: "14:00",
        status: "Scheduled",
        agenda: "Progress review of facial recognition module",
      },
      {
        id: 2,
        project: "Blockchain for Academic Records",
        date: "2023-06-15",
        time: "11:30",
        status: "Completed",
        agenda: "Initial prototype discussion",
      },
    ];

    // Mock announcements data
    const mockAnnouncements = [
      {
        id: 1,
        title: "FYP Midterm Evaluation Guidelines",
        content:
          "Please review the updated guidelines for midterm evaluations. All submissions must include a working prototype.",
        date: "2023-06-12",
        priority: "high",
      },
      {
        id: 2,
        title: "Workshop on Research Methodology",
        content:
          "There will be a workshop on advanced research methods next Wednesday at 3 PM in Lab 3.",
        date: "2023-06-08",
        priority: "medium",
      },
    ];

    setProjects(mockProjects);
    setMeetings(mockMeetings);
    setAnnouncements(mockAnnouncements);
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.students.some((student) =>
        student.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const stats = [
    { name: "Active Projects", value: projects.length, icon: faTasks },
    {
      name: "Students Supervised",
      value: projects.reduce((acc, curr) => acc + curr.students.length, 0),
      icon: faUsers,
    },
    {
      name: "Upcoming Meetings",
      value: meetings.filter((m) => m.status === "Scheduled").length,
      icon: faCalendarAlt,
    },
    { name: "Pending Reviews", value: 3, icon: faFileAlt },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800";
      case "Ahead of Schedule":
        return "bg-blue-100 text-blue-800";
      case "Needs Attention":
        return "bg-yellow-100 text-yellow-800";
      case "Behind Schedule":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "meetings":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              FYP Meetings
            </h3>

            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {meeting.project}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        <FontAwesomeIcon icon={faClock} className="mr-1" />
                        {meeting.date} at {meeting.time}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        meeting.status === "Scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {meeting.status}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">
                    <span className="font-medium">Agenda:</span>{" "}
                    {meeting.agenda}
                  </p>
                  <div className="mt-4 flex space-x-3">
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                      <FontAwesomeIcon icon={faComments} className="mr-1" />
                      Add Notes
                    </button>
                    {meeting.status === "Scheduled" && (
                      <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "evaluations":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Project Evaluations
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Project
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Students
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Submission Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Evaluation Status
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
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {project.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {project.students.join(", ")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.lastSubmission}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            project.status === "Needs Attention"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Evaluate
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Details
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
                FYP Announcements
              </h3>
              {/* Removed redundant bell icon and button */}
            </div>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`border-l-4 ${
                    announcement.priority === "high"
                      ? "border-red-500"
                      : "border-yellow-500"
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
                      {announcement.priority === "high" && (
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="text-red-500 text-xl"
                        />
                      )}
                    </div>
                    <p className="mt-2 text-gray-600">{announcement.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default: // projects
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
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
                      <FontAwesomeIcon icon={stat.icon} className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        {stat.name}
                      </h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Projects List */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  FYP Projects
                </h3>
                <div className="relative w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="text-gray-400"
                    />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search by student or project title..."
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
                        Project Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Students
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Progress
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
                        Next Deadline
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
                    {filteredProjects.map((project) => (
                      <tr key={project.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.students.join(", ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                project.progress > 70
                                  ? "bg-green-600"
                                  : project.progress > 40
                                  ? "bg-yellow-500"
                                  : "bg-red-600"
                              }`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {project.progress}% complete
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              project.status
                            )}`}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.nextDeadline}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            View
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            Message
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Upcoming FYP Deadlines
              </h3>
              <div className="space-y-3">
                {projects
                  .sort(
                    (a, b) =>
                      new Date(a.nextDeadline) - new Date(b.nextDeadline)
                  )
                  .slice(0, 3)
                  .map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full text-blue-600">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {project.title}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {project.nextDeadline}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {project.students.join(", ")}
                        </p>
                      </div>
                    </div>
                  ))}
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
          <h1 className="text-xl font-bold text-gray-900">
            Supervisor Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                    S
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Supervisor
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
              onClick={() => setActiveTab("projects")}
              className={`${
                activeTab === "projects"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Projects
            </button>
            <button
              onClick={() => setActiveTab("meetings")}
              className={`${
                activeTab === "meetings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Meetings
            </button>
            <button
              onClick={() => setActiveTab("evaluations")}
              className={`${
                activeTab === "evaluations"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Evaluations
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
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </main>
    </div>
  );
};

export default SupervisorDashboard;
