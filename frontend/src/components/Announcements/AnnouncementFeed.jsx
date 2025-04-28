import { useState, useEffect } from "react";

const AnnouncementFeed = () => {
  // Sample announcements data
  const initialAnnouncements = [
    {
      id: 1,
      title: "FYP Proposal Submission Deadline",
      content:
        "The deadline for submitting your FYP proposals is next Friday, June 10th. Please ensure all required documents are submitted through the portal.",
      date: "2023-06-01",
      author: "Dr. Smith",
      priority: "high",
      category: "deadline",
    },
    {
      id: 2,
      title: "Workshop on Research Methodology",
      content:
        "There will be a workshop on research methodology next Wednesday from 2-4 PM in Room 302. Attendance is mandatory for all FYP students.",
      date: "2023-05-28",
      author: "Prof. Johnson",
      priority: "medium",
      category: "workshop",
    },
    {
      id: 3,
      title: "Updated Submission Guidelines",
      content:
        "Please review the updated submission guidelines document available in the resources section. Some formatting requirements have changed.",
      date: "2023-05-25",
      author: "Dr. Lee",
      priority: "low",
      category: "update",
    },
    {
      id: 4,
      title: "FYP Progress Meeting Schedule",
      content:
        "The schedule for progress meetings has been posted. Please check your assigned time slot and prepare a 5-minute presentation.",
      date: "2023-05-20",
      author: "Prof. Brown",
      priority: "medium",
      category: "meeting",
    },
    {
      id: 5,
      title: "Library Resources for FYP",
      content:
        "The library has compiled a list of recommended resources for FYP students. Access them through the library portal using your student credentials.",
      date: "2023-05-15",
      author: "Library Staff",
      priority: "low",
      category: "resource",
    },
  ];

  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [filteredAnnouncements, setFilteredAnnouncements] =
    useState(initialAnnouncements);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    priority: "medium",
    category: "update",
  });

  // Filter announcements based on search and filters
  useEffect(() => {
    let results = announcements;

    if (searchTerm) {
      results = results.filter(
        (announcement) =>
          announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter !== "all") {
      results = results.filter(
        (announcement) => announcement.priority === priorityFilter
      );
    }

    if (categoryFilter !== "all") {
      results = results.filter(
        (announcement) => announcement.category === categoryFilter
      );
    }

    setFilteredAnnouncements(results);
  }, [searchTerm, priorityFilter, categoryFilter, announcements]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePriorityFilterChange = (e) => {
    setPriorityFilter(e.target.value);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const toggleExpand = (id) => {
    if (expandedAnnouncement === id) {
      setExpandedAnnouncement(null);
    } else {
      setExpandedAnnouncement(id);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const announcement = {
      id: announcements.length + 1,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      date: new Date().toISOString().split("T")[0],
      author: "Current User",
      priority: newAnnouncement.priority,
      category: newAnnouncement.category,
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: "",
      content: "",
      priority: "medium",
      category: "update",
    });
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(
      announcements.filter((announcement) => announcement.id !== id)
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "deadline":
        return <i className="fas fa-calendar-times text-red-500"></i>;
      case "workshop":
        return <i className="fas fa-chalkboard-teacher text-blue-500"></i>;
      case "update":
        return <i className="fas fa-bullhorn text-purple-500"></i>;
      case "meeting":
        return <i className="fas fa-users text-green-500"></i>;
      case "resource":
        return <i className="fas fa-book text-indigo-500"></i>;
      default:
        return <i className="fas fa-info-circle text-gray-500"></i>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Announcements Feed
      </h1>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={priorityFilter}
              onChange={handlePriorityFilterChange}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <select
              className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={categoryFilter}
              onChange={handleCategoryFilterChange}
            >
              <option value="all">All Categories</option>
              <option value="deadline">Deadlines</option>
              <option value="workshop">Workshops</option>
              <option value="update">Updates</option>
              <option value="meeting">Meetings</option>
              <option value="resource">Resources</option>
            </select>
          </div>
        </div>
      </div>

      {/* Create New Announcement (Admin/Supervisor View) */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Create New Announcement
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={newAnnouncement.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows="3"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={newAnnouncement.content}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={newAnnouncement.priority}
                onChange={handleInputChange}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={newAnnouncement.category}
                onChange={handleInputChange}
              >
                <option value="deadline">Deadline</option>
                <option value="workshop">Workshop</option>
                <option value="update">Update</option>
                <option value="meeting">Meeting</option>
                <option value="resource">Resource</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i className="fas fa-plus mr-2"></i> Post Announcement
            </button>
          </div>
        </form>
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className={`announcement-card fade-in bg-white rounded-lg shadow overflow-hidden priority-${announcement.priority}`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getCategoryIcon(announcement.category)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Posted by {announcement.author} on {announcement.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                        announcement.priority
                      )}`}
                    >
                      {announcement.priority.charAt(0).toUpperCase() +
                        announcement.priority.slice(1)}
                    </span>
                    <button
                      onClick={() => toggleExpand(announcement.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedAnnouncement === announcement.id ? (
                        <i className="fas fa-chevron-up"></i>
                      ) : (
                        <i className="fas fa-chevron-down"></i>
                      )}
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(announcement.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                {expandedAnnouncement === announcement.id && (
                  <div className="mt-3 pl-8">
                    <p className="text-gray-700 whitespace-pre-line">
                      {announcement.content}
                    </p>
                    <div className="mt-3 flex space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        <i className="fas fa-share mr-1"></i> Share
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm">
                        <i className="fas fa-bookmark mr-1"></i> Save
                      </button>
                      <button className="text-purple-600 hover:text-purple-800 text-sm">
                        <i className="fas fa-flag mr-1"></i> Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <i className="fas fa-bell-slash text-4xl text-gray-300 mb-3"></i>
            <h3 className="text-lg font-medium text-gray-700">
              No announcements found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementFeed;
