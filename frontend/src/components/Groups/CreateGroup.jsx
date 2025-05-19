import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserPlus,
  faSearch,
  faTimes,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mock data - in a real app, fetch from API
  useEffect(() => {
    const mockStudents = [
      {
        id: 1,
        name: "Ali Khan",
        email: "ali.khan@university.edu",
        department: "Computer Science",
      },
      {
        id: 2,
        name: "Sara Ahmed",
        email: "sara.ahmed@university.edu",
        department: "Computer Science",
      },
      {
        id: 3,
        name: "Mohammad Hassan",
        email: "mohammad.hassan@university.edu",
        department: "Electrical Engineering",
      },
      {
        id: 4,
        name: "Fatima Zahra",
        email: "fatima.zahra@university.edu",
        department: "Software Engineering",
      },
      {
        id: 5,
        name: "Ahmed Raza",
        email: "ahmed.raza@university.edu",
        department: "Computer Science",
      },
      {
        id: 6,
        name: "Zainab Malik",
        email: "zainab.malik@university.edu",
        department: "Information Technology",
      },
    ];
    setAvailableStudents(mockStudents);
  }, []);

  const filteredStudents = availableStudents.filter(
    (student) =>
      !selectedStudents.some((s) => s.id === student.id) &&
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddStudent = (student) => {
    if (selectedStudents.length >= 4) {
      setError("Maximum group size is 4 students");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setSelectedStudents([...selectedStudents, student]);
    setSearchTerm("");
  };

  const handleRemoveStudent = (id) => {
    setSelectedStudents(
      selectedStudents.filter((student) => student.id !== id)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("Group name is required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (selectedStudents.length < 2) {
      setError("At least 2 students are required to form a group");
      setTimeout(() => setError(""), 3000);
      return;
    }

    // In a real app, submit to backend
    console.log("Group created:", {
      name: groupName,
      description,
      members: selectedStudents,
    });

    // Show success message
    setSuccess("Group created successfully!");
    setTimeout(() => setSuccess(""), 3000);

    // Reset form
    setGroupName("");
    setDescription("");
    setSelectedStudents([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            <FontAwesomeIcon icon={faUsers} className="mr-2" />
            Create FYP Group
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Form your group for the Final Year Project (2-4 students)
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="h-5 w-5 text-green-400"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className="h-5 w-5 text-red-400"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            {/* Group Info Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Group Information
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="groupName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Group Name *
                  </label>
                  <input
                    type="text"
                    id="groupName"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., AI Research Team"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Brief description of your group's focus area"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Group Members Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Group Members
              </h3>

              {/* Selected Members */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Members ({selectedStudents.length}/4)
                </label>

                {selectedStudents.length === 0 ? (
                  <div className="text-center py-4 border-2 border-gray-300 border-dashed rounded-md">
                    <p className="text-sm text-gray-500">
                      No members selected yet
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {student.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {student.email}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveStudent(student.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Members */}
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Add Members
                </label>

                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="text-gray-400"
                    />
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search students by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {searchTerm && filteredStudents.length > 0 && (
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                      {filteredStudents.map((student) => (
                        <li key={student.id} className="p-3 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {student.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {student.email} • {student.department}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddStudent(student)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FontAwesomeIcon
                                icon={faUserPlus}
                                className="mr-1"
                              />
                              Add
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {searchTerm && filteredStudents.length === 0 && (
                  <div className="text-center py-4 border-2 border-gray-300 border-dashed rounded-md">
                    <p className="text-sm text-gray-500">No students found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={selectedStudents.length < 2 || !groupName.trim()}
              >
                Create Group
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
