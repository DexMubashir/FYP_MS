import { useState, useEffect } from "react";
import {
  FaBook,
  FaCalendarAlt,
  FaClipboardList,
  FaBell,
  FaGraduationCap,
  FaChartLine,
  FaUser,
  FaSearch,
} from "react-icons/fa";

const StudentsDashboard = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data - in a real app, you would fetch this from an API
  useEffect(() => {
    // Mock announcements data
    const mockAnnouncements = [
      {
        id: 1,
        title: "Midterm Exam Schedule",
        content:
          "The midterm exam schedule has been posted. Please check the exams section for your specific dates and times.",
        date: "2023-06-15",
        priority: "high",
        course: "All Courses",
      },
      {
        id: 2,
        title: "Library Extended Hours",
        content:
          "The library will have extended hours during finals week, open until 2 AM.",
        date: "2023-06-10",
        priority: "medium",
        course: "General",
      },
    ];

    // Mock courses data
    const mockCourses = [
      {
        id: 1,
        code: "CS-401",
        name: "Advanced Algorithms",
        professor: "Dr. Smith",
        schedule: "Mon/Wed 10:00-11:30",
        progress: 65,
        grade: "A-",
      },
      {
        id: 2,
        code: "MATH-301",
        name: "Linear Algebra",
        professor: "Prof. Johnson",
        schedule: "Tue/Thu 13:00-14:30",
        progress: 80,
        grade: "B+",
      },
      {
        id: 3,
        code: "ENG-201",
        name: "Technical Writing",
        professor: "Dr. Lee",
        schedule: "Fri 9:00-12:00",
        progress: 45,
        grade: "A",
      },
    ];

    // Mock assignments data
    const mockAssignments = [
      {
        id: 1,
        title: "Algorithm Analysis Report",
        course: "CS-401",
        dueDate: "2023-06-20",
        status: "pending",
        submitted: false,
      },
      {
        id: 2,
        title: "Linear Algebra Problem Set 4",
        course: "MATH-301",
        dueDate: "2023-06-18",
        status: "pending",
        submitted: false,
      },
      {
        id: 3,
        title: "Technical Writing Draft",
        course: "ENG-201",
        dueDate: "2023-06-15",
        status: "submitted",
        submitted: true,
      },
    ];

    setAnnouncements(mockAnnouncements);
    setCourses(mockCourses);
    setAssignments(mockAssignments);
  }, []);

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingAssignments = assignments
    .filter((a) => !a.submitted)
    .slice(0, 3);
  const recentAnnouncements = announcements.slice(0, 3);

  const stats = [
    { name: "Current Courses", value: courses.length, icon: FaBook },
    {
      name: "Pending Assignments",
      value: assignments.filter((a) => !a.submitted).length,
      icon: FaClipboardList,
    },
    { name: "Average Grade", value: "B+", icon: FaGraduationCap },
    { name: "Attendance", value: "95%", icon: FaUser },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "assignments":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Assignments</h3>
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search assignments..."
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
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Course
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Due Date
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {assignment.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignment.course}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignment.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            assignment.submitted
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {assignment.submitted ? "Submitted" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          View
                        </button>
                        {!assignment.submitted && (
                          <button className="text-green-600 hover:text-green-900">
                            Submit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "grades":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Grades</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Course
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Professor
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
                      Current Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {course.code}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.professor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              course.progress > 70
                                ? "bg-green-600"
                                : course.progress > 40
                                ? "bg-yellow-500"
                                : "bg-red-600"
                            }`}
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {course.progress}% complete
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            course.grade[0] === "A"
                              ? "bg-green-100 text-green-800"
                              : course.grade[0] === "B"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {course.grade}
                        </span>
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
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Announcements
            </h3>

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
                          Posted on {announcement.date} • {announcement.course}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{announcement.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default: // courses
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
                      <stat.icon className="h-6 w-6" />
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

            {/* Upcoming Assignments */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Upcoming Assignments
              </h3>
              {upcomingAssignments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-start p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full text-yellow-600">
                        <FaClipboardList className="h-5 w-5" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {assignment.title}
                          </h4>
                          <span className="text-sm text-gray-500">
                            Due: {assignment.dueDate}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {assignment.course}
                        </p>
                      </div>
                      <button className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No upcoming assignments
                </p>
              )}
            </div>

            {/* Recent Announcements */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recent Announcements
              </h3>
              {recentAnnouncements.length > 0 ? (
                <div className="space-y-4">
                  {recentAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="flex items-start p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full text-blue-600">
                        <FaBell className="h-5 w-5" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {announcement.title}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {announcement.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {announcement.course}
                        </p>
                        <p className="mt-2 text-gray-600 text-sm">
                          {announcement.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent announcements
                </p>
              )}
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
          <h1 className="text-xl font-bold text-gray-900">Student Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    S
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Student
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
              onClick={() => setActiveTab("courses")}
              className={`${
                activeTab === "courses"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`${
                activeTab === "assignments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab("grades")}
              className={`${
                activeTab === "grades"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Grades
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

export default StudentsDashboard;
